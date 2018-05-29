const fs = require("fs");
const fetch = require("node-fetch");
const FormData = require('form-data');

class Uploader {
  async upload(filePath, targetUrl, fileParamName = "app-update") {
    return new Promise(resolve => {

      // prepare form data
      const form = new FormData();
      form.append(fileParamName, fs.createReadStream(filePath));

      // sumit this formdata
      fetch(targetUrl, { method: 'POST', body: form })
        .then(function (response) {
          resolve(response);
        }).catch(error => { console.warn(error); resolve(null); });
    });
  }
}

module.exports = Uploader;