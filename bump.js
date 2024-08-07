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

let versions;

try {
  versions = JSON.parse(process.env.TAGS).map((tag) => {
    const v = tag.ref.replace('refs/tags/v', '');
    return {
      version: v,
      src: tag.url,
    };
  });
} catch (e) {
  throw new Error('No tags');
}

const updateManifest = {
  versions,
};

fs.writeFileSync('./update.json', JSON.stringify(updateManifest));
