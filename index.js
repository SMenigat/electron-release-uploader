const PackageParser = require('./PackageParser');
const ReleaseBundler = require('./ReleaseBundler');
const Uploader = require('./Uploader');
const StringTemplate = require('./StringTemplate');

async function main() {

  // parse package json
  const Parser = new PackageParser();
  const settings = Parser.getSettings();
  const appVersion = Parser.getVersion();
  const { buildDir, uploadTargetUrl } = settings;

  if (buildDir) {
    console.log(`⏳ Building bundle for app version ${appVersion}`)
    const Bundler = new ReleaseBundler(appVersion, buildDir);
    const bundlePath = await Bundler.bundle();
    console.log(`📦 Tar bundle created: ${bundlePath}`);

    if (uploadTargetUrl) {

      // fill in variables in url
      const uploadUrlTemplate = new StringTemplate(uploadTargetUrl);
      uploadUrlTemplate.setVariable('version', appVersion.split('.').join('-'));
      const targetUrl = uploadUrlTemplate.render();

      console.log(`⏳ Uploading file to ${targetUrl}`);
      const uploader = new Uploader();
      const uploadResponse = await uploader.upload(bundlePath, targetUrl);
      if (uploadResponse !== null) {
        console.log('✅ Tar bundle successfully uploaded.');
      } else {
        console.log('🔥 Error while uploading the tar bundle.');
      }
    } else {
      console.log('⏭ Skipping upload since no "uploadTargetUrl" is set.');
    }
  } else {
    console.error('No electronReleaseUploader.buildDir defined in package.json')
  }
};

main();