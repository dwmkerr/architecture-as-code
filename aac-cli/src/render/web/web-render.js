const path = require('path');
const express = require('express');
const debug = require('debug')('aac');
const exphbs = require('express-handlebars');
const htmlRender = require('./html-render');

module.exports = function webRender({ model, options }) {
  const viewsDir = path.join(__dirname, 'views');
  const app = express();
  const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(viewsDir, 'layouts'),
    partialsDir: path.join(viewsDir, 'partials'),
  });

  debug(`Prearing to render ${model} with ${options}`);

  //  Set Handlebars as the view engine.
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', viewsDir);

  //  Expose the public folder.
  app.use('/', express.static(path.join(__dirname, 'public')));

  const port = process.env.PORT || 3000;

  console.log(JSON.stringify(model, null, 2));

  //  Render the model into HTML.
  const modelHTML = htmlRender(model.model.root);

  app.get('/', (req, res) => {
    res.render('index', {
      model,
      raw: JSON.stringify(model.model, null, 2),
      modelHTML,
    });
  });

  app.listen(port, () => {
    console.log(`Rendering to web on http://localhost:${port}`);
  });
};
