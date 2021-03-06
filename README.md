This module provides a **WebBBS** interface to echomail areas of Fidonet.

This module is a web application for the [Express.js](http://expressjs.com/) web server.

This module requires Node.js version 6.0.0 (or newer) because the newer versions of Fido2RSS require it. It also uses some ECMAScript 2015 features itself.

**Note:**   the module is currently in an early phase of its development and thus does not have even minimal feature completeness.

## Installing the WebBBS module

[![(npm package version)](https://nodei.co/npm/webbbs.png?downloads=true)](https://npmjs.org/package/webbbs) [![(a histogram of downloads)](https://nodei.co/npm-dl/webbbs.png?months=3&height=2)](https://npmjs.org/package/webbbs)

* Latest packaged version: `npm install webbbs`

* Latest githubbed version: `npm install https://github.com/Mithgol/node-webbbs/tarball/master`

You may visit https://github.com/Mithgol/node-webbbs#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (And `npm publish --force` is [forbidden](http://blog.npmjs.org/post/77758351673/no-more-npm-publish-f) nowadays.)

**Note: ** [Express.js](http://expressjs.com/) dependency is declared in [`peerDependencies`](https://docs.npmjs.com/files/package.json#peerdependencies) section and thus it won't be automatically installed by npm version 3 (or newer) when you install the WebBBS module. You are expected to install (separately) both Express and the WebBBS module as the dependencies of your own web server.

## Using the WebBBS module

When you `require()` the installed module, you get a function that accepts an object of options and returns an Express.js application that provides a **WebBBS** interface to echomail areas of Fidonet.

**Example 1. ** You may serve the WebBBS application on a route (path) of your Express-based web server:

```js
var express = require('express');
var app = express();

var WebBBS = require('webbbs')(options_for_WebBBS);
app.use('/webbbs', WebBBS);
```

**Example 2. ** You may also use the [`vhost`](https://github.com/expressjs/vhost) module to serve the WebBBS application on a virtual host of your Express-based web server:

```js
var vhost = require('vhost');
var express = require('express');
var app = express();

var WebBBS = require('webbbs')(options_for_WebBBS);
app.use(vhost('webbbs.example.org', WebBBS));
```

**Example 3. ** You may also directly use the WebBBS application itself as your Express-based web server (if that server's only purpose is to work as your WebBBS).

HTTP example:

```js
require('webbbs')(options_for_WebBBS).listen(80);
```

HTTPS example:

```js
var fs = require('fs');

require('https').createServer(
   {
      key:   fs.readFileSync('somepath/server.key'),
      cert:  fs.readFileSync('somepath/server.crt'),
      honorCipherOrder: true
   },
   require('webbbs')(options_for_WebBBS)
).listen(443);
```

**Note. ** You should create a configuration file for the installed WebBBS before you use it. (See below.)

## Configuration options

The `options_for_WebBBS` object that is given to WebBBS has the following properties:

* `port` (by default, `80`) — the port to be used in absolute URLs in RSS feeds. (It should be the port that the Web server listens to.)

* `configFilePath` — the path to the configuration file. That file contains most of the other configuration options in their text form, one line per option. (By default it is the file `webbbs.conf` in the directory of the WebBBS module. You may use `webbbs.conf-example` as an example.)

The configuration file is read only once (when the server starts).

The following configuration options are supported (in arbitrary order):

* `ConfigGoldED` — path to the configuration file of GoldED (or [GoldED+](http://golded-plus.sf.net), or GoldED-NSF). This setting is not necessary, but it allows to use WebBBS alongside the popular Fidonet mail editor (GoldED) when the former uses some settings of the latter. The following settings (also individually mentioned below) are used:
   * `ViewKludges`
   * `StyleCodes`
   * `AreaSep`

* `EncodingGoldED` — the encoding of non-ASCII characters in the GoldED config file. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `AreasHPT` — path to the area configuration file of HPT. This setting is necessary for WebBBS to know where the echomail resides.
   * The configuration lines for echomail are expected to start with `EchoArea` (literally), then a whitespace-separated echotag (such as `Ru.FTN.Develop` for example), then a whitespace-separated full path (without the extensions) to the echomail files of the area, in that order. (A sequence of several whitespaces is also a supported separator.) The rest of the configuration line is also whitespace-separated from the path.
   * If the `-d "some description"` is found on the line, it is used as the echomail area's description.
   * Only JAM echomail areas are supported. Names of echo base files are generated by appending lowercase extensions (`.jhr`, `.jdt`, `.jdx`, `.jlr`) to the given path.

* `EncodingHPT` — the encoding of non-ASCII characters in the HPT areafile. By default, `utf8` is used. You may use any encoding provided by the [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite) module.

* `ViewKludges` — if `Yes` (default, case-insensitive), Fidonet kludges (hidden lines) are displayed. This setting may be borrowed from GoldED's configuration if omitted in WebBBS's, but it affects unknown kludges as well (while in GoldED unknown kludges are controlled by a separate `ViewHidden` setting).

* ![(TODO: not ready)](https://img.shields.io/badge/TODO-%28not_ready%29-001f3f.svg?style=plastic) `StyleCodes` — may have one of the following values (not case-sensitive; borrowed from GoldED's configuration if omitted in WebBBS's) that control the processing of style codes:
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

* `BackupWebBBS` — a path to the file that contains (on its first line) a common beginning of URLs and then (on its second line) the names of echomail areas that are present on some other WebBBS. This module uses such remote WebBBS as a backup for echomail areas that are not defined in the module's config but are known to be present on a remote. The user becomes redirected to the remote WebBBS.
   * If a path is not absolute, it is treated as relative from the module's directory (where its `package.json` resides).
   * Several `BackupWebBBS` directives may be given in order of importance (from the most important to the least important: if an area is present on several of the given WebBBS, then the user is redirected to the first of such WebBBS).
   * A redirect does not happen if the URL designates an encoded file in an echomail area.

### Examples of external configuration files

Examples of the area configuration file of HPT are available in its own CVS repository on SourceForge [in English](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas) and [in Russian](http://husky.cvs.sf.net/viewvc/husky/hpt/config/areas.ru). Text lines of these examples are commented out (by `#` characters in the lines' beginnings) but your real configuration lines must be uncommented.

An example of GoldED configuration file is [available](http://golded-plus.cvs.sourceforge.net/viewvc/golded-plus/golded%2B/etc/golded.conf?revision=1.1&view=markup) in the CVS of GoldED+. It contains a lot of configuration directives; only the most basic of them are understood by WebBBS (and they already appear in `webbbs.conf-example` anyway).

## Testing the WebBBS module

[![(build testing status)](https://img.shields.io/travis/Mithgol/node-webbbs/master.svg?style=plastic)](https://travis-ci.org/Mithgol/node-webbbs)

It is necessary to install [JSHint](http://jshint.com/) for testing.

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of the WebBBS module).

After that you may run `npm test` (in the directory of the WebBBS module). Only the JS code errors are caught; the code's behaviour is not tested.

## License

MIT license (see the `LICENSE` file), with the following exceptions:

* Fonts in the `paratype` directory are published [by ParaType](http://www.paratype.com/public/) on the terms of [ParaType Free Font Licensing Agreement](http://www.paratype.com/public/pt_openlicense_eng.asp). (See the `PT Free Font License*.txt` files in the same folder.)

* The directory `bootstrap` contains [Bootstrap](http://getbootstrap.com/) licensed under [MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE).

* This product uses the JAM(mbp) API — Copyright 1993 Joaquim Homrighausen, Andrew Milner, Mats Birch, Mats Wallin. ALL RIGHTS RESERVED. (JAM may be used by any developer as long as [its specifications](https://github.com/Mithgol/node-fidonet-jam/blob/master/JAM.txt) are followed exactly. JAM may be used free-of-charge by any developer for any purpose, commercially or otherwise.)

* Node.js modules (installed in the `node_modules` directory) belong to their respective owners.
