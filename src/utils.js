const schemaDefaults = require('json-schema-defaults');
const keys = require('lodash/keys');
const filter = require('lodash/filter');
const omitBy = require('lodash/omitBy');
const merge = require('lodash/merge');
const mapKeys = require('lodash/mapKeys');
const Validator = require('ajv');
const snakeCase = require('snake-case');
const { ValidationError } = require('./errors');


function defaults(schema, d) {
  return merge({}, schemaDefaults(schema), d);
}


function omitReadOnly(schema, d) {
  // TODO support for values other than single-level object properties
  return omitBy(d, (v, k) => propertyIsReadOnly(schema, k));
}


function validate(schema, d) {
  const errors = []
    .concat(validationErrors(schema, d))
    .concat(readOnlyErrors(schema, d));

  if (errors.length) throw new ValidationError(errors);
}


function validationErrors(schema, d) {
  const validator = new Validator({
    allErrors: true,
    jsonPointers: true
  });

  validator.validate(schema, d);
  return (validator.errors || []).map(parseValidationError);
}


function readOnlyErrors(schema, d) {
  // TODO support for values other than single-level object properties
  return filter(keys(d), k => propertyIsReadOnly(schema, k))
  .map(k => parseReadOnlyError({
    name: k,
    path: `/${k}`,
    schemaPath: `#/${k}/readOnly`
  }));
}


function parseReadOnlyError({name, path, schemaPath}) {
  return {
    type: 'read_only',
    path,
    message: `read only property '${name}' given`,
    details: {},
    schema_path: schemaPath
  };
}


function parseValidationError(e) {
  return {
    type: snakeCase(e.keyword),
    path: e.dataPath,
    message: e.message,
    details: mapKeys(e.params, (v, k) => snakeCase(k)),
    schema_path: e.schemaPath
  };
}


function propertyIsReadOnly(schema, k) {
  if (!schema.properties) return false;
  const prop = schema.properties[k];
  return prop && prop.readOnly;
}


module.exports = {
  defaults,
  omitReadOnly,
  validate
};
