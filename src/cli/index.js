#!/usr/bin/env node
const cli = require('yargs');
const build = require('./build');


cli
  .usage('Usage: $0 [options] module')
  .help('help')
  .command(
    'build <module>',
    'Build and output a json schema from given module path',
    build)
  .argv;
