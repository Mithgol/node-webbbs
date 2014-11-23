var express = require('express');
var path = require('path');

module.exports = function(/* options */){
   var app = express();
   var exhandler = require('express-handlebars'); // tribute to 「Asura Cryin'」

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
      /*jshint unused:vars */
      res.type('text/plain');
      res.send([
         'You have successfully reached ',
         'the initial version of the WebBBS application.'
      ].join(''));
   });

   return app;
};