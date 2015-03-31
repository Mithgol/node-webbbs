var util = require('util');
var MIME = require('mime');
var JAM = require('fidonet-jam');
var UUE = require('uue');

var sendError = function(res, err){
   res.type('text/plain;charset=utf-8');
   res.status(500);
   res.send('' + err);
};

var fileScanNextMessage = function(
   res, req, msg, filename, echotag, echobase, msgNum
){
   if( msgNum < 1 ){
      res.type('text/plain;charset=utf-8');
      res.status(404);
      res.send(util.format( msg('areafile_not_found'), filename, echotag ));
      return;
   }

   echobase.readHeader(msgNum, function(err, header){
      if( err ) return sendError(res, err);

      echobase.decodeMessage(header, function(err, messageText){
         if( err ) return sendError(res, err);

         var decodedFile = UUE.decodeFile(messageText, filename);
         if( decodedFile === null ){
            setImmediate(function(){
               fileScanNextMessage(
                  res, req, msg, filename, echotag, echobase, msgNum-1
               );
            });
            return;
         }

         var mimeType = MIME.lookup(filename);
         res.type(mimeType);
         res.send(decodedFile);
      });
   });
};

module.exports = function(setup, msg){
   return function(req, res){
      if( res.FGHIURL.echoNames.length > 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('areafile_requires_single_area_URL') );
         return;
      }

      if( res.FGHIURL.objectPathParts.length > 1 ){
         res.type('text/plain;charset=utf-8');
         res.status(404);
         res.send( msg('areafile_requires_simple_path') );
         return;
      }

      var filename = res.FGHIURL.objectPathParts[0];
      var echotag = res.FGHIURL.echoNames[0][0];

      setup.areas.area(echotag, function(err, data){
         if( err ){
            res.type('text/plain;charset=utf-8');
            res.status(404);
            if( err.notFound ){
               res.send(util.format(
                  msg('areafile_area_not_found'), echotag
               ));
               return;
            }
            if( err.passthrough ){
               res.send(util.format(
                  msg('areafile_area_passthrough'), echotag
               ));
               return;
            }
            res.send(util.format(
               msg('areafile_area_config_reading_error'), echotag
            ));
            return;
         } // if( err )

         var echobase = JAM(data.path);
         echobase.readJDX(function(err){
            if( err ) return sendError(res, err);

            fileScanNextMessage(
               res, req, msg, filename, echotag, echobase, echobase.size()
            );
         });
      }); // setup.areas.area
   }; // return function
};