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

export async function readStream(
  reader: ReadableStreamDefaultReader,
  cb: (value: Uint8Array) => void,
): Promise<void> {
  // Read from the socket until it's closed
  while (reader) {
    // Wait for the next chunk
    const { value, done } = await reader.read();

    // Send the chunk to the callback
    if (value) {
      cb(value);
    }

    // Release the reader if we're done
    if (done) {
      reader.releaseLock();
      break;
    }
  }
}

export async function writeStream(
  socket: TCPSocket,
  message: string,
): Promise<void> {
  // Wait for the socket to be opened
  const connection = await socket.opened;
  // Get a writer to write to the socket
  const writer = connection?.writable.getWriter();
  const encoder = new TextEncoder();
  writer.write(encoder.encode(message));
  writer.releaseLock();
}
export async function collectConnections(
  server: TCPServerSocket,
  infoCB: (address: string, port: number) => void,
  connectionCB: (value: TCPSocket) => Promise<void>,
): Promise<void> {
  // Wait for the server to be opened
  const { readable, localAddress, localPort } = await server.opened;

  // Get a reader to read from the server
  // These will be connections to the server
  const connections = readable.getReader();

  // Send the server info to the callback
  infoCB(localAddress, localPort);

  // Read connections from the server until all connections are closed
  while (connections) {
    const { value: connection, done } = await connections.read();

    // Send the connection to the callback
    if (connection) {
      connectionCB(connection);
    }

    // Release the connection if we're done
    if (done) {
      connections.releaseLock();
      break;
    }
  }

  // Wait for the server to be closed
  await server.closed;
  console.log('Closed');
}
