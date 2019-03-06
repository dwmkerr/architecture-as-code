#!/usr/bin/env node

// We use Node 4 to keep compatibility high, so need the 'use strict' statement.
// eslint-disable-next-line
'use strict';

const fs = require('fs');
const chalk = require('chalk');
const validate = require('../src/validate/validate');
const render = require('../src/render/render');

require('yargs') // eslint-disable-line
  .command('validate [model]', 'validate a model', (yargs) => {
    yargs
      .positional('model', {
        describe: 'path to architecture model',
      })
      .demandOption(['model']);
  }, async ({ model, verbose }) => {
    if (verbose) {
      console.log(`validate architecture model: ${model}`);
    }
    console.log(`\nValidating ${chalk.green(model)}...\n`);

    const modelData = fs.readFileSync(model, 'utf8');
    const results = await validate({ model: modelData });

    //  Write each error and warning.
    results.warnings.forEach((w) => { console.log(`  ${chalk.yellow('Warning')}: ${w.message}`); });
    results.errors.forEach((e) => { console.log(`  ${chalk.red('Error')}: ${e.message}`); });

    const warnings = results.warnings.length > 0
      ? chalk.yellow(results.warnings.length)
      : chalk.green(results.warnings.length);
    const errors = results.errors.length > 0
      ? chalk.red(results.errors.length)
      : chalk.green(results.errors.length);

    console.log(`\n${warnings} warning(s), ${errors} error(s)`);
  })
  .command('render [engine] [model]', 'render a model', (yargs) => {
    yargs
      .positional('engine', {
        describe: 'engine type',
        default: 'web',
      })
      .positional('model', {
        describe: 'path to architecture model',
      })
      .demandOption(['model']);
  }, async ({ engine, model, verbose }) => {
    if (verbose) {
      console.log(`render architecture model: ${model}, with engine ${engine}`);
    }
    console.log(`\nRendering ${chalk.green(model)} with ${chalk.green(engine)}...\n`);

    const modelData = fs.readFileSync(model, 'utf8');
    const compilerOutput = await validate({ model: modelData });

    await render({ engine, compilerOutput, options: {} });
  })
  .option('verbose', {
    alias: 'v',
    default: false,
  })
  .demandCommand(1)
  .argv;
