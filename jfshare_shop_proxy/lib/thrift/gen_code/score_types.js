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
  this.tradeTime = null;
  this.inOrOut = null;
  this.type = null;
  if (args) {
    if (args.tradeTime !== undefined) {
      this.tradeTime = args.tradeTime;
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
      if (ftype == Thrift.Type.STRING) {
        this.tradeTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.inOrOut = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
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
  if (this.tradeTime !== null && this.tradeTime !== undefined) {
    output.writeFieldBegin('tradeTime', Thrift.Type.STRING, 1);
    output.writeString(this.tradeTime);
    output.writeFieldEnd();
  }
  if (this.inOrOut !== null && this.inOrOut !== undefined) {
    output.writeFieldBegin('inOrOut', Thrift.Type.I32, 2);
    output.writeI32(this.inOrOut);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 3);
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

