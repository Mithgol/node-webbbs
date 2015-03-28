var util = require('util');
var Fido2RSS = require('fido2rss');

module.exports = function(setup, msg){
   return function(req, res){

      if( res.FGHIURL === null ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('RSS_requires_FGHI_URL') );
         return;
      }
      if( res.FGHIURL.scheme !== 'area' ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('RSS_requires_area_URL') );
         return;
      }
      if( res.FGHIURL.echoNames.length > 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('RSS_requires_single_area_URL') );
         return;
      }
      if( res.FGHIURL.echoNames.length < 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('RSS_requires_some_area_URL') );
         return;
      }

      var echotag = res.FGHIURL.echoNames[0][0];
      setup.areas.area(echotag, function(err, data){
         if( err ){
            res.type('text/plain;charset=utf-8');
            res.status(404);
            if( err.notFound ){
               res.send(util.format( msg('RSS_area_not_found'), echotag ));
               return;
            }
            if( err.passthrough ){
               res.send(util.format( msg('RSS_area_passthrough'), echotag ));
               return;
            }
            res.send(
               util.format( msg('RSS_area_config_reading_error'), echotag )
            );
            return;
         } // if( err )

         var optionsRSS = {
            area: data.configName,
            base: data.path,
            areaPrefixURL: [
               req.protocol,
               '://',
               req.hostname,
               ':',
               setup.port,
               req.baseUrl,
               '/?'
            ].join('')
         };

         Fido2RSS(optionsRSS, function(err, outputRSS){
            if( err ){
               res.type('text/plain;charset=utf-8');
               res.status(500);
               res.send(util.format( msg('RSS_error_generating'), echotag ));
               return;
            }
            res.type('application/rss+xml;charset=utf-8');
            res.send(outputRSS);
         });
      }); // setup.areas.area
   }; // return function
};