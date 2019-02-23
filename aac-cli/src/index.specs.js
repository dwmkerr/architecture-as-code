const { expect } = require('chai');
const index = require('..');

describe('index', () => {
  it('should expose the module to be required in another project', () => {
    expect(index.validate).to.be.a('function');
  });
});
