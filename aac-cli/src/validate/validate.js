const yaml = require('js-yaml');
const pack = require('../../package.json');

/**
 * componentToEntity - returns a model component as a compiled entity.
 *
 * @param idGenerator - a function which returns a unique entity id
 * @param component - the component
 * @returns a compiled component entity
 */
function componentToEntity(idGenerator, component) {
  //  TODO: would this be better named 'compileComponent'?
  //  Get the ID. If we don't have one, create a new one.
  const id = component.id || `${idGenerator()}`;

  //  Return a 'component' entity.
  return {
    id,
    type: 'component',
    name: component.name,
  };
}

/**
 * containerToEntity - returns a model container as a compiled entity.
 *
 * @param idGenerator - a function which returns a unique entity id
 * @param container - the container
 * @returns a compiled container entity
 */
function containerToEntity(idGenerator, container) {
  //  Get the ID. If we don't have one, create a new one.
  const id = container.id || `${idGenerator()}`;

  //  Return a 'component' entity.
  return {
    id,
    type: 'container',
    name: container.name,
    children: (container.components || []).map(c => componentToEntity(idGenerator, c)),
  };
}

//  TODO: this is now essentially 'ciompile' rather than 'validate'.
module.exports = async function validate({ model }) {
  //  Validate and coerce the parameters.
  if (!model) throw new Error('\'model\' is a required parameter');

  const results = {
    warnings: [],
    errors: [],
    compiledModel: {
    },
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

  //  While compiling, we may need to generate component ids. This is the function
  //  which does that.
  //  TODO: There is nothing stopping us clashing with a user-defined id...
  let nextEntityId = 1;
  const generateEntityId = () => {
    const id = `entity_${nextEntityId}`;
    nextEntityId += 1; // urgh
    return id;
  };

  //  We can now create the initial model, which should have a root container.
  results.compiledModel = {
    title: input.title || null,
    author: input.author || null,
    version: pack.version,
    root: {
      id: 'root',
      type: 'container',
      children: [],
    },
  };

  //  Grab any 'loose' components and put them in the root.
  (input.components || []).forEach((looseComponent) => {
    const entity = componentToEntity(generateEntityId, looseComponent);
    results.compiledModel.root.children.push(entity);
  });

  //  Grab any 'loose' containers and put them in the root.
  (input.containers || []).forEach((looseContainer) => {
    const entity = containerToEntity(generateEntityId, looseContainer);
    results.compiledModel.root.children.push(entity);
  });

  return results;
};
