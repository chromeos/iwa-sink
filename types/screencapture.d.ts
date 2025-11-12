/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Generated from:
 * - media_devices.idl
 *
 * @see https://w3c.github.io/mediacapture-handle/identity/
 * @see https://w3c.github.io/mediacapture-main/
 * @see https://w3c.github.io/mediacapture-screen-share/
 */

export interface MediaDevices extends EventTarget {
  ondevicechange: EventHandler;
  enumerateDevices(): Promise<MediaDeviceInfo[]>;
  getSupportedConstraints(): MediaTrackSupportedConstraints;
  getUserMedia(constraints?: UserMediaStreamConstraints): Promise<MediaStream>;
  getDisplayMedia(constraints?: DisplayMediaStreamOptions): Promise<MediaStream>;
  getAllScreensMedia(): Promise<MediaStream[]>;
  selectAudioOutput(options?: AudioOutputOptions): Promise<MediaDeviceInfo>;
  setCaptureHandleConfig(config?: CaptureHandleConfig): void;
  setPreferredSinkId(sinkId: string): Promise<undefined>;
}

