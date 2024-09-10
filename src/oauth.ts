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

import { OAuthConnector } from '/src/components/scripts/oauth-connector.ts';

const form = document.getElementById('oauth-form') as HTMLInputElement;
const auth_endpoint = document.getElementById('auth-endpoint') as HTMLInputElement;
const access_endpoint = document.getElementById('access-endpoint') as HTMLInputElement;
const client_id = document.getElementById('client-id') as HTMLInputElement;
const client_secret = document.getElementById('client-secret') as HTMLInputElement;
const scope = document.getElementById('scope') as HTMLInputElement;
const access_code = document.getElementById('access-code') as HTMLElement;
const auth_token = document.getElementById('auth-token') as HTMLElement;


form.addEventListener('submit', async (event) => {
  const connector = new OAuthConnector(
    auth_endpoint.value,
    access_endpoint.value,
  );

  connector
    .getOAuthAccessCode(
      client_id.value,
      client_secret.value,
      [scope.value],
    )
    .then((code:string) => {
      access_code.innerText = code;
      auth_token.innerText =
        connector.authentication_token;
      console.log('code returned: ' + code);
    });
  event.preventDefault();
});
