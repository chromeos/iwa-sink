import { collectConnections, readStream, writeStream } from "./streams";
import './socket-connection';
import './socket-server';

const server = new TCPServerSocket('::');

let address: string;
let port: number;
let connections = 0;
let addSocketButton : HTMLButtonElement;
const serverElem = document.createElement('socket-server');
let bytes = 0;


collectConnections(
  server,
  (a, p) => {
    address = a;
    port = p;
    console.log(`Server listening on ${address}:${port}`);
    if (addSocketButton) {
      addSocketButton.disabled = false;
    }
    setup();
  },
  async (socket: TCPSocket) => {
    connections++;
    serverElem.setAttribute('connections', connections.toString());

    // TODO: Setup echo back to all connected servers
    serverElem.addEventListener('send', (e: CustomEvent) => {
      const data = e.detail.message;
      console.log(data);
      writeStream(socket, data);
    }
    );
    
    // Wait for the socket to be opened
    const connection = await socket.opened;
    // Get a reader to read from the socket
    const reader = connection.readable.getReader();
    await readStream(reader, (value: Uint8Array) => {
      console.log(value.byteLength)
      bytes += value.byteLength;
      serverElem.setAttribute('bytes', bytes.toString());
      const decoder = new TextDecoder();
      serverElem.setAttribute('log', decoder.decode(value));
    });
    connections--;
    serverElem.setAttribute('connections', connections.toString());
    socket.close();
    console.log('Closed a connection');
})


async function setup() {
  const serverAnchor = document.getElementById('socketServer') as HTMLElement;
  serverElem.setAttribute('address', address);
  serverElem.setAttribute('port', port.toString());
  serverElem.server = server;
  serverAnchor.appendChild(serverElem);
 
}

document.addEventListener('DOMContentLoaded', async() => {
  addSocketButton = document.getElementById('addSocketButton') as HTMLButtonElement;
  const socketsInfo = document.getElementById('socketConnections') as HTMLElement;

  addSocketButton.addEventListener('click', async () => {
    const newSocketComponent = document.createElement("socket-connection");
    newSocketComponent.setAttribute('address', address);
    newSocketComponent.setAttribute('port', port.toString());
    socketsInfo.appendChild(newSocketComponent);

    const connection = await newSocketComponent.socket.opened;
    const reader = connection.readable.getReader();
    newSocketComponent.reader = reader;

    newSocketComponent.addEventListener('close', () => {
      socketsInfo.removeChild(newSocketComponent);
    });


    newSocketComponent.addEventListener('send', (e: CustomEvent) => {
      const data = e.detail.message;
      writeStream(newSocketComponent.socket, data);
    });

    await readStream(reader, (value: Uint8Array) => {
      const decoder = new TextDecoder();
      newSocketComponent.setAttribute('log', decoder.decode(value));
    });

 });
});
