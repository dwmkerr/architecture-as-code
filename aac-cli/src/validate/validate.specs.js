const { expect } = require('chai');
const validate = require('./validate');

describe('validate', () => {
  it('should be a function', () => {
    expect(validate).to.be.a('function');
  });
});
