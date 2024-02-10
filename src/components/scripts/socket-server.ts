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

class SocketServer extends HTMLElement {
  server: TCPServerSocket | undefined;
  connections: number | undefined;
  bytes: number | undefined;
  address: string | undefined;
  port: number | undefined;
  log: string | undefined;
  portElement: HTMLElement | undefined;
  addressElement: HTMLElement | undefined;
  connectionsElement: HTMLElement | undefined;
  bytesElement: HTMLElement | undefined;
  logElement: HTMLElement | undefined;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['address', 'port', 'connections', 'bytes', 'log'];
  }

  update() {
    if (this.portElement) {
      this.portElement.textContent = this.port?.toString() || '';
    }

    if (this.addressElement) {
      this.addressElement.textContent = this.address || '';
    }

    if (this.connectionsElement) {
      this.connectionsElement.textContent = this.connections?.toString() || '0';
    }

    if (this.bytesElement) {
      this.bytesElement.textContent = this.bytes?.toString() || '0';
    }

    if (this.logElement) {
      if (this.log) {
        this.logElement.setAttribute('input', this.log || '');
      }
    }
  }

  attributeChangedCallback(
    property: string,
    oldValue: string,
    newValue: string,
  ) {
    if (oldValue === newValue) {
      return;
    }

    console.log(
      `Attribute ${property} changed from ${oldValue} to ${newValue}`,
    );

    switch (property) {
      case 'address':
        this.address = newValue;
        break;
      case 'port':
        this.port = parseInt(newValue);
        break;
      case 'connections':
        this.connections = parseInt(newValue);
        break;
      case 'bytes':
        this.bytes = parseInt(newValue);
        break;
      case 'log':
        this.log = newValue;
        break;
    }

    this.update();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const template = document
      .getElementById('socket-server')
      ?.content.cloneNode(true);

    console.log('IN');

    console.log(this.server);

    // Add values to template
    this.portElement = template.querySelector('#port') as HTMLElement;

    this.addressElement = template.querySelector('#address') as HTMLElement;

    this.connectionsElement = template.querySelector(
      '#connections',
    ) as HTMLElement;

    this.bytesElement = template.querySelector('#bytes') as HTMLElement;

    this.logElement = template.querySelector('#log') as HTMLElement;

    const messageInput = template.querySelector('#messageInput');
    const sendButton = template.querySelector('#sendButton');

    sendButton.addEventListener('click', async (e) => {
      e.preventDefault();
      const sendEvent = new CustomEvent('send', {
        bubbles: true,
        cancelable: false,
        detail: {
          message: messageInput.value,
        },
      });
      this.dispatchEvent(sendEvent);
      messageInput.value = '';
    });

    shadow.append(template);
    this.update();
  }
}

customElements.define('socket-server', SocketServer);
export default {};
