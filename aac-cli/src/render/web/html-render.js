function render(container, level = 0) {
  const { id, name } = container;
  const children = container.components || [];

  const classes = `${container.type} model-container`;
  const indent = '  '.repeat(level);
  const tagOpen = `${indent}<div id="${id}" class="${classes}">`;
  const tagHeading = `${indent}  <p>${name}</p>`;
  const tagContents = children.map(c => render(c, level + 1)).join('\n');
  const tagClose = `${indent}</div>`;

  return `${tagOpen}\n${tagHeading}\n${tagContents}\n${tagClose}`;
}

module.exports = function htmlRender(container) {
  //  Traverse the model, via the root, writing out the HTML.
  return render(container);
};
