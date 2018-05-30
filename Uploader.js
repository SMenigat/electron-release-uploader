const fs = require("fs");
const request = require("request");
const _cliProgress = require('cli-progress');

class Uploader {
  constructor(passwordHeaderName = null, password = null) {
    this.passwordHeaderName = passwordHeaderName;
    this.password = password;
  }
  async upload(filePath, targetUrl, fileParamName = "app-update") {
    return new Promise(resolve => {

      // initialize progress bar
      const progressBar = new _cliProgress.Bar({
        format: '⬆️ [{bar}] {percentage}% | {value}/{total} | ETA: {eta}s',
        hideCursor: true,
      }, _cliProgress.Presets.shades_classic);

      
      // progress bar maximum is the file size
      const fileStats = fs.statSync(filePath);
      let transferredBytes = 0;
      progressBar.start(fileStats.size, transferredBytes);

      // create file stream
      const fileStream = fs.createReadStream(filePath);
      fileStream.on('data', (chunk) => {
        transferredBytes += chunk.length;
        progressBar.update(transferredBytes);
      });

      // set password header if needed
      const headers = {
        'Cache-Control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
      };
      if (this.passwordHeaderName && this.password) {
        headers[this.passwordHeaderName] = this.password;
      }

      const options = {
        method: 'POST',
        url: targetUrl,
        headers,
        formData:
          {
            [fileParamName]:
              {
                value: fileStream,
                options:
                  {
                    filename: filePath,
                    contentType: null
                  }
              }
          }
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        progressBar.stop();
        resolve(response);
      });
    });
  }
}

module.exports = Uploader;