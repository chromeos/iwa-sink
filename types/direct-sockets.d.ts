/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Generated from:
 * - multicast_controller.idl
 * - socket_connection.idl
 * - socket_options.idl
 * - tcp_server_socket.idl
 * - tcp_socket.idl
 * - udp_message.idl
 * - udp_socket.idl
 *
 * @see https://github.com/WICG/direct-sockets/blob/main/docs/explainer.md
 */

export interface UDPSocket {
  constructor(options: UDPSocketOptions);
  readonly opened: Promise<UDPSocketOpenInfo>;
  readonly closed: Promise<undefined>;
  close(): Promise<undefined>;
}

export interface UDPMessage {
  data?: BufferSource;
  remoteAddress?: string;
  remotePort?: number;
  dnsQueryType?: SocketDnsQueryType;
}

export interface TCPSocket {
  constructor(remoteAddress: string, remotePort: number, options?: TCPSocketOptions);
  readonly opened: Promise<TCPSocketOpenInfo>;
  readonly closed: Promise<undefined>;
  close(): Promise<undefined>;
}

export interface TCPServerSocket {
  constructor(localAddress: string, options?: TCPServerSocketOptions);
  readonly opened: Promise<TCPServerSocketOpenInfo>;
  readonly closed: Promise<undefined>;
  close(): Promise<undefined>;
}

export type SocketDnsQueryType =
  | "ipv4"
  | "ipv6";

export interface SocketOptions {
  /** @remarks Extended attributes: [EnforceRange] */
  sendBufferSize?: number;
  /** @remarks Extended attributes: [EnforceRange] */
  receiveBufferSize?: number;
}

export interface TCPSocketOptions extends SocketOptions {
  /** @default false */
  noDelay?: boolean;
  /** @remarks Extended attributes: [EnforceRange] */
  keepAliveDelay?: number;
  dnsQueryType?: SocketDnsQueryType;
}

export interface UDPSocketOptions extends SocketOptions {
  remoteAddress?: string;
  /** @remarks Extended attributes: [EnforceRange] */
  remotePort?: number;
  localAddress?: string;
  /** @remarks Extended attributes: [EnforceRange] */
  localPort?: number;
  dnsQueryType?: SocketDnsQueryType;
  ipv6Only?: boolean;
  /** @remarks Extended attributes: [RuntimeEnabled=MulticastInDirectSockets] */
  multicastAllowAddressSharing?: boolean;
  /** @remarks Extended attributes: [RuntimeEnabled=MulticastInDirectSockets, EnforceRange] */
  multicastTimeToLive?: number;
  /** @remarks Extended attributes: [RuntimeEnabled=MulticastInDirectSockets] */
  multicastLoopback?: boolean;
}

export interface TCPServerSocketOptions {
  /** @remarks Extended attributes: [EnforceRange] */
  localPort?: number;
  /** @remarks Extended attributes: [EnforceRange] */
  backlog?: number;
  ipv6Only?: boolean;
}

export interface SocketOpenInfo {
  readable?: ReadableStream;
  writable?: WritableStream;
  remoteAddress?: string;
  remotePort?: number;
  localAddress?: string;
  localPort?: number;
}

export interface TCPSocketOpenInfo extends SocketOpenInfo {

}

export interface UDPSocketOpenInfo extends SocketOpenInfo {
  /** @remarks Extended attributes: [RuntimeEnabled=MulticastInDirectSockets] */
  multicastController?: MulticastController;
}

export interface TCPServerSocketOpenInfo {
  readable?: ReadableStream;
  localAddress?: string;
  localPort?: number;
}

export interface MulticastController {
  joinGroup(ipAddress: string): Promise<undefined>;
  leaveGroup(ipAddress: string): Promise<undefined>;
  readonly joinedGroups: readonly string[];
}

