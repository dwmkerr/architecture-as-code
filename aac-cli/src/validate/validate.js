const yaml = require('js-yaml');
const pack = require('../../package.json');

module.exports = async function validate({ model }) {
  //  Validate and coerce the parameters.
  if (!model) throw new Error('\'model\' is a required parameter');

  const results = {
    warnings: [],
    errors: [],
    model: null,
  };

  //  Load the model. TODO: it should be modelPath?
  let input = null;
  try {
    //  If the doc is empty, we get a null object. To make our lives easier,
    //  just have an empty object instead in this case.
    input = yaml.safeLoad(model) || {};
  } catch (e) {
    results.errors.push({ type: 'invalid_yaml', message: e.message });
    return results;
  }

  //  Check for empty titles, authors and models.
  if (!input.title) results.warnings.push({ type: 'no_title', message: 'No title has been specified' });
  if (!input.author) results.warnings.push({ type: 'no_author', message: 'No author has been specified' });
  if (!input.components && !input.containers && !input.connections) results.warnings.push({ type: 'no_model', message: 'No model (components, containers, connections) has been specified' });

  //  We can now create the initial model, which should have a root container.
  results.model = {
    title: input.title || null,
    author: input.author || null,
    version: pack.version,
    root: {
      id: 'root',
      components: [],
    },
  };

  //  Grab any 'loose' components and put them in the root.
  (input.components || []).forEach((looseComponent) => {
    results.model.root.components.push(looseComponent);
  });

  return results;
};
