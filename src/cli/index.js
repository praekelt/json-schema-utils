#!/usr/bin/env node
var cli = require('yargs');

cli
  .usage('Usage: $0 [options] module')
  .help('help')
  .command(
    'build <module>',
    'Build and output a json schema from given module path',
    require('./build'))
  .argv;
