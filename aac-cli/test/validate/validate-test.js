const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const yaml = require('js-yaml');
const validate = require('../../src/validate/validate');

const currentPath = './test/validate';

function loadExpectedResults(expectedResultsPath) {
  //  Load the results.
  const expectedResults = yaml.safeLoad(fs.readFileSync(path.join(currentPath, expectedResultsPath), 'utf8'));
  expectedResults.warnings = expectedResults.warnings || [];
  expectedResults.errors = expectedResults.errors || [];
  return expectedResults;
}

function checkResults(results, expectedResults) {
  //  Check each warning.
  (expectedResults.warnings || []).forEach((expectedWarning) => {
    const warning = results.warnings.find(w => w.type === expectedWarning.type);
    // eslint-disable-next-line
    expect(warning, `Expected warning of type ${expectedWarning.type}`).to.exist;
  });

  //  Check each error.
  (expectedResults.errors || []).forEach((expectedError) => {
    const error = results.errors.find(e => e.type === expectedError.type);
    // eslint-disable-next-line
    expect(error, `Expected error of type ${expectedError.type}`).to.exist;

    expect(error.message).to.match(new RegExp(expectedError.match));
  });

  //  Check the compiled model.
  expect(results.compiledModel).to.deep.equal(expectedResults.compiledModel);
}

describe('validate - functional tests', () => {
  const testInputs = fs.readdirSync(currentPath)
    .filter(fn => fn.endsWith('-input.yaml'));

  testInputs.forEach((testInput) => {
    const expectedResults = loadExpectedResults(testInput.replace('input', 'output'));
    it(`correctly validates ${testInput} to have ${expectedResults.warnings.length} warnings and ${expectedResults.errors.length} errors`, async () => {
      //  Call the validate function with the input file.
      const model = fs.readFileSync(path.join(currentPath, testInput), 'utf8');
      const results = await validate({ model });
      checkResults(results, expectedResults);
    });
  });
});
