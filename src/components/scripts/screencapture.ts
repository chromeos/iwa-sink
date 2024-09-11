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

document.addEventListener('DOMContentLoaded', () => {
  const captureButton = document.getElementById(
    'capture-button',
  ) as HTMLButtonElement;
  const captureContainer = document.getElementById(
    'capture-container',
  ) as HTMLDivElement;

  captureButton.addEventListener('click', async () => {
    if (!captureContainer) {
      return;
    }
    try {
      const streams: MediaStream[] =
        await navigator.mediaDevices.getAllScreensMedia();
      
      // Remove all previously shown streams.
      while (captureContainer.firstChild) {
        captureContainer.removeChild(captureContainer.firstChild);
      }

      // Show all new streams.
      for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        const videoElement = document.createElement('video');
        videoElement.style.width = '256px';
        videoElement.style.height = '192px';
        videoElement.setAttribute('autoplay', '');
        videoElement.srcObject = stream;
        captureContainer.appendChild(videoElement);
      }
    } catch (e) {
      console.log(e);
    }
  });
});
