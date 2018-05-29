const _replace = require('lodash.replace');

class StringTemplate {
  constructor(template) {
    this.template = template;
    this.variables = {};
  }
  setVariable(name, value) {
    this.variables[name] = value;
  }
  render() {
    let renderedTemplate = this.template.toString();
    Object.keys(this.variables).forEach((name) => {
      const templateVar = `{${name}}`;
      const varValue = this.variables[name];
      renderedTemplate = _replace(renderedTemplate, templateVar, varValue);
    });
    return renderedTemplate;
  }
}

module.exports = StringTemplate;