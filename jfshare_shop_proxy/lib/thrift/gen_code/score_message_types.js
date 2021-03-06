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
BonusPointMessage = module.exports.BonusPointMessage = function(args) {
  this.title = null;
  this.content = null;
  this.objType = null;
  this.alert = null;
  if (args) {
    if (args.title !== undefined) {
      this.title = args.title;
    }
    if (args.content !== undefined) {
      this.content = args.content;
    }
    if (args.objType !== undefined) {
      this.objType = args.objType;
    }
    if (args.alert !== undefined) {
      this.alert = args.alert;
    }
  }
};
BonusPointMessage.prototype = {};
BonusPointMessage.prototype.read = function(input) {
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
        this.title = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.content = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.objType = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.alert = input.readString();
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

BonusPointMessage.prototype.write = function(output) {
  output.writeStructBegin('BonusPointMessage');
  if (this.title !== null && this.title !== undefined) {
    output.writeFieldBegin('title', Thrift.Type.STRING, 1);
    output.writeString(this.title);
    output.writeFieldEnd();
  }
  if (this.content !== null && this.content !== undefined) {
    output.writeFieldBegin('content', Thrift.Type.STRING, 2);
    output.writeString(this.content);
    output.writeFieldEnd();
  }
  if (this.objType !== null && this.objType !== undefined) {
    output.writeFieldBegin('objType', Thrift.Type.I32, 3);
    output.writeI32(this.objType);
    output.writeFieldEnd();
  }
  if (this.alert !== null && this.alert !== undefined) {
    output.writeFieldBegin('alert', Thrift.Type.STRING, 4);
    output.writeString(this.alert);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Score = module.exports.Score = function(args) {
  this.totalScore = null;
  this.CanuseScore = null;
  if (args) {
    if (args.totalScore !== undefined) {
      this.totalScore = args.totalScore;
    }
    if (args.CanuseScore !== undefined) {
      this.CanuseScore = args.CanuseScore;
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
        this.totalScore = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.CanuseScore = input.readI32();
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
  if (this.totalScore !== null && this.totalScore !== undefined) {
    output.writeFieldBegin('totalScore', Thrift.Type.I32, 1);
    output.writeI32(this.totalScore);
    output.writeFieldEnd();
  }
  if (this.CanuseScore !== null && this.CanuseScore !== undefined) {
    output.writeFieldBegin('CanuseScore', Thrift.Type.I32, 2);
    output.writeI32(this.CanuseScore);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

FlightMileage = module.exports.FlightMileage = function(args) {
  this.totalMileage = null;
  this.canuseMileage = null;
  this.consumedMileage = null;
  this.disabledMileage = null;
  if (args) {
    if (args.totalMileage !== undefined) {
      this.totalMileage = args.totalMileage;
    }
    if (args.canuseMileage !== undefined) {
      this.canuseMileage = args.canuseMileage;
    }
    if (args.consumedMileage !== undefined) {
      this.consumedMileage = args.consumedMileage;
    }
    if (args.disabledMileage !== undefined) {
      this.disabledMileage = args.disabledMileage;
    }
  }
};
FlightMileage.prototype = {};
FlightMileage.prototype.read = function(input) {
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
        this.totalMileage = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.canuseMileage = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.consumedMileage = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.disabledMileage = input.readI32();
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

FlightMileage.prototype.write = function(output) {
  output.writeStructBegin('FlightMileage');
  if (this.totalMileage !== null && this.totalMileage !== undefined) {
    output.writeFieldBegin('totalMileage', Thrift.Type.I32, 1);
    output.writeI32(this.totalMileage);
    output.writeFieldEnd();
  }
  if (this.canuseMileage !== null && this.canuseMileage !== undefined) {
    output.writeFieldBegin('canuseMileage', Thrift.Type.I32, 2);
    output.writeI32(this.canuseMileage);
    output.writeFieldEnd();
  }
  if (this.consumedMileage !== null && this.consumedMileage !== undefined) {
    output.writeFieldBegin('consumedMileage', Thrift.Type.I32, 3);
    output.writeI32(this.consumedMileage);
    output.writeFieldEnd();
  }
  if (this.disabledMileage !== null && this.disabledMileage !== undefined) {
    output.writeFieldBegin('disabledMileage', Thrift.Type.I32, 4);
    output.writeI32(this.disabledMileage);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreResult = module.exports.ScoreResult = function(args) {
  this.result = null;
  this.score = null;
  this.state = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.score !== undefined) {
      this.score = args.score;
    }
    if (args.state !== undefined) {
      this.state = args.state;
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
        this.score = new ttypes.Score();
        this.score.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.state = input.readI32();
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
  if (this.score !== null && this.score !== undefined) {
    output.writeFieldBegin('score', Thrift.Type.STRUCT, 2);
    this.score.write(output);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 3);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

FlightMileageResult = module.exports.FlightMileageResult = function(args) {
  this.result = null;
  this.flightMileage = null;
  this.state = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.flightMileage !== undefined) {
      this.flightMileage = args.flightMileage;
    }
    if (args.state !== undefined) {
      this.state = args.state;
    }
  }
};
FlightMileageResult.prototype = {};
FlightMileageResult.prototype.read = function(input) {
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
        this.flightMileage = new ttypes.FlightMileage();
        this.flightMileage.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.state = input.readI32();
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

FlightMileageResult.prototype.write = function(output) {
  output.writeStructBegin('FlightMileageResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.flightMileage !== null && this.flightMileage !== undefined) {
    output.writeFieldBegin('flightMileage', Thrift.Type.STRUCT, 2);
    this.flightMileage.write(output);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 3);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

HaiHangImageResult = module.exports.HaiHangImageResult = function(args) {
  this.result = null;
  this.images = null;
  this.cookei = null;
  this.reqtimestamp = null;
  this.state = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.images !== undefined) {
      this.images = args.images;
    }
    if (args.cookei !== undefined) {
      this.cookei = args.cookei;
    }
    if (args.reqtimestamp !== undefined) {
      this.reqtimestamp = args.reqtimestamp;
    }
    if (args.state !== undefined) {
      this.state = args.state;
    }
  }
};
HaiHangImageResult.prototype = {};
HaiHangImageResult.prototype.read = function(input) {
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
        this.images = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = input.readString();
          this.images.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.cookei = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.reqtimestamp = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.state = input.readI32();
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

HaiHangImageResult.prototype.write = function(output) {
  output.writeStructBegin('HaiHangImageResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.images !== null && this.images !== undefined) {
    output.writeFieldBegin('images', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRING, this.images.length);
    for (var iter7 in this.images)
    {
      if (this.images.hasOwnProperty(iter7))
      {
        iter7 = this.images[iter7];
        output.writeString(iter7);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.cookei !== null && this.cookei !== undefined) {
    output.writeFieldBegin('cookei', Thrift.Type.STRING, 3);
    output.writeString(this.cookei);
    output.writeFieldEnd();
  }
  if (this.reqtimestamp !== null && this.reqtimestamp !== undefined) {
    output.writeFieldBegin('reqtimestamp', Thrift.Type.STRING, 4);
    output.writeString(this.reqtimestamp);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 5);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

