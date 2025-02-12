/**
 * Copyright 2025 Google LLC
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

const COMPANION_EXTENSION_ID = 'iihpmimbjmmjhmhpmlbfiacamlfplffi';
const REQUEST_VERSION_CHECK = 'version';

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('load', (event) => {
    onWindowLoad();
  });

  function onWindowLoad() {
    checkCompanionExtension();
  }

  function checkCompanionExtension() {
    console.log('Check companion extension availability');
    if (typeof chrome.runtime !== 'undefined') {
      chrome.runtime.sendMessage(
        COMPANION_EXTENSION_ID,
        REQUEST_VERSION_CHECK,
        onCompanionExtensionVersion,
      );
    } else {
      onCompanionExtensionVersion(null);
    }
  }

  function onCompanionExtensionVersion(response) {
    const extVersionTextBox = document.getElementById('extensionCheckResult');

    if (response && response.status === 'OK') {
      console.log('Extension version: ', response.version);
      extVersionTextBox.innerText =
        'Extension found. Version: ' + response.version;
      return;
    }

    const MSG_NOT_FOUND =
      'Companion extension not found. Please install the extension.';
    extVersionTextBox.innerText = MSG_NOT_FOUND;
    return;
  }

  function callCompanionExtensionApi(request) {
    console.log(
      'Sending request: ' + JSON.stringify(request),
      ' to ',
      COMPANION_EXTENSION_ID,
    );
    chrome.runtime.sendMessage(
      COMPANION_EXTENSION_ID,
      request,
      onCompanionExtensionApi,
    );
  }

  function onCompanionExtensionApi(response) {
    console.log('Extension response: ' + response);
    document.getElementById('extApiCallName').innerText = response.apiName;
    document.getElementById('extApiCallStatus').innerText = response.status;
    document.getElementById('extApiCallOutput').innerText = JSON.stringify(
      response.output,
    );
  }

  function callChromeIdentityId() {
    callCompanionExtensionApi({ api: 'chrome.identity.getProfileUserInfo' });
  }

  document
    .getElementById('btnIdentityId')
    .addEventListener('click', callChromeIdentityId);
});
