//
// Autogenerated by Thrift Compiler (0.9.2)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;

var result_ttypes = require('./result_types')
var pagination_ttypes = require('./pagination_types')


var ttypes = module.exports = {};
Score = module.exports.Score = function(args) {
  this.userId = null;
  this.amount = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
  }
};
Score.prototype = {};
Score.prototype.read = function(input) {
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
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.amount = input.readI32();
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

Score.prototype.write = function(output) {
  output.writeStructBegin('Score');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.I32, 2);
    output.writeI32(this.amount);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreTrade = module.exports.ScoreTrade = function(args) {
  this.tradeId = null;
  this.userId = null;
  this.tradeTime = null;
  this.inOrOut = null;
  this.type = null;
  this.amount = null;
  this.trader = null;
  if (args) {
    if (args.tradeId !== undefined) {
      this.tradeId = args.tradeId;
    }
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.tradeTime !== undefined) {
      this.tradeTime = args.tradeTime;
    }
    if (args.inOrOut !== undefined) {
      this.inOrOut = args.inOrOut;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
    if (args.trader !== undefined) {
      this.trader = args.trader;
    }
  }
};
ScoreTrade.prototype = {};
ScoreTrade.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRING) {
        this.tradeId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.tradeTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.inOrOut = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.type = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.amount = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.I32) {
        this.trader = input.readI32();
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

ScoreTrade.prototype.write = function(output) {
  output.writeStructBegin('ScoreTrade');
  if (this.tradeId !== null && this.tradeId !== undefined) {
    output.writeFieldBegin('tradeId', Thrift.Type.STRING, 1);
    output.writeString(this.tradeId);
    output.writeFieldEnd();
  }
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 2);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.tradeTime !== null && this.tradeTime !== undefined) {
    output.writeFieldBegin('tradeTime', Thrift.Type.STRING, 3);
    output.writeString(this.tradeTime);
    output.writeFieldEnd();
  }
  if (this.inOrOut !== null && this.inOrOut !== undefined) {
    output.writeFieldBegin('inOrOut', Thrift.Type.I32, 4);
    output.writeI32(this.inOrOut);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 5);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.I32, 6);
    output.writeI32(this.amount);
    output.writeFieldEnd();
  }
  if (this.trader !== null && this.trader !== undefined) {
    output.writeFieldBegin('trader', Thrift.Type.I32, 7);
    output.writeI32(this.trader);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreTradeQueryParam = module.exports.ScoreTradeQueryParam = function(args) {
  this.userId = null;
  this.startTime = null;
  this.endTime = null;
  this.inOrOut = null;
  this.type = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.startTime !== undefined) {
      this.startTime = args.startTime;
    }
    if (args.endTime !== undefined) {
      this.endTime = args.endTime;
    }
    if (args.inOrOut !== undefined) {
      this.inOrOut = args.inOrOut;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
  }
};
ScoreTradeQueryParam.prototype = {};
ScoreTradeQueryParam.prototype.read = function(input) {
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
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.startTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.endTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.inOrOut = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.type = input.readI32();
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

ScoreTradeQueryParam.prototype.write = function(output) {
  output.writeStructBegin('ScoreTradeQueryParam');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.startTime !== null && this.startTime !== undefined) {
    output.writeFieldBegin('startTime', Thrift.Type.STRING, 2);
    output.writeString(this.startTime);
    output.writeFieldEnd();
  }
  if (this.endTime !== null && this.endTime !== undefined) {
    output.writeFieldBegin('endTime', Thrift.Type.STRING, 3);
    output.writeString(this.endTime);
    output.writeFieldEnd();
  }
  if (this.inOrOut !== null && this.inOrOut !== undefined) {
    output.writeFieldBegin('inOrOut', Thrift.Type.I32, 4);
    output.writeI32(this.inOrOut);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 5);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreResult = module.exports.ScoreResult = function(args) {
  this.result = null;
  this.sroce = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.sroce !== undefined) {
      this.sroce = args.sroce;
    }
  }
};
ScoreResult.prototype = {};
ScoreResult.prototype.read = function(input) {
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
        this.sroce = new ttypes.Score();
        this.sroce.read(input);
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

ScoreResult.prototype.write = function(output) {
  output.writeStructBegin('ScoreResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.sroce !== null && this.sroce !== undefined) {
    output.writeFieldBegin('sroce', Thrift.Type.STRUCT, 2);
    this.sroce.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreTradeResult = module.exports.ScoreTradeResult = function(args) {
  this.result = null;
  this.scoreTrades = null;
  this.pageination = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.scoreTrades !== undefined) {
      this.scoreTrades = args.scoreTrades;
    }
    if (args.pageination !== undefined) {
      this.pageination = args.pageination;
    }
  }
};
ScoreTradeResult.prototype = {};
ScoreTradeResult.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.scoreTrades = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = new ttypes.ScoreTrade();
          elem6.read(input);
          this.scoreTrades.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.pageination = new pagination_ttypes.Pagination();
        this.pageination.read(input);
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

ScoreTradeResult.prototype.write = function(output) {
  output.writeStructBegin('ScoreTradeResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.scoreTrades !== null && this.scoreTrades !== undefined) {
    output.writeFieldBegin('scoreTrades', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.scoreTrades.length);
    for (var iter7 in this.scoreTrades)
    {
      if (this.scoreTrades.hasOwnProperty(iter7))
      {
        iter7 = this.scoreTrades[iter7];
        iter7.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.pageination !== null && this.pageination !== undefined) {
    output.writeFieldBegin('pageination', Thrift.Type.STRUCT, 3);
    this.pageination.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreUser = module.exports.ScoreUser = function(args) {
  this.userId = null;
  this.mobile = null;
  this.createTime = null;
  this.amount = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.mobile !== undefined) {
      this.mobile = args.mobile;
    }
    if (args.createTime !== undefined) {
      this.createTime = args.createTime;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
  }
};
ScoreUser.prototype = {};
ScoreUser.prototype.read = function(input) {
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
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.mobile = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.createTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.amount = input.readI32();
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

ScoreUser.prototype.write = function(output) {
  output.writeStructBegin('ScoreUser');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.mobile !== null && this.mobile !== undefined) {
    output.writeFieldBegin('mobile', Thrift.Type.STRING, 2);
    output.writeString(this.mobile);
    output.writeFieldEnd();
  }
  if (this.createTime !== null && this.createTime !== undefined) {
    output.writeFieldBegin('createTime', Thrift.Type.STRING, 3);
    output.writeString(this.createTime);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.I32, 4);
    output.writeI32(this.amount);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreUserQueryParam = module.exports.ScoreUserQueryParam = function(args) {
  this.userId = null;
  this.mobile = null;
  this.startTime = null;
  this.endTime = null;
  this.amount = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.mobile !== undefined) {
      this.mobile = args.mobile;
    }
    if (args.startTime !== undefined) {
      this.startTime = args.startTime;
    }
    if (args.endTime !== undefined) {
      this.endTime = args.endTime;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
  }
};
ScoreUserQueryParam.prototype = {};
ScoreUserQueryParam.prototype.read = function(input) {
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
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.mobile = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.startTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.endTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.amount = input.readI32();
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

ScoreUserQueryParam.prototype.write = function(output) {
  output.writeStructBegin('ScoreUserQueryParam');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.mobile !== null && this.mobile !== undefined) {
    output.writeFieldBegin('mobile', Thrift.Type.STRING, 2);
    output.writeString(this.mobile);
    output.writeFieldEnd();
  }
  if (this.startTime !== null && this.startTime !== undefined) {
    output.writeFieldBegin('startTime', Thrift.Type.STRING, 3);
    output.writeString(this.startTime);
    output.writeFieldEnd();
  }
  if (this.endTime !== null && this.endTime !== undefined) {
    output.writeFieldBegin('endTime', Thrift.Type.STRING, 4);
    output.writeString(this.endTime);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.I32, 5);
    output.writeI32(this.amount);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreUserResult = module.exports.ScoreUserResult = function(args) {
  this.result = null;
  this.scoreUsers = null;
  this.pageination = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.scoreUsers !== undefined) {
      this.scoreUsers = args.scoreUsers;
    }
    if (args.pageination !== undefined) {
      this.pageination = args.pageination;
    }
  }
};
ScoreUserResult.prototype = {};
ScoreUserResult.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.LIST) {
        var _size8 = 0;
        var _rtmp312;
        this.scoreUsers = [];
        var _etype11 = 0;
        _rtmp312 = input.readListBegin();
        _etype11 = _rtmp312.etype;
        _size8 = _rtmp312.size;
        for (var _i13 = 0; _i13 < _size8; ++_i13)
        {
          var elem14 = null;
          elem14 = new ttypes.ScoreUser();
          elem14.read(input);
          this.scoreUsers.push(elem14);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRUCT) {
        this.pageination = new pagination_ttypes.Pagination();
        this.pageination.read(input);
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

ScoreUserResult.prototype.write = function(output) {
  output.writeStructBegin('ScoreUserResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.scoreUsers !== null && this.scoreUsers !== undefined) {
    output.writeFieldBegin('scoreUsers', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.scoreUsers.length);
    for (var iter15 in this.scoreUsers)
    {
      if (this.scoreUsers.hasOwnProperty(iter15))
      {
        iter15 = this.scoreUsers[iter15];
        iter15.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.pageination !== null && this.pageination !== undefined) {
    output.writeFieldBegin('pageination', Thrift.Type.STRUCT, 3);
    this.pageination.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

