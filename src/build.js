const { readFileSync: open } = require('fs');
const { safeLoad: load } = require('js-yaml');
const deref = require('json-schema-deref-sync');


function build(fn) {
  return deref(fn(name => read(name)));
}


function read(name, relativeTo) {
  return load(open(`${name}.yml`, 'utf8'));
}


module.exports = build;
