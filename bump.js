import fs from 'fs';

let version = process.env?.VERSION;

if (version) {
  version = version.replace('v', '');
} else {
  throw new Error('No version found');
}

const manifest = JSON.parse(
  fs.readFileSync('./public/.well-known/manifest.webmanifest', 'utf-8'),
);

manifest.version = version;

fs.writeFileSync(
  './public/.well-known/manifest.webmanifest',
  JSON.stringify(manifest, null, 2),
);

const updateManifest = {
  versions: [
    {
      version,
      src: `/v${version}/package.swbn`,
    },
  ],
};

fs.writeFileSync('./update.json', JSON.stringify(updateManifest));
