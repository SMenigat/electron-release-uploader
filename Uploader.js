const fs = require("fs");
const fetch = require("node-fetch");
const FormData = require('form-data');

class Uploader {
  constructor(passwordHeaderName = null, password = null) {
    this.passwordHeaderName = passwordHeaderName;
    this.password = password;
  }
  async upload(filePath, targetUrl, fileParamName = "app-update") {
    return new Promise(resolve => {

      // prepare form data
      const form = new FormData();
      form.append(fileParamName, fs.createReadStream(filePath));

      // set password header if needed
      if (this.passwordHeaderName && this.password) {
        form.append(this.passwordHeaderName, this.password);
      }

      // sumit this formdata
      fetch(targetUrl, { method: 'POST', body: form })
        .then(function (response) {
          resolve(response);
        }).catch(error => { console.warn(error); resolve(null); });
    });
  }
}

module.exports = Uploader;