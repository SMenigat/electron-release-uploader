const prompt = require('prompt');
const colors = require("colors/safe");

prompt.message = '';
prompt.delimiter = '';

class Prompts {
  async promptPassword() {
    return new Promise(resolve => {
      const schema = {
        properties: {
          password: {
            description: colors.white('🔐 Please enter your upload password: '),
            message: 'Entering your password is mandatory.',
            hidden: true,
            required: true,
          }
        }
      };
      prompt.start();
      prompt.get(schema, function (err, result) {
        resolve(result.password);
      });
    });
  }
}

module.exports = Prompts;