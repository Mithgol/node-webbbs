module.exports = function(req, res){
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
   res.type('text/plain;charset=utf-8');
   res.send([
      'You have successfully reached ',
      'the stub version of the WebBBS RSS generator.'
   ].join(''));
};