/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class OAuthConnector {
  #redirectUri;
  #clientId;
  #clientSecret;
  #oauthScopes = [];
  #socketServer;
  #authenticationCode;
  #accessCode;
  #refreshCode;
  #promiseResolver;
  #promiseRejecter;

  #authentication_endpoint;
  #token_endpoint;

  constructor(authentication_endpoint, token_endpoint) {
    this.#authentication_endpoint = authentication_endpoint;
    this.#token_endpoint = token_endpoint;

    this.#socketServer = new TCPServerSocket("::");
  }

  getOAuthAccessCode(client_id, client_secret, scopes) {
    this.#clientId = client_id;
    this.#clientSecret = client_secret;
    this.#oauthScopes = scopes;

    const { promise, resolve, reject } = Promise.withResolvers();
    this.#promiseResolver = resolve;
    this.#promiseRejecter = reject;

    this.#socketServer.opened.then(
      (server) => {
        this.#redirectUri = `http://localhost:${server.localPort}`;
        this.#runHttpServer();
        this.#authenticate(this.#authentication_endpoint);
      },
    );

    return promise;
  }

  get authentication_token() {
    return this.#authenticationCode;
  }

  get access_token() {
    return this.#accessCode;
  }

  get refresh_token() {
    return this.#refreshCode;
  }

  #authenticate(endpoint) {
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    let form = document.createElement("form");
    form.setAttribute("method", "GET"); // Send as a GET request.
    form.setAttribute("action", endpoint);
    form.setAttribute("target", "_blank");

    // Parameters to pass to OAuth 2.0 endpoint.
    let params = {
      client_id: this.#clientId,
      redirect_uri: this.#redirectUri,
      response_type: "code",
      scope: this.#oauthScopes.join(" "),
      include_granted_scopes: "true",
      state: "pass-through value",
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
      let input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  async #runHttpServer() {
    const server =
      await this.#socketServer.opened;
    const connections = server.readable.getReader();

    while (true) {
      const { value: connection, done } = await connections.read();

      // Send the connection to the callback
      if (connection) {
        this.#connectionReceived(connection);
      }

      // Release the connection if we're done
      if (done) {
        connections.releaseLock();
        break;
      }
    }

    // Wait for the server to be closed
    await this.#socketServer.closed;
    this.#socketServer = undefined;
  }

  async #connectionReceived(connection) {
    return connection.opened.then(async (socket) => {
      const reader = socket.readable.getReader();
      const value = await this.#readStream(reader);
      const { success, html } = this.#generateResponse(value);
      await this.#writeStream(socket, html);

      connection.close();

      if (success) {
        const accessCode = await this.#getAccessCode();
        this.#promiseResolver(accessCode);
      }
    });
  }

  #generateResponse(value) {
    const text = new TextDecoder().decode(value);

    if (this.#processRequest(text)) {
      return {
        success: true,
        html: "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>You can close this page</h1>",
      };
    } else {
      return { success: false, html: "HTTP/1.1 400 KO" };
    }
  }

  #processRequest(text) {
    const lines = text.split("\r\n");

    if (lines[0].includes("state=pass-through%20value")) {
      let matches = lines[0].match(/code=(.*)[&$]/);
      this.#authenticationCode = matches[1];
      return true;
    } else {
      return false;
    }
  }

  async #getAccessCode() {
    // See https://developers.google.com/identity/protocols/oauth2/native-app#exchange-authorization-code

    const url_params =
      `?code=${this.#authenticationCode}&` +
      `client_id=${this.#clientId}&` +
      `client_secret=${this.#clientSecret}&` +
      `redirect_uri=${this.#redirectUri}&` +
      `grant_type=authorization_code`;

    const url = this.#token_endpoint + url_params;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.json());
        } else {
          return Promise.reject(
            new Error(response.status.toString + " - " + response.statusText),
          );
        }
      })
      .then((json) => {
        this.#accessCode = json.access_token;
        this.#refreshCode = json.refresh_token;

        return this.#accessCode;
      });
  }

  async #writeStream(socket, text) {
    const writer = socket.writable.getWriter();
    const encoder = new TextEncoder();

    let msg = encoder.encode(text);

    writer.write(msg);
    writer.releaseLock();
  }

  #readStream(reader) {
    return new Promise((res, rej) => {
      reader.read().then(({ value }) => {
        reader.releaseLock();
        res(value);
      });
    });
  }
}
