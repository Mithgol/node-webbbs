This module provides a **WebBBS** interface to echomail areas of Fidonet.

This module is a web application for the [Express.js](http://expressjs.com/) web server.

**Note:**   the module is currently in an early phase of its development and thus does not have even minimal feature completeness.

## Installing the WebBBS module

[![(npm package version)](https://nodei.co/npm/webbbs.png?downloads=true)](https://npmjs.org/package/webbbs) [![(a histogram of downloads)](https://nodei.co/npm-dl/webbbs.png?months=3)](https://npmjs.org/package/webbbs)

* Latest packaged version: `npm install webbbs`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-webbbs/tarball/master`

The npm package does not contain the tests, they're published on GitHub only.

You may visit https://github.com/Mithgol/node-webbbs#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

## Using the WebBBS module

When you `require()` the installed module, you get a function that returns an Express.js application that provides a **WebBBS** interface to echomail areas of Fidonet.

You may serve that application on a route (path) of your Express-based web server:

```js
var WebBBS = require('webbbs')(options_for_WebBBS);
app.use('/webbbs', WebBBS);
```

You may also use the [`vhost`](https://github.com/expressjs/vhost) module to serve that application on a virtual host of your Express-based web server:

```js
var vhost = require('vhost');
var WebBBS = require('webbbs')(options_for_WebBBS);
app.use(vhost('webbbs.example.org', WebBBS));
```

## Configuration

The configuration file's path is given as `options_for_WebBBS.configFilePath` property. (By default it is the file `webbbs.conf` in the directory of the WebBBS module.)

## Testing the WebBBS module

[![(build testing status)](https://travis-ci.org/Mithgol/node-webbbs.svg?branch=master)](https://travis-ci.org/Mithgol/node-webbbs)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the WebBBS module).

After that you may run `npm test` (in the directory of the WebBBS module). Only the JS code errors are caught.

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* Fonts in the `paratype` directory are published [by ParaType](http://www.paratype.com/public/) on the terms of [ParaType Free Font Licensing Agreement](http://www.paratype.com/public/pt_openlicense_eng.asp). (See the `PT Free Font License*.txt` files in the same folder.)

* This product uses the JAM(mbp) API — Copyright 1993 Joaquim Homrighausen, Andrew Milner, Mats Birch, Mats Wallin. ALL RIGHTS RESERVED. (JAM may be used by any developer as long as [its specifications](https://github.com/Mithgol/node-fidonet-jam/blob/master/JAM.txt) are followed exactly. JAM may be used free-of-charge by any developer for any purpose, commercially or otherwise.)

* Node.js modules (installed in the `node_modules` directory) belong to their respective owners.
