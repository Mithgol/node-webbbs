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

The configuration file's path is given as `options_for_WebBBS.configFilePath` property. (By default it is the file `webbbs.conf` in the directory of the WebBBS module. You may use `webbbs.conf-example` as an example.)

The following configuration options are supported (in arbitrary order):

* `ConfigGoldED` — path to the configuration file of GoldED (or [GoldED+](http://golded-plus.sf.net), or GoldED-NSF). This setting is not necessary, but it allows to use WebBBS alongside the popular Fidonet mail editor (GoldED) when the former uses some settings of the latter. The following settings (also individually mentioned below) are used:
   * `UserName`
   * `ViewKludges`
   * `StyleCodes`
   * `AreaSep`

* `EncodingGoldED` — the encoding of non-ASCII characters in the GoldED config file. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `AreasHPT` — path to the area configuration file of HPT. This setting is necessary for WebBBS to know where the echomail resides.
   * The configuration lines for echomail are expected to start with `EchoArea` (literally), then a whitespace-separated echotag (such as `Ru.FTN.Develop` for example), then a whitespace-separated full path (without the extensions) to the echomail files of the area, in that order. (A sequence of several whitespaces is also a supported separator.) The rest of the configuration line is also whitespace-separated from the path.
   * If the `-d "some description"` is found on the line, it is used as the echomail area's description.
   * Only JAM echomail areas are supported. Names of echo base files are generated by appending lowercase extensions (`.jhr`, `.jdt`, `.jdx`, `.jlr`) to the given path.

* `EncodingHPT` — the encoding of non-ASCII characters in the HPT areafile. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `ViewKludges` — if `Yes` (case-insensitive), Fidonet kludges (hidden lines) are displayed. This setting may be borrowed from GoldED's configuration if omitted in WebBBS's, but it affects unknown kludges as well (while in GoldED unknown kludges are controlled by a separate `ViewHidden` setting).

* `StyleCodes` — may have one of the following values (not case-sensitive; borrowed from GoldED's configuration if omitted in WebBBS's) that control the processing of style codes:
   * `Yes` (default) — style codes affect the style of words surrounded by them. There are four types of style codes: `*asterisks*`, `_underscores_`, `#hashes#` or `/slashes/` around words.
   * `Hide` — same as above, but the style codes themselves are not displayed.
   * `No` — style codes are ignored (treated as any other characters).

* `AreaSep` — descriptions of separators between areas in the arealist. May be borrowed from GoldED's configuration if omitted in WebBBS's. Each separator consists of the following elements (separated with one or more spaces):
   * `AreaSep` (literally)
   * areatag (such as `Ru.FTN.Develop` for example)
   * `"separator text"` (in double quotes)
   * group ID (number, currently ignored)
   * group type (currently only `Echo` separators are displayed)

* `ZIPNodelist` — path to a ZIP-packed nodelist.

* `InterfaceLanguage` — the default language of the WebBBS's interface until it is changed by the individual user's settings. Corresponds to a name of a subdirectory inside the `node_views` directory. The following values are supported:
   * `en` — international English. This is the default value.
   * `ru` — modern Russian.
   * `ru-petr1708` — imperial Russian. (Defined by [IANA language subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) as “Russian orthography from the Petrine orthographic reforms of 1708 to the 1917 orthographic reform”.)

* `AreaLockFile` — a path to the file which (when present) indicate that the mail bases are being modified by another program (such as echoprocessor, for example). The WebBBS returns `HTTP 503 Service Unavailable` when this file exists.

## Testing the WebBBS module

[![(build testing status)](https://travis-ci.org/Mithgol/node-webbbs.svg?branch=master)](https://travis-ci.org/Mithgol/node-webbbs)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the WebBBS module).

After that you may run `npm test` (in the directory of the WebBBS module). Only the JS code errors are caught.

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* Fonts in the `paratype` directory are published [by ParaType](http://www.paratype.com/public/) on the terms of [ParaType Free Font Licensing Agreement](http://www.paratype.com/public/pt_openlicense_eng.asp). (See the `PT Free Font License*.txt` files in the same folder.)

* The directory `bootstrap` contains [Bootstrap](http://getbootstrap.com/) licensed under [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE).

* This product uses the JAM(mbp) API — Copyright 1993 Joaquim Homrighausen, Andrew Milner, Mats Birch, Mats Wallin. ALL RIGHTS RESERVED. (JAM may be used by any developer as long as [its specifications](https://github.com/Mithgol/node-fidonet-jam/blob/master/JAM.txt) are followed exactly. JAM may be used free-of-charge by any developer for any purpose, commercially or otherwise.)

* Node.js modules (installed in the `node_modules` directory) belong to their respective owners.
