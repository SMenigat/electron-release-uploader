const PackageParser = require('./PackageParser');
const ReleaseBundler = require('./ReleaseBundler');

async function main() {

  // parse package json
  const Parser = new PackageParser();
  const settings = Parser.getSettings();
  const appVersion = Parser.getVersion();
  const { buildDir } = settings;

  if (buildDir) {
    console.log(`⏳ Building bundle for app version ${appVersion}`)
    const Bundler = new ReleaseBundler(appVersion, buildDir);
    const bundlePath = await Bundler.bundle();
    console.log(`📦 Tar bundle created: ${bundlePath}`);
  } else {
    console.error('No electronReleaseUploader.buildDir defined in package.json')
  }
};

main();