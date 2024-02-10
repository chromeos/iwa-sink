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
