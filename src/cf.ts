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

import tinycolor from 'tinycolor2';

const colorInput = document.getElementById('color') as HTMLInputElement;
const luckyInput = document.getElementById('lucky') as HTMLInputElement;
const cf = document.getElementById('cf') as ControlledFrame;
const controlsForm = document.getElementById('controls') as HTMLFormElement;

/**
 * Updates the background color of the controlled frame.
 * @param color The CSS color value.
 */
function updateControlledFrameBackgroundColor(color: string) {
  const css = `body { background: ${color} !important; }`;
  console.log(`Updating color to: ${color}`);
  cf.insertCSS({ code: css });
}

/**
 * Updates the text of the "lucky" button inside the controlled frame.
 * @param text The new text to display.
 */
function updateControlledFrameLuckyButtonText(text: string) {
  console.log(`Updating text to: "I'm Feeling ${text}"`);
  // Selects both English and Dutch buttons in a single query.
  // The selector string uses backticks to avoid issues with single and double quotes.
  const script = `
    document.querySelectorAll(\`[aria-label="I'm Feeling Lucky"], [aria-label="Ik doe een gok"]\`).forEach(button => {
      button.value = "I'm Feeling ${text}";
    });
  `;
  cf.executeScript({ code: script });
}

/**
 * Handles incoming launch parameters from the launch queue.
 * @param launchParams The launch parameters provided by the system.
 */
function handleLaunch(launchParams: LaunchParams) {
  if (!launchParams.targetURL) {
    return;
  }
  console.log(`Received launch with targetURL: ${launchParams.targetURL}`);

  // The targetURL contains a 'params' query parameter, which is itself a URL.
  // We need to parse this nested URL to get the actual values.
  const outerParams = new URL(launchParams.targetURL).searchParams;
  const innerUrlString = outerParams.get('params');

  if (!innerUrlString) {
    console.warn("No 'params' found in launch URL.");
    return;
  }

  try {
    const innerParams = new URL(innerUrlString).searchParams;
    const textParam = innerParams.get('text');
    const colorParam = innerParams.get('color');

    let parsedColor = null;
    if (colorParam) {
      const realColor = tinycolor(colorParam);
      if (!realColor.isValid()) {
        throw new Error(`${colorParam} does not name a valid color`);
      }
      parsedColor = realColor.toHexString();
      colorInput.value = parsedColor;
    }

    if (textParam) {
      luckyInput.value = textParam;
    }

    // Wait for the controlled frame to finish loading before applying changes.
    cf.onloadstop = () => {
      if (textParam) {
        updateControlledFrameLuckyButtonText(textParam);
      }
      if (parsedColor) {
        updateControlledFrameBackgroundColor(parsedColor);
      }
    };
  } catch (error) {
    console.error("Failed to parse inner URL from 'params':", error);
  }
}

controlsForm.addEventListener('submit', (e) => e.preventDefault());

colorInput.addEventListener('change', () =>
  updateControlledFrameBackgroundColor(colorInput.value),
);
luckyInput.addEventListener('change', () =>
  updateControlledFrameLuckyButtonText(luckyInput.value),
);

// Set up the launch queue consumer to handle protocol-launched events.
window.launchQueue.setConsumer(handleLaunch);
