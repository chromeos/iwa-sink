/**
 * Socket connection web component
 */
class SocketConnection extends HTMLElement {
  socket: TCPSocket | undefined;
  reader: ReadableStreamDefaultReader | undefined;
  address: string | undefined;
  port: number | undefined;
  incomingContent: HTMLElement | undefined;
  logElement: HTMLElement | undefined;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['address', 'port', 'log'];
  }

  attributeChangedCallback(
    property: string,
    oldValue: string,
    newValue: string,
  ) {
    if (oldValue === newValue) return;
    if (property === 'address') {
      this.address = newValue;
    }

    if (property === 'port') {
      this.port = parseInt(newValue);
    }

    if (property === 'log' && this.logElement) {
      console.log(`incoming content ${newValue}`);
      this.logElement?.setAttribute('input', newValue);
    }
  }
  /**
   * Setup when socket connection component is appended to DOM.
   */
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    const template = document
      .getElementById('socket-connection')
      ?.content.cloneNode(true);

    const logOutput = template.querySelector('#connection');

    const messageInput = template.querySelector('#messageInput');
    const sendButton = template.querySelector('#sendButton');
    const disconnectButton = template.querySelector('#disconnectButton');

    this.logElement = template.querySelector('#log');

    // automatically connect to server
    logOutput.textContent = 'Trying to connect...';
    disconnectButton.disabled = true;
    const connected = await this.connectToServer();
    if (connected) {
      disconnectButton.textContent = 'Disconnect';
      disconnectButton.disabled = false;
      logOutput.textContent = `Successfully connected to ${this.address} at port ${this.port}`;
    } else {
      disconnectButton.textContent = 'Remove socket';
      disconnectButton.disabled = false;
      logOutput.textContent = `Failed to connect to ${this.address} at port ${this.port}`;
    }

    sendButton.addEventListener('click', async (e) => {
      e.preventDefault();
      disconnectButton.disabled = true;

      const sendEvent = new CustomEvent('send', {
        bubbles: true,
        cancelable: false,
        detail: {
          message: messageInput.value,
        },
      });
      this.dispatchEvent(sendEvent);

      disconnectButton.disabled = false;
      messageInput.value = '';
    });

    disconnectButton.addEventListener('click', async () => {
      sendButton.disabled = true;
      messageInput.disabled = true;
      await this.disconnectButtonCallback(disconnectButton, logOutput);
    });

    shadow.append(template);
  }

  /**
   * Callback to handle disconnect button click events.
   * Updates UI and calls methods for disconnecting from server.
   */
  async disconnectButtonCallback(
    disconnectButton: HTMLButtonElement,
    logOutput: HTMLParagraphElement,
  ) {
    if (this.socket) {
      logOutput.textContent = 'Trying to disconnect...';
      disconnectButton.disabled = true;
      // disconnect from server
      const disconnected = await this.disconnectFromServer();
      if (disconnected) {
        logOutput.textContent = `Disconnected from ${this.address} at port ${this.port}`;
        const closeEvent = new CustomEvent('close', {
          bubbles: true,
          cancelable: false,
        });
        this.dispatchEvent(closeEvent);
      } else {
        disconnectButton.disabled = false;
        logOutput.textContent = `Failed to disconnect from ${this.address} at port ${this.port}`;
      }
    }
  }

  /**
   * Disconnect from server.
   */
  async disconnectFromServer(): Promise<boolean> {
    try {
      if (this.socket) {
        if (this.reader) {
          this.reader.releaseLock();
        }
        await this.socket.close();
      }
    } catch (e) {
      console.log(e);
      return Promise.resolve(false);
    }
    this.socket = undefined;
    return Promise.resolve(true);
  }

  /**
   * Connect to server.
   */
  async connectToServer(): Promise<boolean> {
    try {
      // Create socket
      if (this.address && this.port) {
        this.socket = new TCPSocket(this.address, this.port);
      }

      if (!this.socket) {
        return Promise.resolve(false);
      }
    } catch (e) {
      console.log(e);
      await this.disconnectFromServer();
      return Promise.resolve(false);
    }

    return Promise.resolve(true);
  }
}

customElements.define('socket-connection', SocketConnection);
export default {};
