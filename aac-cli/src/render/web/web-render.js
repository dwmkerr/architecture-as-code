const path = require('path');
const express = require('express');
const debug = require('debug')('aac');
const exphbs = require('express-handlebars');
const htmlRender = require('./html-render');

module.exports = function webRender({ compilerOutput, options }) {
  //  Decompose the compiler ouput.
  const { warnings, errors, compiledModel } = compilerOutput;
  debug(`Preparing to render with options: ${options}`);

  const viewsDir = path.join(__dirname, 'views');
  const app = express();
  const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(viewsDir, 'layouts'),
    partialsDir: path.join(viewsDir, 'partials'),
  });


  //  Set Handlebars as the view engine.
  app.engine('handlebars', hbs.engine);
  app.set('view engine', 'handlebars');
  app.set('views', viewsDir);

  //  Expose the public folder.
  app.use('/', express.static(path.join(__dirname, 'public')));

  const port = process.env.PORT || 3000;

  //  Render the model into HTML.
  const modelHTML = htmlRender(compiledModel.root);

  app.get('/', (req, res) => {
    res.render('index', {
      warnings,
      errors,
      compiledModel,
      raw: JSON.stringify(compiledModel, null, 2),
      modelHTML,
    });
  });

  app.listen(port, () => {
    console.log(`Rendering to web on http://localhost:${port}`);
  });
};
