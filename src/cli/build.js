const build = require('../build');
const { resolve } = require('path');


function run(argv) {
  const fn = require(resolve(argv.module));
  console.log(JSON.stringify(build(fn), null, 2));
}


module.exports = {
  builder: {},
  handler: run
};
