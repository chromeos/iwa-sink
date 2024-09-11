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

const captureScreenButton = document.getElementById('captureScreenButton') as HTMLButtonElement;
const captureScreenDiv = document.getElementById('captureScreenDiv') as HTMLButtonElement;

captureScreenButton.addEventListener('click', async () => {
    if (!captureScreenDiv) { return; }
    const streams: MediaStream[] = await navigator.mediaDevices.getAllScreensMedia();
    while (captureScreenDiv.firstChild) {
      captureScreenDiv.removeChild(captureScreenDiv.firstChild);
    }
    
    streams.forEach(function(screen) {
      const videoElement = document.createElement('video');
      videoElement.style.width = "256px";
      videoElement.style.height = "192px";
      videoElement.setAttribute("autoplay", "");
      videoElement.srcObject = screen;
      captureScreenDiv.appendChild(videoElement);
    });
});

