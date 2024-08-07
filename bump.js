import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const manifest = JSON.parse(
  fs.readFileSync('./public/.well-known/manifest.webmanifest', 'utf-8'),
);

manifest.version = pkg.version;

fs.writeFileSync(
  './public/.well-known/manifest.webmanifest',
  JSON.stringify(manifest),
);

const updateManifest = {
  versions: [
    {
      version: pkg.version,
      src: `/v${pkg.version}/package.swbn`,
    },
  ],
};

fs.writeFileSync('./update.json', JSON.stringify(updateManifest));
