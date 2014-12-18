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
   var dirNodeViews = path.join(
      __dirname, 'node_views', options.interfaceLanguage
   );
   app.engine('handlebars', exhandler({
      defaultLayout: 'default',
      layoutsDir:   path.join(dirNodeViews, 'layouts'),
      partialsDir:  path.join(dirNodeViews, 'partials')
   }));
   app.set('views', dirNodeViews);
   app.set('view engine', 'handlebars');

   // serve special root files
   var serveSpecialRootFile = function(specialRootFileItem){
      var rootOpts = {
         maxAge: 1000 * 60 * 60 * 1, // 1 hour TTL in cache
         root: path.join(__dirname, specialRootFileItem.realPath)
      };
      app.get('/' + specialRootFileItem.filename, function(req, res){
         res.sendFile(specialRootFileItem.filename, rootOpts, function(err){
            if( err ){
               console.log(
                  'Root special file error: ' + specialRootFileItem.filename
               );
               console.log(err);
               res.status(err.status).end();
            }
         });
      });
   };
   [
      { filename: 'bootstrap.min.css', realPath: 'bootstrap/css' },
      { filename: 'bootstrap.min.js', realPath: 'bootstrap/js' },
      { filename: 'jquery.min.js', realPath: 'node_modules/jquery/dist' }
   ].forEach(function(someSpecialRootFileItem){
      serveSpecialRootFile(someSpecialRootFileItem);
   });

   app.get(/^\/rss\/?(?:$|\?)/, function(req, res){
      res.type('text/plain');
      res.send([
         'You have successfully reached ',
         'the stub version of the WebBBS RSS generator.'
      ].join(''));
   });

   app.get('/', function(req, res){
      res.type('text/plain');
      res.send([
         'You have successfully reached ',
         'the initial version of the WebBBS application.'
      ].join(''));
   });

   return app;
};