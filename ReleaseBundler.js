const fs = require('fs');
const archiver = require('archiver');

class ReleaseBundler {
  constructor(version, buildDir) {
    this.version = version;
    this.buildDir = buildDir;
    this.buildDirFilelist = null;
  }
  getFileList() {
    if (!this.buildDirFilelist) {
      this.buildDirFilelist = fs.readdirSync(this.buildDir).sort();
    }
    return this.buildDirFilelist;
  }
  getFullPath(fileName) {
    return `${this.buildDir}/${fileName}`;
  }
  getLatestFileByExtention(extention) {
    const filesWithExtention = this.getFileList().filter(file => file.endsWith(extention));
    return filesWithExtention[0];
  }
  async bundle() {
    return new Promise(resolve => {
      // create output stream
      const archiveName = this.version.split('.').join('-');
      const outputFullPath = this.getFullPath(`${archiveName}.tar.gz`);
      const output = fs.createWriteStream(outputFullPath);
      
      // we resolve the promise if stream is beeing closed
      output.on('close', function() {
        resolve(outputFullPath);
      });

      // initialize new archive
      const archive = archiver('tar', {
        gzip: true,
      });
      archive.pipe(output);

      // add windows app
      const winApp = this.getLatestFileByExtention('.exe');
      if (winApp) {
        archive.file(this.getFullPath(winApp), { name: `windows/${winApp}` });
      }

      // add mac app
      const macApp = this.getLatestFileByExtention('.dmg');
      if (macApp) {
        archive.file(this.getFullPath(macApp), { name: `mac/${macApp}` });
      }

      // add linux app
      const linuxApp = this.getLatestFileByExtention('.AppImage');
      if (linuxApp) {
        archive.file(this.getFullPath(linuxApp), { name: `mac/${linuxApp}` });
      }

      // close archive
      archive.finalize();
    });
  }
}

module.exports = ReleaseBundler;