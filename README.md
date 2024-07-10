# IWA Kitchen Sink

A demo showing off [Isolated Web Apps](https://github.com/WICG/isolated-web-apps/) and related APIs.

## APIs Demonstrated

- [Direct Sockets](https://github.com/WICG/direct-sockets)
- [Controlled Frame](https://github.com/WICG/controlled-frame)
- [Borderless display mode](https://github.com/WICG/manifest-incubations/blob/gh-pages/borderless-explainer.md)

## Installation

**Requirements**

- Chrome or ChromeOS v122 or greater
- NodeJS v18 or higher
- pnpm v8.9 or higher

After downloading this repository and installing its dependencies (`pnpm i`), you'll need to install you'll need to set up a local development root certificate authority in Chrome to have a verified HTTPS certificate to use with the local dev server, as well as enable a few Chrome flags:

1. Generate a valid root certificate for the Vite project.

- You can use [`mkcert`](https://github.com/FiloSottile/mkcert?tab=readme-ov-file) to generate a root cert on your computer, but if another tool is more accessible to you, you can use it. If you're using a Linux distro that supports `apt-get`, you should be able to install it from there. Take note of where the `rootCA.pem` file gets generated. If you're using `mkcert`, you can add `export CAROOT="$HOME/certs"` to your `.bashrc` file to direct where the file will be generated when running `mkcert -install`
- Install the cert by going to `chrome://settings/certificates` and under the `Authorities` tab, import `rootCA.pem`

2. In the root of the project, create a `certs` folder, then generate certs for your project there. If using `mkcert`, you can run `mkcert localhost`
3. Check to make sure that the certs being imported in the `server.https` config in `vite.config.js` match the filenames generated in the previous step. [Start the app](#running-and-updating)
4. On the latest Chrome or ChromeOS v122 or greater, enable the `chrome://flags/#enable-isolated-web-apps` and `chrome://flags/#enable-isolated-web-app-dev-mode/` flags, then go to `chrome://web-app-internals` and install `https://localhost:5193` via the Dev Mode Proxy. This will install this codebase as an IWA app to your device, but use the proxied development server instead of requiring you to bundle and install your app.

To create a bundled application, you'll also need to generate an encrypted signing key. To do so, run the following:

1. Generate an unencrypted Ed25519 or Ecdsa P-256 key by running **one of the two** following commands inside the `certs` directory that you previously made:

- `openssl genpkey -algorithm Ed25519 -out private_key.pem` (for Ed25519)
- `openssl ecparam -name prime256v1 -genkey -noout -out private_key.pem` (for Ecdsa P-256)

2. Encrypt the generated key by then running `openssl pkcs8 -in private_key.pem -topk8 -out encrypted_private_key.pem`, then delete the unencrypted key. You can now [build the app](#running-and-updating).
3. (optional) Create a `.env` file in the root of the project, and add `KEY_PASSPHRASE=`, setting it equal to your passphrase. If you don't do this, you'll need to enter your passphrase every time you go to build the project. You can also add a `KEY=` line in that file, setting it equal to the contents of `encrypted_private_key.pem`. This is to mimic a CI/CD environment; see `vite.config.js` for how this gets handled.
4. Once built, you can go to `chrome://web-app-internals` to install the bundle.

---

If you wanted to do this for your own Vite project, follow the steps above, and make sure to include the `server` configuration (reproduced below) in your `vite.config.js` file. This locks Vite into using a specific port, ensures you're using your verified certificates for HTTPS, and ensures your hot module reload server points to the correct place once proxied.

```js
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
    }
  },
```

You'll also need to ensure you have a valid `manifest.webmanifest` file (named exactly that) available from inside a `.well-known` folder at the of your url (so it'd be available at `https://localhost:5193/.well-known/manifest.webmanifest`) and that it includes a `version` field set to a SEMVER string and at least one valid icon. Putting it directly into the root of your `pubic` folder should be good enough. An example one may look like this:

```json
{
  "id": "/",
  "short_name": "Test IWA",
  "name": "Test IWA",
  "version": "0.0.1",
  "icons": [
    {
      "src": "images/icon.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "isolated_storage": true,
  "permissions_policy": {
    "cross-origin-isolated": ["self"]
  }
}
```

## Running and updating

To run the app, first from within the project's folder, run `pnpm dev` to run the dev server, then open up the installed app (if the server isn't running, the installed app won't load). While the app can be opened in a browser tab, none of the IWA-specific functionality will work.

Any code changes can be done as if you were developing normally, and the app will automatically updated with the latest changes through Vite's built-in HMR capabilities. If, however, you want to make a change to the `manifest.webmanifest` (for instance, to change permissions), you'll need to bump the `version` field, close your app, go to `chrome://web-app-internals`, find your app in the **Dev Mode App Updates** section, and click the "Perform update now" button, then relaunch your app.

If you want to test bundling the application for production and the install flow, you can run `pnpm build` to generate both the production assets of the app, as well as the signed web bundle ready for installation.
