var Fido2RSS = require('fido2rss');
var strLeft = require('underscore.string/strLeft');

var beforeSpace = function(inString){
   if( inString.indexOf(' ') === -1 ){
      return inString;
   }
   return strLeft(inString, ' ');
};

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
      var lcEchotag = echotag.toLowerCase();
      var echoNames = setup.areas.group('EchoArea').names();
      var foundNames = echoNames.filter(function(echoName){
         return echoName.toLowerCase() === lcEchotag;
      });
      if( foundNames.length === 0 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'Sorry, the echomail area «',
            echotag,
            '» is not found on the system.'
         ].join(''));
         return;
      }

      var setupEchotag = foundNames[0];
      var echoPath = beforeSpace(
         setup.areas.group('EchoArea').first(setupEchotag)
      );
      if( echoPath.toLowerCase() === 'passthrough' ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send([
            'Sorry, the echomail area «',
            echotag,
            '» is passthrough.'
         ].join(''));
         return;
      }

      var optionsRSS = {
         area: setupEchotag,
         base: echoPath
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
   };
};