var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.type('text/plain');
   res.send([
      'You have successfully reached ',
      'the initial version of the WebBBS application.'
   ].join(''));
});

module.exports = app;