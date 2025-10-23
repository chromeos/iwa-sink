# IWA Kitchen Sink

A demo showing off [Isolated Web Apps](https://github.com/WICG/isolated-web-apps/) and related APIs. Follow the [getting started with Isolated Web Apps](https://chromeos.dev/en/tutorials/getting-started-with-isolated-web-apps) tutorial to learn about Isolated Web Apps and how to set up and use this repository.

## APIs Demonstrated

- [Direct Sockets](https://github.com/WICG/direct-sockets)
- [Controlled Frame](https://github.com/WICG/controlled-frame)
- [Borderless display mode](https://github.com/WICG/manifest-incubations/blob/gh-pages/borderless-explainer.md)
- [Multiscreen capture with auto-permission](https://github.com/screen-share/capture-all-screens)

### Unrestricted [Protocol Handlers](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/protocol_handlers) & [Launch Handler](https://developer.mozilla.org/en-US/docs/Web/API/Launch_Handler_API)

Kitchen Sink IWA is configured with `navigate-existing` launch handler
and is capable of handling the `cf://` protocol (see the manifest for more
details). As such, clicking on any of the links below will select an existing
app instance (or create a new one if there's none running) and navigate it to
`/cf.html` with some custom query params. This requires the app to be
installed and at least Chrome 143; the protocol requests are routed as redirects
via cros-protocol-handlers.web.app since Github doesn't render custom protocol links in a clickable manner.

- [Click me](https://cros-protocol-handlers.web.app/protocols/?text=Lucky&color=peachpuff) if you're feeling lucky
- [Click me](https://cros-protocol-handlers.web.app/protocols/?text=Unlucky&color=slategrey) if you're feeling unlucky

## Installing as a Demo

If you want to try installing this through the Admin panel, use the following information:

- **Bundle ID** - `aiv4bxauvcu3zvbu6r5yynoh4atkzqqaoeof5mwz54b4zfywcrjuoaacai`
- **Update URL** - `https://github.com/chromeos/iwa-sink/releases/latest/download/update.json`
