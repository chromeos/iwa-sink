/**
 * Copyright 2025 Google LLC
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
 * - navigator_usb.idl
 * - usb.idl
 * - usb_alternate_interface.idl
 * - usb_configuration.idl
 * - usb_connection_event.idl
 * - usb_connection_event_init.idl
 * - usb_control_transfer_parameters.idl
 * - usb_device.idl
 * - usb_device_filter.idl
 * - usb_device_request_options.idl
 * - usb_endpoint.idl
 * - usb_in_transfer_result.idl
 * - usb_interface.idl
 * - usb_isochronous_in_transfer_packet.idl
 * - usb_isochronous_in_transfer_result.idl
 * - usb_isochronous_out_transfer_packet.idl
 * - usb_isochronous_out_transfer_result.idl
 * - usb_out_transfer_result.idl
 * - worker_navigator_usb.idl
 *
 * @see https://wicg.github.io/webusb/
 */

/** @remarks Extended attributes: [Exposed, ImplementedAs=USB, SecureContext] */
export interface WorkerNavigator {
  /** @remarks Extended attributes: [SameObject] */
  readonly usb: USB;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBOutTransferResult {
  constructor(status: USBTransferStatus, bytesWritten?: number);
  readonly bytesWritten: number;
  readonly status: USBTransferStatus;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBIsochronousOutTransferResult {
  constructor(packets: USBIsochronousOutTransferPacket[]);
  readonly packets: readonly USBIsochronousOutTransferPacket[];
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBIsochronousOutTransferPacket {
  constructor(status: USBTransferStatus, bytesWritten?: number);
  readonly bytesWritten: number;
  readonly status: USBTransferStatus;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBIsochronousInTransferResult {
  constructor(packets: USBIsochronousInTransferPacket[], data?: DataView | null);
  readonly data: DataView | null;
  readonly packets: readonly USBIsochronousInTransferPacket[];
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBIsochronousInTransferPacket {
  constructor(status: USBTransferStatus, data?: DataView | null);
  readonly status: USBTransferStatus;
  readonly data: DataView | null;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBInterface {
  /** @remarks Extended attributes: [RaisesException] */
  constructor(configuration: USBConfiguration, interfaceNumber: number);
  readonly interfaceNumber: number;
  readonly alternate: USBAlternateInterface | null;
  readonly alternates: readonly USBAlternateInterface[];
  readonly claimed: boolean;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBInTransferResult {
  constructor(status: USBTransferStatus, data?: DataView | null);
  readonly data: DataView | null;
  readonly status: USBTransferStatus;
}

export type USBDirection =
  | "in"
  | "out";

export type USBEndpointType =
  | "bulk"
  | "interrupt"
  | "isochronous";

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBEndpoint {
  /** @remarks Extended attributes: [RaisesException] */
  constructor(alternate: USBAlternateInterface, endpointNumber: number, direction: USBDirection);
  readonly endpointNumber: number;
  readonly direction: USBDirection;
  readonly type: USBEndpointType;
  readonly packetSize: number;
}

export interface USBDeviceRequestOptions {
  filters: USBDeviceFilter[];
  /** @default [] */
  exclusionFilters?: USBDeviceFilter[];
}

export interface USBDeviceFilter {
  vendorId?: number;
  productId?: number;
  classCode?: number;
  subclassCode?: number;
  protocolCode?: number;
  serialNumber?: string;
}

export type USBTransferStatus =
  | "ok"
  | "stall"
  | "babble";

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBDevice {
  readonly usbVersionMajor: number;
  readonly usbVersionMinor: number;
  readonly usbVersionSubminor: number;
  readonly deviceClass: number;
  readonly deviceSubclass: number;
  readonly deviceProtocol: number;
  readonly vendorId: number;
  readonly productId: number;
  readonly deviceVersionMajor: number;
  readonly deviceVersionMinor: number;
  readonly deviceVersionSubminor: number;
  readonly manufacturerName: string | null;
  readonly productName: string | null;
  readonly serialNumber: string | null;
  readonly configuration: USBConfiguration | null;
  readonly configurations: readonly USBConfiguration[];
  readonly opened: boolean;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceOpen, RaisesException] */
  open(): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceClose, RaisesException] */
  close(): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceForget, RaisesException] */
  forget(): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceSelectConfiguration, RaisesException] */
  selectConfiguration(configurationValue: number): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceClaimInterface, RaisesException] */
  claimInterface(interfaceNumber: number): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceReleaseInterface, RaisesException] */
  releaseInterface(interfaceNumber: number): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceSelectAlternateInterface, RaisesException] */
  selectAlternateInterface(interfaceNumber: number, alternateSetting: number): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceControlTransferIn, RaisesException] */
  controlTransferIn(setup: USBControlTransferParameters, length: number): Promise<USBInTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceControlTransferOut, RaisesException] */
  controlTransferOut(setup: USBControlTransferParameters, data?: BufferSource): Promise<USBOutTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceClearHalt, RaisesException] */
  clearHalt(direction: USBDirection, endpointNumber: number): Promise<undefined>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceTransferIn, RaisesException] */
  transferIn(endpointNumber: number, length: number): Promise<USBInTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceTransferOut, RaisesException] */
  transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceIsochronousTransferIn, RaisesException] */
  isochronousTransferIn(endpointNumber: number, packetLengths: number[]): Promise<USBIsochronousInTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceIsochronousTransferOut, RaisesException] */
  isochronousTransferOut(endpointNumber: number, data: BufferSource, packetLengths: number[]): Promise<USBIsochronousOutTransferResult>;
  /** @remarks Extended attributes: [CallWith=ScriptState, MeasureAs=UsbDeviceReset, RaisesException] */
  reset(): Promise<undefined>;
}

