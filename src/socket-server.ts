

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
  logHeader: HTMLElement | undefined;

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
      if (this.log && this.logHeader) {
        this.logHeader.textContent = 'Latest transmission'
      }
      this.logElement.textContent = this.log || '';
    }
  }

  attributeChangedCallback(property: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      return;
    }

    console.log(`Attribute ${property} changed from ${oldValue} to ${newValue}`)

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
    const template = document.getElementById('socket-server')?.content.cloneNode(true);

    // Add values to template
    this.portElement = template.querySelector('#port') as HTMLElement;

    this.addressElement = template.querySelector('#address') as HTMLElement;

    this.connectionsElement = template.querySelector('#connections') as HTMLElement;

    this.bytesElement = template.querySelector('#bytes') as HTMLElement;

    this.logElement = template.querySelector('#log') as HTMLElement;
    this.logHeader = template.querySelector('#log-header') as HTMLElement;

    shadow.append(template);
    this.update();
  }
}

customElements.define('socket-server', SocketServer);
export default {};