/**
 * Created by lenovo on 2015/10/10.
 */
var util = require('util');

var paramValid = function(){};

paramValid.prototype.keyValid = function(id) {
   return (!(id == undefined || id == null) && id.trim() != "" && !(id.search("\\.") > 0)) ? true : false;
};

paramValid.prototype.empty = function(v) {
   switch (typeof v) {
      case 'undefined' :
         return true;
      case 'string'    :
         if (v== null || v.trim().length == 0) return true;
         break;
      case 'boolean'   :
         if (!v) return true;
         break;
      case 'number'    :
         if (0 === v) return true;
         break;
      case 'object'    :
         if (null === v) return true;
         if (undefined !== v.length && v.length == 0) return true;
         for (var k in v) {
            return false;
         }
         return true;
         break;
   }
   return false;
};

module.exports = new paramValid();