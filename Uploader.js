const fs = require("fs");
const request = require("request");

class Uploader {
  constructor(passwordHeaderName = null, password = null) {
    this.passwordHeaderName = passwordHeaderName;
    this.password = password;
  }
  async upload(filePath, targetUrl, fileParamName = "app-update") {
    return new Promise(resolve => {

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
              value: fs.createReadStream(filePath),
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
        resolve(response);
      });
    });
  }
}

module.exports = Uploader;