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

/** @remarks Extended attributes: [Exposed=Window, ActiveScriptWrappable, SecureContext] */
export interface MediaDevices extends EventTarget {
  ondevicechange: EventHandler;
  /** @remarks Extended attributes: [CallWith=ScriptState, RaisesException, HighEntropy, MeasureAs=MediaDevicesEnumerateDevices] */
  enumerateDevices(): Promise<MediaDeviceInfo[]>;
  getSupportedConstraints(): MediaTrackSupportedConstraints;
  /** @remarks Extended attributes: [CallWith=ScriptState, RaisesException, HighEntropy, MeasureAs=GetUserMediaPromise] */
  getUserMedia(constraints?: UserMediaStreamConstraints): Promise<MediaStream>;
  /** @remarks Extended attributes: [RuntimeEnabled=GetDisplayMedia, CallWith=ScriptState, RaisesException, MeasureAs=GetDisplayMedia] */
  getDisplayMedia(constraints?: DisplayMediaStreamOptions): Promise<MediaStream>;
  /** @remarks Extended attributes: [RuntimeEnabled=GetAllScreensMedia, CallWith=ScriptState, RaisesException, MeasureAs=GetAllScreensMedia, IsolatedContext] */
  getAllScreensMedia(): Promise<MediaStream[]>;
  /** @remarks Extended attributes: [RuntimeEnabled=SelectAudioOutput, CallWith=ScriptState, RaisesException, MeasureAs=SelectAudioOutput] */
  selectAudioOutput(options?: AudioOutputOptions): Promise<MediaDeviceInfo>;
  /** @remarks Extended attributes: [RuntimeEnabled=CaptureHandle, CallWith=ScriptState, RaisesException] */
  setCaptureHandleConfig(config?: CaptureHandleConfig): void;
  /** @remarks Extended attributes: [RuntimeEnabled=PreferredAudioOutputDevices, CallWith=ScriptState, RaisesException, MeasureAs=PreferredAudioOutputDevices] */
  setPreferredSinkId(sinkId: string): Promise<undefined>;
}

