const webRender = require('./web/web-render');

module.exports = async function render(params) {
  const { engine, compilerOutput, options } = params;

  if (engine !== 'web') throw Error('Only the \'web\' engine is supported for rendering');

  return webRender({ compilerOutput, options });
};
