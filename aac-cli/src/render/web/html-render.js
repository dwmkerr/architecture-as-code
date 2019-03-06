function render(entity, level = 0) {
  const { id, name } = entity;
  const children = entity.children || [];

  const classes = `model-entity model-${entity.type}`;
  const indent = '  '.repeat(level);
  const tagOpen = `${indent}<div id="${id}" class="${classes}">`;
  const tagHeading = name ? `${indent}  <p>${name}</p>` : '';
  const tagContents = children.map(c => render(c, level + 1)).join('\n');
  const tagClose = `${indent}</div>`;

  return `${tagOpen}\n${tagHeading}\n${tagContents}\n${tagClose}`;
}

module.exports = function htmlRender(entity) {
  return render(entity);
};
