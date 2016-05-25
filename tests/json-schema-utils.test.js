const { expect } = require('chai');
const { captureError } = require('./utils');

const {
  defaults,
  omitReadOnly,
  validate,
  ValidationError
} = require('..');


describe('json-schema-utils', () => {
  describe('defaults', () => {
    it('should return defaults', () => {
      expect(defaults({
        type: 'object',
        properties: {
          foo: {default: 23},
          bar: {default: 21},
          quux: {
            type: 'object',
            properties: {
              corge: {default: 2},
              grault: {default: 3}
            }
          }
        }
      }, {
        foo: 'rar',
        baz: 1,
        quux: {
          corge: 4,
          garply: 5
        }
      }))
      .to.deep.equal({
        foo: 'rar',
        bar: 21,
        baz: 1,
        quux: {
          corge: 4,
          grault: 3,
          garply: 5
        }
      });
    });
  });

  describe('omitReadOnly', () => {
    it('should omit read only properties', () => {
      expect(omitReadOnly({
        type: 'object',
        properties: {
          foo: {readOnly: true},
          bar: {}
        }
      }, {
        foo: 21,
        bar: 23
      }))
      .to.deep.equal({bar: 23});
    });

    it('should pass through objects for schema without properties', () => {
      expect(omitReadOnly({}, {
        foo: 21,
        bar: 23
      }))
      .to.deep.equal({
        foo: 21,
        bar: 23
      });
    });
  });

  describe('validate', () => {
    it('should validate against the schema', () => {
      expect(validate({type: 'number'}, 23))
        .to.not.throw;

      const e = captureError(() => validate({
        type: 'object',
        properties: {
          foo: {
            type: 'object',
            properties: {
              bar: {
                type: 'number'
              }
            }
          }
        },
        required: ['foo', 'bar']
      }, {
        foo: {bar: 'rar'}
      }));

      expect(e).to.be.instanceof(ValidationError);

      expect(e.errors).to.deep.equal([{
        type: 'required',
        path: '',
        schema_path: '#/required',
        details: {missing_property: 'bar'},
        message: "should have required property 'bar'"
      }, {
        type: 'type',
        path: '/foo/bar',
        schema_path: '#/properties/foo/properties/bar/type',
        details: {type: 'number'},
        message: "should be number"
      }]);
    });

    it('should validate read only properties', () => {
      const e = captureError(() => validate({
        type: 'object',
        properties: {
          foo: {readOnly: true},
          bar: {}
        }
      }, {
        foo: 21,
        bar: 23
      }));

      expect(e).to.be.instanceof(ValidationError);

      expect(e.errors).to.deep.equal([{
        type: 'read_only',
        path: '/foo',
        details: {},
        schema_path: '#/foo/readOnly',
        message: "read only property 'foo' given"
      }]);
    });
  });
});
