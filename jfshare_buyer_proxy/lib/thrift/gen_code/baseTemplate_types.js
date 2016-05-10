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
Storehouse = module.exports.Storehouse = function(args) {
  this.id = null;
  this.sellerId = null;
  this.name = null;
  this.supportProvince = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.name !== undefined) {
      this.name = args.name;
    }
    if (args.supportProvince !== undefined) {
      this.supportProvince = args.supportProvince;
    }
  }
};
Storehouse.prototype = {};
Storehouse.prototype.read = function(input) {
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
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.supportProvince = input.readString();
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

Storehouse.prototype.write = function(output) {
  output.writeStructBegin('Storehouse');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 3);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  if (this.supportProvince !== null && this.supportProvince !== undefined) {
    output.writeFieldBegin('supportProvince', Thrift.Type.STRING, 4);
    output.writeString(this.supportProvince);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

StorehouseQueryParam = module.exports.StorehouseQueryParam = function(args) {
  this.id = null;
  this.sellerId = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
  }
};
StorehouseQueryParam.prototype = {};
StorehouseQueryParam.prototype.read = function(input) {
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
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
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

StorehouseQueryParam.prototype.write = function(output) {
  output.writeStructBegin('StorehouseQueryParam');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

Postage = module.exports.Postage = function(args) {
  this.supportProvince = null;
  this.rule = null;
  if (args) {
    if (args.supportProvince !== undefined) {
      this.supportProvince = args.supportProvince;
    }
    if (args.rule !== undefined) {
      this.rule = args.rule;
    }
  }
};
Postage.prototype = {};
Postage.prototype.read = function(input) {
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
        this.supportProvince = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.rule = input.readString();
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

Postage.prototype.write = function(output) {
  output.writeStructBegin('Postage');
  if (this.supportProvince !== null && this.supportProvince !== undefined) {
    output.writeFieldBegin('supportProvince', Thrift.Type.STRING, 1);
    output.writeString(this.supportProvince);
    output.writeFieldEnd();
  }
  if (this.rule !== null && this.rule !== undefined) {
    output.writeFieldBegin('rule', Thrift.Type.STRING, 2);
    output.writeString(this.rule);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

PostageTemplate = module.exports.PostageTemplate = function(args) {
  this.id = null;
  this.sellerId = null;
  this.name = null;
  this.type = null;
  this.postageList = null;
  this.group = null;
  this.desc = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.name !== undefined) {
      this.name = args.name;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.postageList !== undefined) {
      this.postageList = args.postageList;
    }
    if (args.group !== undefined) {
      this.group = args.group;
    }
    if (args.desc !== undefined) {
      this.desc = args.desc;
    }
  }
};
PostageTemplate.prototype = {};
PostageTemplate.prototype.read = function(input) {
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
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.type = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.postageList = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = new ttypes.Postage();
          elem6.read(input);
          this.postageList.push(elem6);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.I32) {
        this.group = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.desc = input.readString();
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

PostageTemplate.prototype.write = function(output) {
  output.writeStructBegin('PostageTemplate');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 3);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 4);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  if (this.postageList !== null && this.postageList !== undefined) {
    output.writeFieldBegin('postageList', Thrift.Type.LIST, 5);
    output.writeListBegin(Thrift.Type.STRUCT, this.postageList.length);
    for (var iter7 in this.postageList)
    {
      if (this.postageList.hasOwnProperty(iter7))
      {
        iter7 = this.postageList[iter7];
        iter7.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.group !== null && this.group !== undefined) {
    output.writeFieldBegin('group', Thrift.Type.I32, 6);
    output.writeI32(this.group);
    output.writeFieldEnd();
  }
  if (this.desc !== null && this.desc !== undefined) {
    output.writeFieldBegin('desc', Thrift.Type.STRING, 7);
    output.writeString(this.desc);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

PostageTemplateQueryParam = module.exports.PostageTemplateQueryParam = function(args) {
  this.id = null;
  this.sellerId = null;
  this.type = null;
  this.name = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.name !== undefined) {
      this.name = args.name;
    }
  }
};
PostageTemplateQueryParam.prototype = {};
PostageTemplateQueryParam.prototype.read = function(input) {
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
        this.id = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
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
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.name = input.readString();
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

PostageTemplateQueryParam.prototype.write = function(output) {
  output.writeStructBegin('PostageTemplateQueryParam');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 3);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  if (this.name !== null && this.name !== undefined) {
    output.writeFieldBegin('name', Thrift.Type.STRING, 4);
    output.writeString(this.name);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

StorehouseResult = module.exports.StorehouseResult = function(args) {
  this.result = null;
  this.storehouseList = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.storehouseList !== undefined) {
      this.storehouseList = args.storehouseList;
    }
  }
};
StorehouseResult.prototype = {};
StorehouseResult.prototype.read = function(input) {
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
        this.storehouseList = [];
        var _etype11 = 0;
        _rtmp312 = input.readListBegin();
        _etype11 = _rtmp312.etype;
        _size8 = _rtmp312.size;
        for (var _i13 = 0; _i13 < _size8; ++_i13)
        {
          var elem14 = null;
          elem14 = new ttypes.Storehouse();
          elem14.read(input);
          this.storehouseList.push(elem14);
        }
        input.readListEnd();
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

StorehouseResult.prototype.write = function(output) {
  output.writeStructBegin('StorehouseResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.storehouseList !== null && this.storehouseList !== undefined) {
    output.writeFieldBegin('storehouseList', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.storehouseList.length);
    for (var iter15 in this.storehouseList)
    {
      if (this.storehouseList.hasOwnProperty(iter15))
      {
        iter15 = this.storehouseList[iter15];
        iter15.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

PostageTemplateResult = module.exports.PostageTemplateResult = function(args) {
  this.result = null;
  this.postageTemplateList = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.postageTemplateList !== undefined) {
      this.postageTemplateList = args.postageTemplateList;
    }
  }
};
PostageTemplateResult.prototype = {};
PostageTemplateResult.prototype.read = function(input) {
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
        var _size16 = 0;
        var _rtmp320;
        this.postageTemplateList = [];
        var _etype19 = 0;
        _rtmp320 = input.readListBegin();
        _etype19 = _rtmp320.etype;
        _size16 = _rtmp320.size;
        for (var _i21 = 0; _i21 < _size16; ++_i21)
        {
          var elem22 = null;
          elem22 = new ttypes.PostageTemplate();
          elem22.read(input);
          this.postageTemplateList.push(elem22);
        }
        input.readListEnd();
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

PostageTemplateResult.prototype.write = function(output) {
  output.writeStructBegin('PostageTemplateResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.postageTemplateList !== null && this.postageTemplateList !== undefined) {
    output.writeFieldBegin('postageTemplateList', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.postageTemplateList.length);
    for (var iter23 in this.postageTemplateList)
    {
      if (this.postageTemplateList.hasOwnProperty(iter23))
      {
        iter23 = this.postageTemplateList[iter23];
        iter23.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};
