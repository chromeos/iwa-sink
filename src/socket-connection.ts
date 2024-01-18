/**
 * Socket connection web component
 */
class SocketConnection extends HTMLElement {
    socket: TCPSocket | undefined;
    connection: TCPSocketOpenInfo | undefined;
    address: string | undefined;
    port: number | undefined;

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['address', 'port'];
    }

    attributeChangedCallback(property : string, oldValue : string, newValue : string) {
        if (oldValue === newValue) return;
        if (property === 'address') {
            this.address = newValue;
        }

        if (property === 'port') {
            this.port = parseInt(newValue);
        }
    }
    /**
     * Setup when socket connection component is appended to DOM.
     */
    async connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});

        const template = document.getElementById('socket-connection')?.content.cloneNode(true);

        const logOutput = template.querySelector('#log');
        const messageInput = template.querySelector('#messageInput');
        const sendButton = template.querySelector('#sendButton');
        const disconnectButton = template.querySelector('#disconnectButton');

        // automatically connect to server
        logOutput.textContent = "Trying to connect...";
        disconnectButton.disabled = true;
        const connected = await this.connectToServer();
        if (connected) {
            disconnectButton.textContent = "Disconnect";
            disconnectButton.disabled = false;
            logOutput.textContent = `Successfully connected to ${this.address} at port ${this.port}`;
        } else {
            disconnectButton.textContent = "Remove socket";
            disconnectButton.disabled = false;
            logOutput.textContent = `Failed to connect to ${this.address} at port ${this.port}`;
        }


        sendButton.addEventListener('click', async () => {
            disconnectButton.disabled = true;
            await this.sendButtonCallback(messageInput, sendButton, logOutput);
            disconnectButton.disabled = false;
         });

        disconnectButton.addEventListener('click', async () => {
            sendButton.disabled = true;
            messageInput.disabled = true;
            await this.disconnectButtonCallback(disconnectButton, logOutput);
        });

        shadow.append( template );

    }
    /**
     * Callback to handle send message button click events.
     * Sends text input to connected server.
     */
    async sendButtonCallback(messageInput : HTMLInputElement, sendButton : HTMLButtonElement, logOutput : HTMLParagraphElement) {

        if (this.socket && this.connection) {
            logOutput.textContent = "Trying to send message...";
            sendButton.disabled = true;

            const writer = this.connection.writable.getWriter();
            const encoder = new TextEncoder();
            writer.write(encoder.encode(messageInput.value));
            writer.releaseLock();

            logOutput.textContent = `Message "${messageInput.value}" sent to ${this.address} at port ${this.port}`;
            sendButton.disabled = false;

        }
    }

    /**
     * Callback to handle disconnect button click events.
     * Updates UI and calls methods for disconnecting from server.
     */
    async disconnectButtonCallback(disconnectButton : HTMLButtonElement, logOutput : HTMLParagraphElement) {

        if (this.socket) {
            logOutput.textContent = "Trying to disconnect...";
            disconnectButton.disabled = true;
            // disconnect from server
            const disconnected = await this.disconnectFromServer();
            if (disconnected) {
                logOutput.textContent = `Disconnected from ${this.address} at port ${this.port}`;
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
            
            this.connection = await this.socket.opened;
        } catch (e) {
            console.log(e);
            await this.disconnectFromServer();
            return Promise.resolve(false);
        }

        return Promise.resolve(true);

    }
    
  }

  customElements.define('socket-connection', SocketConnection );
  export default {}