export type USBRequestType =
  | "standard"
  | "class"
  | "vendor";

export type USBRecipient =
  | "device"
  | "interface"
  | "endpoint"
  | "other";

export interface USBControlTransferParameters {
  requestType: USBRequestType;
  recipient: USBRecipient;
  request: number;
  value: number;
  index: number;
}

export interface USBConnectionEventInit extends EventInit {
  device: USBDevice;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBConnectionEvent extends Event {
  constructor(type: string, eventInitDict: USBConnectionEventInit);
  /** @remarks Extended attributes: [SameObject] */
  readonly device: USBDevice;
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBConfiguration {
  /** @remarks Extended attributes: [RaisesException] */
  constructor(device: USBDevice, configurationValue: number);
  readonly configurationValue: number;
  readonly configurationName: string | null;
  readonly interfaces: readonly USBInterface[];
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USBAlternateInterface {
  /** @remarks Extended attributes: [RaisesException] */
  constructor(deviceInterface: USBInterface, alternateSetting: number);
  readonly alternateSetting: number;
  readonly interfaceClass: number;
  readonly interfaceSubclass: number;
  readonly interfaceProtocol: number;
  readonly interfaceName: string | null;
  readonly endpoints: readonly USBEndpoint[];
}

/** @remarks Extended attributes: [Exposed, SecureContext] */
export interface USB extends EventTarget {
  onconnect: EventHandler;
  ondisconnect: EventHandler;
  /** @remarks Extended attributes: [CallWith=ScriptState, RaisesException, MeasureAs=UsbGetDevices] */
  getDevices(): Promise<USBDevice[]>;
  /** @remarks Extended attributes: [CallWith=ScriptState, RaisesException, Exposed=Window, MeasureAs=UsbRequestDevice] */
  requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
}

/** @remarks Extended attributes: [Exposed=Window, ImplementedAs=USB, SecureContext] */
export interface Navigator {
  /** @remarks Extended attributes: [SameObject, RuntimeEnabled=WebUSB] */
  readonly usb: USB;
}

