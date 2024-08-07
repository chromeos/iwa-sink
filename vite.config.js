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

import { defineConfig } from 'vite';
import fs from 'fs';
import injectHTML from 'vite-plugin-html-inject';

import wbn from 'rollup-plugin-webbundle';
import * as wbnSign from 'wbn-sign';
import dotenv from 'dotenv';

dotenv.config();

const plugins = [injectHTML()];

if (process.env.NODE_ENV === 'production') {
  // Get the key and decrypt it to sign the web bundle
  const key = wbnSign.parsePemKey(
    process.env.KEY || fs.readFileSync('./certs/encrypted_key.pem'),
    process.env.KEY_PASSPHRASE ||
      (await wbnSign.readPassphrase(
        /*description=*/ './certs/encrypted_key.pem',
      )),
  );

  // Add the wbn bundle only during a production build
  plugins.push({
    ...wbn({
      // Ensures the web bundle is signed as an isolated web app
      baseURL: new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
      // Ensure that all content in the `public` directory is included in the web bundle
      static: {
        dir: 'public',
      },
      // The name of the output web bundle
      output: 'iwa-sink.swbn',
      // This ensures the web bundle is signed with the key
      integrityBlockSign: {
        strategy: new wbnSign.NodeCryptoSigningStrategy(key),
      },
    }),
    enforce: 'post',
  });
}

export default defineConfig({
  plugins,
  server: {
    port: 5193,
    strictPort: true,
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      clientPort: 5193,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        cf: './cf.html',
      },
    },
  },
});
