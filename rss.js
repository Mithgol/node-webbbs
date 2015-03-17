var Fido2RSS = require('fido2rss');

module.exports = function(setup){
   return function(req, res){

      if( res.FGHIURL === null ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'Some FGHI URL should be given after «/rss?».'
         ].join(''));
         return;
      }
      if( res.FGHIURL.scheme !== 'area' ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'RSS is provided only for the «area://» URLs.'
         ].join(''));
         return;
      }
      if( res.FGHIURL.echoNames.length > 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'RSS output for «area://» URLs with multiple echomail area names',
            ' is not currently supported.'
         ].join(''));
         return;
      }
      if( res.FGHIURL.echoNames.length < 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'RSS output for «area://» URLs without an echomail area name ',
            'cannot be generated.'
         ].join(''));
         return;
      }

      var echotag = res.FGHIURL.echoNames[0][0];
      setup.areas.area(echotag, function(err, data){
         if( err ){
            res.type('text/plain;charset=utf-8');
            res.status(404);
            if( err.notFound ){
               res.send([
                  'Sorry, the echomail area «',
                  echotag,
                  '» is not found on the system.'
               ].join(''));
               return;
            }
            if( err.passthrough ){
               res.send([
                  'Sorry, the echomail area «',
                  echotag,
                  '» is passthrough.'
               ].join(''));
               return;
            }
            res.send([
               'Sorry, while reading the echomail area «',
               echotag,
               '» an unknown error has occured.'
            ].join(''));
            return;
         } // if( err )

         var optionsRSS = {
            area: data.configName,
            base: data.path
         };

         Fido2RSS(optionsRSS, function(err, outputRSS){
            if( err ){
               res.type('text/plain;charset=utf-8');
               res.status(500);
               res.send([
                  'Sorry, there was an error when generating ',
                  'an RSS feed for the echomail area «',
                  echotag,
                  '».'
               ].join(''));
               return;
            }
            res.type('application/rss+xml;charset=utf-8');
            res.send(outputRSS);
         });
      }); // setup.areas.area
   }; // return function
};