var express = require('express');
var path = require('path');
var extend = require('extend');
var configReader = require('./readconf.js');

var defaultsWebBBS = {
   configFilePath: path.join(__dirname, 'webbbs.conf')
};

module.exports = function(optionsWebBBS){
   var app = express();
   var exhandler = require('express-handlebars'); // tribute to 「Asura Cryin'」

   var options = extend({}, defaultsWebBBS, optionsWebBBS);
   /*var setupBBS =*/ configReader(options);

   // Handlebars!
   var dirNodeViews = path.join(__dirname, 'node_views');
   app.engine('handlebars', exhandler({
      defaultLayout: 'default',
      layoutsDir:   path.join(dirNodeViews, 'layouts'),
      partialsDir:  path.join(dirNodeViews, 'partials')
   }));
   app.set('views', dirNodeViews);
   app.set('view engine', 'handlebars');

   app.get('/', function(req, res){
      res.type('text/plain');
      res.send([
         'You have successfully reached ',
         'the initial version of the WebBBS application.'
      ].join(''));
   });

   return app;
};