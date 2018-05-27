const fs = require('fs');

class PackageParser {
  constructor() {
    this.packageJSON = `${process.cwd()}/package.json`;
  }
  packageReadable() {
    return fs.existsSync(this.packageJSON);
  }
  parsePackage() {
    if (this.packageReadable()) {
      return JSON.parse(fs.readFileSync(this.packageJSON));
    }
    return {};
  }
  getVersion() {
    return this.parsePackage().version;
  }
  getSettings() {
    return this.parsePackage().electronReleaseUploader;
  }
}

module.exports = PackageParser;