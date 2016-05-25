const { expect } = require('chai');
const build = require('../src/build');


describe("build", () => {
  it("should support reading", () => {
    const res = build(read => ({
      definitions: {a: read(`${__dirname}/fixtures/a`)}
    }));

    expect(res).to.deep.equal({
      definitions: {a: {type: 'object'}}
    });
  });

  it("should support dereferencing", () => {
    const res = build(read => ({
      definitions: {
        a: {type: 'object'},
        b: {$ref: '#/definitions/a'}
      }
    }));

    expect(res).to.deep.equal({
      definitions: {
        a: {type: 'object'},
        b: {type: 'object'}
      }
    });
  });
});
