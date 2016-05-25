const { expect } = require('chai');
const build = require('../build');


describe("build", () => {
  it("should support reading", () => {
    const res = build(read => ({
      definitions: {a: read(`${__dirname}/fixtures/a`)}
    }));

    expect(res).to.deep.equal({
      definitions: {a: {type: 'object'}}
    });
  });
});
