var express = require('express');
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var parseFGHIURL = require('fghi-url');
var configReader = require('./readconf.js');

var generatorRSS = require('./fido_views/rss.js');
var areaFileDecoder = require('./fido_views/areafile.js');

var manifest = require('./package.json');
var softwareName = 'WebBBS' + manifest.version;

var defaultsWebBBS = {
   configFilePath: path.join(__dirname, 'webbbs.conf'),
   port: 80
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

   // messages
   var langMessagesObject = require(
      path.join(
         __dirname, 'node_views', setupBBS.interfaceLanguage, 'messages.json'
      )
   );
   var langMessagesObjectEn = require(
      path.join(
         __dirname, 'node_views', 'en', 'messages.json'
      )
   );
   var msg = function(name){
      return langMessagesObject[name] || langMessagesObjectEn[name];
   };

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

   // serve special static directories
   var serveSpecialStaticDir = function(specialStaticDir){
      var statOps = {
         index: false,
         maxAge: 1000 * 60 * 60 * 1 // 1 hour TTL in cache
      };
      app.use('/' + specialStaticDir.extraName, express.static(
         path.join(__dirname, specialStaticDir.intraName),
         statOps
      ));
   };
   [
      { extraName: 'awesome', intraName: 'node_modules/font-awesome' }
   ].forEach(function(staticDirItem){
      serveSpecialStaticDir(staticDirItem);
   });

   app.all(/.*/, function(req, res, next){
      if(
         setupBBS.filenameAreaLock !== null &&
         fs.existsSync( setupBBS.filenameAreaLock )
      ){
         res.status(503);
         res.render('error', {
            errorHTML: msg('mail_base_locked'),
            softwareTitle: softwareName
         });
      } else next();
   });

   // parse FGHI URL
   app.all(/.*/, function(req, res, next){
      var queryURL = getFullQuery(req.originalUrl); // see also below
      var parsedURL;
      if( queryURL === '' ){
         parsedURL = null;
      } else {
         try {
            parsedURL = parseFGHIURL(queryURL);
         } catch(e) {
            try {
               queryURL = decodeURIComponent(queryURL);
               parsedURL = parseFGHIURL(queryURL);
            } catch(ee) {
               queryURL = getFullQuery(req.originalUrl); // see also above
               parsedURL = null;
            }
         }
      }
      res.FGHIURL = parsedURL;
      res.rawFGHIURL = queryURL;
      next();
   });

   app.get(/^\/rss\/?(?:$|\?)/, generatorRSS(setupBBS, msg));

   app.get('/', function(req, res){
      if(
         res.FGHIURL !== null &&
         res.FGHIURL.scheme === 'area'
      ){
         if( res.FGHIURL.echoNames.length < 1 ){
            res.render('error', {
               errorHTML: msg('stub_echolist'),
               softwareTitle: softwareName
            });
            return;
         }
         if( res.FGHIURL.objectPath.length > 0 ){
            areaFileDecoder(setupBBS, msg)(req, res);
            return;
         }
      }

      res.render('error', {
         errorHTML: msg('stub'),
         softwareTitle: softwareName
      });
   });

   return app;
};