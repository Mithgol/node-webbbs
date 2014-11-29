var simteconf = require('simteconf');

module.exports = function(configOptions){
   var setup = {};
   var configBBS = simteconf(configOptions.configFilePath, {
      skipNames: ['//', '#']
   });

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
   var encodingHPT = configBBS.last('EncodingHPT') || 'utf8';
   setup.areas = simteconf(configBBS.last('AreasHPT'), {
      encoding: encodingHPT,
      skipNames: ['#'],
      lowercase: false,
      prefixGroups: [
         'NetmailArea',
         'BadArea',
         'DupeArea',
         'LocalArea',
         'EchoArea'
      ]
   });

   return setup;
};