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
  #redirectUri: string;
  #clientId: string;
  #clientSecret: string;
  #oauthScopes: Array<string>;
  #socketServer: TCPServerSocket;
  #authenticationCode: string | undefined;
  #accessCode: string | undefined;
  #refreshCode: string | undefined;
  #promiseResolver: Promise<string> | undefined;
  #promiseRejecter: Promise<void> | undefined;

  #authenticationEndpoint: string;
  #tokenEndpoint: string;

  constructor(authentication_endpoint: string, token_endpoint: string) {
    this.#authenticationEndpoint = authentication_endpoint;
    this.#tokenEndpoint = token_endpoint;

    this.#socketServer = new TCPServerSocket('127.0.0.1');

    this.#redirectUri = '';
    this.#clientId = '';
    this.#clientSecret = '';
    this.#oauthScopes = [''];
  }

  getOAuthAccessCode(
    client_id: string,
    client_secret: string,
    scopes: Array<string>,
  ) {
    this.#clientId = client_id;
    this.#clientSecret = client_secret;
    this.#oauthScopes = scopes;

    const { promise, resolve, reject } = Promise.withResolvers();
    this.#promiseResolver = resolve;
    this.#promiseRejecter = reject;

    this.#socketServer.opened.then((server) => {
      this.#redirectUri = `http://localhost:${server.localPort}`;
      this.#runHttpServer();
      this.#authenticate(this.#authenticationEndpoint);
    });

    return promise;
  }

  get authentication_token(): string | undefined {
    return this.#authenticationCode;
  }

  get access_token(): string | undefined {
    return this.#accessCode;
  }

  get refresh_token(): string | undefined {
    return this.#refreshCode;
  }

  #authenticate(endpoint: string): void {
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    const form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', endpoint);
    form.setAttribute('target', '_blank');

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = new Map<string, string>([
      ['client_id', this.#clientId],
      ['redirect_uri', this.#redirectUri],
      ['response_type', 'code'],
      ['scope', this.#oauthScopes.join(' ')],
      ['include_granted_scopes', 'true'],
      ['state', 'pass-through value'],
    ]);

    // Add form parameters as hidden input values.
    params.forEach((value, key) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value);
      form.appendChild(input);
    });

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
  }

  async #runHttpServer(): Promise<void> {
    const server = await this.#socketServer.opened;
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
  }

  async #connectionReceived(connection: TCPSocket): Promise<void> {
    return connection.opened.then(async (socket) => {
      const reader = socket.readable.getReader();
      const value = await this.#readStream(reader);
      if (value == undefined) {
        return;
      }

      const { success, html } = this.#generateResponse(value);
      await this.#writeStream(socket, html);

      connection.close();

      if (success) {
        this.#accessCode = await this.#getAccessCode();
        if (this.#promiseResolver != undefined) {
          this.#promiseResolver(this.#accessCode);
        }
      }
    });
  }

  #generateResponse(value: AllowSharedBufferSource): {
    success: boolean;
    html: string;
  } {
    const text = new TextDecoder().decode(value);

    if (this.#processRequest(text)) {
      return {
        success: true,
        html: 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<h1>You can close this page</h1>',
      };
    } else {
      return { success: false, html: 'HTTP/1.1 400 KO' };
    }
  }

  #processRequest(text: string): boolean {
    const lines = text.split('\r\n');
    const params = lines[0].split(' ')[1].substring(2);
    const urlParams = new URLSearchParams(params);
    const state = urlParams.get('state');

    if (state != null && state == 'pass-through value') {
      const code = urlParams.get('code');
      if (code == null) {
        return false;
      }

      this.#authenticationCode = code;
      return true;
    } else {
      return false;
    }
  }

  async #getAccessCode(): Promise<string | undefined> {
    // See https://developers.google.com/identity/protocols/oauth2/native-appexchange-authorization-code

    const url_params =
      `?code=${this.#authenticationCode}&` +
      `client_id=${this.#clientId}&` +
      `client_secret=${this.#clientSecret}&` +
      `redirect_uri=${this.#redirectUri}&` +
      `grant_type=authorization_code`;

    const url = this.#tokenEndpoint + url_params;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.json());
        } else {
          return Promise.reject(
            new Error(response.status.toString + ' - ' + response.statusText),
          );
        }
      })
      .then((json) => {
        this.#accessCode = json.access_token;
        this.#refreshCode = json.refresh_token;

        return this.#accessCode;
      });
  }

  async #writeStream(socket: TCPSocketOpenInfo, text: string): Promise<void> {
    const writer = socket.writable.getWriter();
    const encoder = new TextEncoder();

    const msg = encoder.encode(text);

    writer.write(msg);
    writer.releaseLock();
  }

  async #readStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ): Promise<Uint8Array | undefined> {
    const { value } = await reader.read();
    reader.releaseLock();
    return value;
  }
}
