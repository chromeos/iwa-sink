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

    /**
     * Setup when socket connection component is appended to DOM.
     */
    connectedCallback() {
        const shadow = this.attachShadow({mode: 'open'});

        const template = document.getElementById('socket-connection')?.content.cloneNode(true);

        const hostInput = template.querySelector('#hostname');
        const portInput = template.querySelector('#port');
        const logOutput = template.querySelector('#log');

        const connectButton = template.querySelector('#connectButton');
        connectButton.addEventListener('click', async () => {
           await this.connectButtonCallback(hostInput, portInput, connectButton, logOutput);
        });

        shadow.append( template );

    }

    /**
     * Callback to handle connect/disconnect button click events. 
     * Updates UI and calls methods to connect to or disconnect from server.
     */
    async connectButtonCallback(hostInput : HTMLInputElement, portInput : HTMLInputElement, connectButton : HTMLButtonElement, logOutput : HTMLParagraphElement) {
        this.address = hostInput.value;
        this.port = parseInt(portInput.value);
        if (this.socket) {
            logOutput.textContent = "Trying to disconnect...";
            connectButton.disabled = true;
            // disconnect from server
            const disconnected = await this.disconnectFromServer();
            if (disconnected) {
                hostInput.disabled = false;
                portInput.disabled = false;
                connectButton.textContent = "Connect";
                connectButton.disabled = false;
                logOutput.textContent = `Disconnected from ${this.address} at port ${this.port}`;
            } else {
                logOutput.textContent = `Failed to disconnect from ${this.address} at port ${this.port}`;
            }
        } else {
            hostInput.disabled = true;
            portInput.disabled = true;
            logOutput.textContent = "Trying to connect...";
            connectButton.disabled = true;
            // connect to server
            const connected = await this.connectToServer();
            if (connected) {
                connectButton.textContent = "Disconnect";
                connectButton.disabled = false;
                logOutput.textContent = `Successfully connected to ${this.address} at port ${this.port}`;
            } else {
                hostInput.disabled = false;
                portInput.disabled = false;
                connectButton.textContent = "Connect";
                connectButton.disabled = false;
                logOutput.textContent = `Failed to connect to ${this.address} at port ${this.port}`;
            }
        }
    }

    /**
     * Disconnect from server.
     */
    async disconnectFromServer(): Promise<boolean> {
        if (this.socket) {
            this.socket.close();
        }
        this.socket = undefined;
        return Promise.resolve(true);
    }

    /**
     * Connect to server and update the UI.
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
        
        // Do something random for now
        const writer = this.connection.writable.getWriter();
        const encoder = new TextEncoder();
        writer.write(encoder.encode('Hello Potatoh!'));
        writer.write(encoder.encode('Another potatoh!'));
        writer.releaseLock();
        // this.connection.writable.close();

        return Promise.resolve(true);

    }
    
  }

  customElements.define('socket-connection', SocketConnection );
  export default {}
