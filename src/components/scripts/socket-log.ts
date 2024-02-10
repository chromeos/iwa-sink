class SocketLog extends HTMLElement {
  input: string | undefined;
  header: HTMLElement | undefined;
  log: HTMLElement | undefined;

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['input'];
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
      `Attribute: ${property} changed from ${oldValue} to ${newValue}`,
    );

    if (property === 'input') {
      this.input = newValue;
      if (this.header) {
        this.header.textContent = 'Latest transmission';
      }
      if (this.log) {
        this.log.textContent = newValue;
      }
    }
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const template = document
      .getElementById('socket-log')
      ?.content.cloneNode(true);

    // Add values to template
    this.header = template.querySelector('#log-header');
    this.log = template.querySelector('#log');

    shadow.append(template);
  }
}

customElements.define('socket-log', SocketLog);
export default {};
