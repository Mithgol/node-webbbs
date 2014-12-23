var express = require('express');
var path = require('path');
var extend = require('extend');
var parseFGHIURL = require('fghi-url');
var configReader = require('./readconf.js');

var defaultsWebBBS = {
   configFilePath: path.join(__dirname, 'webbbs.conf')
};

var getFullQuery = function(URL){
   var markIndex = URL.indexOf('?');
   if( markIndex < 0 ) return '';
   return URL.slice(markIndex + 1);
};

module.exports = function(optionsWebBBS){
   var app = express();
   var exhandler = require('express-handlebars'); // tribute to 「Asura Cryin'」

   var options = extend({}, defaultsWebBBS, optionsWebBBS);
   var setupBBS = configReader(options);

   // Handlebars!
   var dirNodeViews = path.join(
      __dirname, 'node_views', setupBBS.interfaceLanguage
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
      { filename: 'jquery.min.js', realPath: 'node_modules/jquery/dist' },
      {
         filename: 'font-awesome.min.css',
         realPath: 'node_modules/font-awesome/css'
      }
   ].forEach(function(someSpecialRootFileItem){
      serveSpecialRootFile(someSpecialRootFileItem);
   });

   // parse FGHI URL
   app.all(/.*/, function(req, res, next){
      var queryURL = getFullQuery(req.originalUrl);
      var parsedURL;
      try {
         parsedURL = parseFGHIURL(queryURL);
      } catch(e) {
         try {
            parsedURL = parseFGHIURL( decodeURIComponent(queryURL) );
         } catch(ee) {
            parsedURL = null;
         }
      }
      res.FGHIURL = parsedURL;
      next();
   });

   app.get(/^\/rss\/?(?:$|\?)/, function(req, res){
      var FGHI_URL = getFullQuery(req.originalUrl);
      if( FGHI_URL.indexOf('area') < 0 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'RSS is provided only for the «area://» URLs.'
         ].join(''));
         return;
      }
      res.type('text/plain;charset=utf-8');
      res.send([
         'You have successfully reached ',
         'the stub version of the WebBBS RSS generator.'
      ].join(''));
   });

   app.get('/', function(req, res){
      res.type('text/plain;charset=utf-8');
      res.send([
         'You have successfully reached ',
         'the initial version of the WebBBS application.'
      ].join(''));
   });

   return app;
};