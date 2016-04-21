//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;

var result_ttypes = require('./result_types')


var ttypes = module.exports = {};
Seller = module.exports.Seller = function(args) {
  this.sellerId = null;
  this.loginName = null;
  this.sellerName = null;
  this.pwdEnc = null;
  if (args) {
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.loginName !== undefined) {
      this.loginName = args.loginName;
    }
    if (args.sellerName !== undefined) {
      this.sellerName = args.sellerName;
    }
    if (args.pwdEnc !== undefined) {
      this.pwdEnc = args.pwdEnc;
    }
  }
};
Seller.prototype = {};
Seller.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.loginName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.sellerName = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.pwdEnc = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

Seller.prototype.write = function(output) {
  output.writeStructBegin('Seller');
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 1);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.loginName !== null && this.loginName !== undefined) {
    output.writeFieldBegin('loginName', Thrift.Type.STRING, 2);
    output.writeString(this.loginName);
    output.writeFieldEnd();
  }
  if (this.sellerName !== null && this.sellerName !== undefined) {
    output.writeFieldBegin('sellerName', Thrift.Type.STRING, 3);
    output.writeString(this.sellerName);
    output.writeFieldEnd();
  }
  if (this.pwdEnc !== null && this.pwdEnc !== undefined) {
    output.writeFieldBegin('pwdEnc', Thrift.Type.STRING, 4);
    output.writeString(this.pwdEnc);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

LoginLog = module.exports.LoginLog = function(args) {
  this.sellerId = null;
  this.tokenId = null;
  this.ip = null;
  this.browser = null;
  this.fromSource = null;
  this.loginAuto = null;
  this.loginTime = null;
  this.logoutTime = null;
  if (args) {
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.tokenId !== undefined) {
      this.tokenId = args.tokenId;
    }
    if (args.ip !== undefined) {
      this.ip = args.ip;
    }
    if (args.browser !== undefined) {
      this.browser = args.browser;
    }
    if (args.fromSource !== undefined) {
      this.fromSource = args.fromSource;
    }
    if (args.loginAuto !== undefined) {
      this.loginAuto = args.loginAuto;
    }
    if (args.loginTime !== undefined) {
      this.loginTime = args.loginTime;
    }
    if (args.logoutTime !== undefined) {
      this.logoutTime = args.logoutTime;
    }
  }
};
LoginLog.prototype = {};
LoginLog.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.tokenId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.ip = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.browser = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.fromSource = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.loginAuto = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.loginTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.logoutTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

LoginLog.prototype.write = function(output) {
  output.writeStructBegin('LoginLog');
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 1);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.tokenId !== null && this.tokenId !== undefined) {
    output.writeFieldBegin('tokenId', Thrift.Type.STRING, 2);
    output.writeString(this.tokenId);
    output.writeFieldEnd();
  }
  if (this.ip !== null && this.ip !== undefined) {
    output.writeFieldBegin('ip', Thrift.Type.STRING, 3);
    output.writeString(this.ip);
    output.writeFieldEnd();
  }
  if (this.browser !== null && this.browser !== undefined) {
    output.writeFieldBegin('browser', Thrift.Type.STRING, 4);
    output.writeString(this.browser);
    output.writeFieldEnd();
  }
  if (this.fromSource !== null && this.fromSource !== undefined) {
    output.writeFieldBegin('fromSource', Thrift.Type.I32, 5);
    output.writeI32(this.fromSource);
    output.writeFieldEnd();
  }
  if (this.loginAuto !== null && this.loginAuto !== undefined) {
    output.writeFieldBegin('loginAuto', Thrift.Type.I32, 6);
    output.writeI32(this.loginAuto);
    output.writeFieldEnd();
  }
  if (this.loginTime !== null && this.loginTime !== undefined) {
    output.writeFieldBegin('loginTime', Thrift.Type.STRING, 7);
    output.writeString(this.loginTime);
    output.writeFieldEnd();
  }
  if (this.logoutTime !== null && this.logoutTime !== undefined) {
    output.writeFieldBegin('logoutTime', Thrift.Type.STRING, 8);
    output.writeString(this.logoutTime);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

SellerResult = module.exports.SellerResult = function(args) {
  this.result = null;
  this.seller = null;
  this.loginLog = null;
  this.value = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.seller !== undefined) {
      this.seller = args.seller;
    }
    if (args.loginLog !== undefined) {
      this.loginLog = args.loginLog;
    }
    if (args.value !== undefined) {
      this.value = args.value;
    }
  }
};
SellerResult.prototype = {};
SellerResult.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.result = new result_ttypes.Result();
        this.result.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRUCT) {
        this.seller = new ttypes.Seller();
        this.seller.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.loginLog = new ttypes.LoginLog();
        this.loginLog.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.BOOL) {
        this.value = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SellerResult.prototype.write = function(output) {
  output.writeStructBegin('SellerResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.seller !== null && this.seller !== undefined) {
    output.writeFieldBegin('seller', Thrift.Type.STRUCT, 2);
    this.seller.write(output);
    output.writeFieldEnd();
  }
  if (this.loginLog !== null && this.loginLog !== undefined) {
    output.writeFieldBegin('loginLog', Thrift.Type.STRUCT, 3);
    this.loginLog.write(output);
    output.writeFieldEnd();
  }
  if (this.value !== null && this.value !== undefined) {
    output.writeFieldBegin('value', Thrift.Type.BOOL, 4);
    output.writeBool(this.value);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

SellerRetParam = module.exports.SellerRetParam = function(args) {
  this.baseTag = null;
  if (args) {
    if (args.baseTag !== undefined) {
      this.baseTag = args.baseTag;
    }
  }
};
SellerRetParam.prototype = {};
SellerRetParam.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.I32) {
        this.baseTag = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SellerRetParam.prototype.write = function(output) {
  output.writeStructBegin('SellerRetParam');
  if (this.baseTag !== null && this.baseTag !== undefined) {
    output.writeFieldBegin('baseTag', Thrift.Type.I32, 1);
    output.writeI32(this.baseTag);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

