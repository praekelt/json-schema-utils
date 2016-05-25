const { readFileSync: open } = require('fs');
const { safeLoad: load } = require('js-yaml');


function build(fn) {
  return fn(name => read(name));
}


function read(name, relativeTo) {
  return load(open(`${name}.yml`, 'utf8'));
}


module.exports = build;
