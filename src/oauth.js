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

import { OAuthConnector } from '/src/components/scripts/oauth.mjs';

window.addEventListener('load', () => {
  console.log('window loaded ' + new Date().toLocaleTimeString());
  document
    .getElementById('oauth-form')
    .addEventListener('submit', async (event) => {
      const connector = new OAuthConnector(
        document.getElementById('auth-endpoint').value,
        document.getElementById('access-endpoint').value,
      );

      console.log('constructed');
      connector
        .getOAuthAccessCode(
          document.getElementById('client-id').value,
          document.getElementById('client-secret').value,
          [document.getElementById('scope').value],
        )
        .then((code) => {
          document.getElementById('access-code').innerText = code;
          document.getElementById('auth-token').innerText =
            connector.authentication_token;
          console.log('code returned: ' + code);
        });
      event.preventDefault();
    });
  console.log('button hooked');
});
