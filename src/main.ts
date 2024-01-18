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

// const {readable, localAddress, localPort} = await server.opened;

// let reader = readable.getReader();

async function setup() {
  const serverAnchor = document.getElementById('socketServer') as HTMLElement;
  serverElem.setAttribute('address', address);
  serverElem.setAttribute('port', port.toString());
  serverAnchor.appendChild(serverElem);
  // Create demo socket
  // const socket = new TCPSocket(address, port);
  // const connection = await socket.opened;
  // const writer = connection.writable.getWriter();
  // const encoder = new TextEncoder();
  // writer.write(encoder.encode('Hello from the server!'));
  // writer.write(encoder.encode('And another one!'));
  // await socket.closed;
}

document.addEventListener('DOMContentLoaded', async() => {
  addSocketButton = document.getElementById('addSocketButton') as HTMLButtonElement;
  const socketsInfo = document.getElementById('socketConnections') as HTMLElement;

  addSocketButton.addEventListener('click', async () => {
    const newSocketComponent = document.createElement("socket-connection");
    newSocketComponent.setAttribute('address', address);
    newSocketComponent.setAttribute('port', port.toString());
    socketsInfo.appendChild(newSocketComponent);

 });
});


// let connectedSocket;

// async function readData() {
//   console.log('Banana')
//   while(true) {
//     console.log('Apple')
//     const { value, done } = await reader.read();
//     console.log(value)
//     connectedSocket = await value.opened;
//     const r = connectedSocket?.readable.getReader();
//     r.read().then(data => {
//       const d = new TextDecoder();
//       console.log(d.decode(data.value));
//     })
//     // connectedSocket?.readable.getReader().read().then((data) => {

      
//     console.log(done)
//     if (done) {
//       break;
//     }
//   }
 
// }


//   const promise = readData();
//   promise.finally(() => {
//     console.log('No more data ');
//     // no more data
//   })



// const reader2 = connection?.readable.getReader();

// async function readData2() {
//   console.log('Banana2')
//   while(true) {
//     console.log('Apple2')
//     const { value, done } = await reader2?.read();
//     console.log(value)
//     console.log(done)
//     if (done) {
//       break;
//     }
//   }
// }

// readData2().finally(() => {
//   console.log('No more data2 ');
//   // no more data

// });


// writer.releaseLock();
// socket.close();

// console.log('Hello')


// export default {}