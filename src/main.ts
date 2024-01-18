import { collectConnections, readStream } from "./streams";
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
  async (connection: TCPSocket) => {
    connections++;
    serverElem.setAttribute('connections', connections.toString());
    
    await readStream(connection, (value: Uint8Array) => {
      console.log(value.byteLength)
      bytes += value.byteLength;
      serverElem.setAttribute('bytes', bytes.toString());
      const decoder = new TextDecoder();
      serverElem.setAttribute('log', decoder.decode(value));
    });
    connections--;
    serverElem.setAttribute('connections', connections.toString());
    connection.close();
    console.log('Closed a connection');
})


async function setup() {
  const serverAnchor = document.getElementById('socketServer') as HTMLElement;
  serverElem.setAttribute('address', address);
  serverElem.setAttribute('port', port.toString());
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
    newSocketComponent.addEventListener('close', () => {
      socketsInfo.removeChild(newSocketComponent);
    });

 });
});
