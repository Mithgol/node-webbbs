var fidoconfig = require('fidoconfig');
var nodelist = require('nodelist');
var simteconf = require('simteconf');

module.exports = function(configOptions){
   var setup = {};
   var configBBS = simteconf(configOptions.configFilePath, {
      skipNames: ['//', '#']
   });

   // Read WebBBS-specific settings:
   setup.interfaceLanguage = configBBS.last('InterfaceLanguage') || 'en';
   setup.filenameAreaLock = configBBS.last('AreaLockFile'); // or `null`

   // Read GoldED settings:
   var encodingGED = configBBS.last('EncodingGoldED') || 'utf8';
   var confGED = simteconf(configBBS.last('ConfigGoldED'), {
      encoding: encodingGED,
      skipNames: ['//', '#', '-'+'-']
   });
   setup.styleCodes = (
      configBBS.first('StyleCodes') || confGED.first('StyleCodes') || 'Yes'
   );
   setup.viewKludges = (
      configBBS.first('ViewKludge') || confGED.first('ViewKludge') || 'Yes'
   ).toLowerCase() === 'yes';
   setup.areaSeparators = (
      configBBS.all('AreaSep') || confGED.all('AreaSep') || []
   ).filter(function(areaSep){
      var ok = /^\s*\S+\s+"[^"]+"\s+\d+\s+[Ee][Cc][Hh][Oo]\s*$/.test(areaSep);
      return ok;
   }).map(function(areaSep){
      var matches =
         /^\s*(\S+)\s+"([^"]+)"\s+\d+\s+[Ee][Cc][Hh][Oo]\s*$/.exec(areaSep);
      return {
         sepName: matches[1],
         sepDesc: matches[2]
      };
   }).sort(function(a, b){
      if( a.sepName < b.sepName ){
         return -1;
      } else if ( a.sepName > b.sepName ){
         return 1;
      } else return 0;
   });

   // Read HPT areas:
   setup.areas = fidoconfig.areas(configBBS.last('AreasHPT'), {
      encoding: configBBS.last('EncodingHPT') || 'utf8'
   });
   // Read nodelist from ZIP:
   try {
      var ZIPNodelist = configBBS.last('ZIPNodelist');
      setup.nodelist = nodelist(ZIPNodelist, { zip: true });
   } catch(e) {
      setup.nodelist = null;
   }
   // Read backup WebBBS
   var arrBackupWebBBS = configBBS.all('BackupWebBBS');
   if( arrBackupWebBBS === null ){
      setup.backupWebBBS = {};
   } else {
      // TODO
   }

   return setup;
};