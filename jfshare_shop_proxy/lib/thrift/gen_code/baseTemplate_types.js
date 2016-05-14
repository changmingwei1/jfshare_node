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
  this.group = null;
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
    if (args.group !== undefined) {
      this.group = args.group;
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
      case 5:
      if (ftype == Thrift.Type.I32) {
        this.group = input.readI32();
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
  if (this.group !== null && this.group !== undefined) {
    output.writeFieldBegin('group', Thrift.Type.I32, 5);
    output.writeI32(this.group);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ProductPostageBasic = module.exports.ProductPostageBasic = function(args) {
  this.productId = null;
  this.templateId = null;
  this.number = null;
  this.weight = null;
  this.amount = null;
  if (args) {
    if (args.productId !== undefined) {
      this.productId = args.productId;
    }
    if (args.templateId !== undefined) {
      this.templateId = args.templateId;
    }
    if (args.number !== undefined) {
      this.number = args.number;
    }
    if (args.weight !== undefined) {
      this.weight = args.weight;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
  }
};
ProductPostageBasic.prototype = {};
ProductPostageBasic.prototype.read = function(input) {
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
        this.productId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.templateId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.number = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.DOUBLE) {
        this.weight = input.readDouble();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.amount = input.readString();
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

ProductPostageBasic.prototype.write = function(output) {
  output.writeStructBegin('ProductPostageBasic');
  if (this.productId !== null && this.productId !== undefined) {
    output.writeFieldBegin('productId', Thrift.Type.STRING, 1);
    output.writeString(this.productId);
    output.writeFieldEnd();
  }
  if (this.templateId !== null && this.templateId !== undefined) {
    output.writeFieldBegin('templateId', Thrift.Type.I32, 2);
    output.writeI32(this.templateId);
    output.writeFieldEnd();
  }
  if (this.number !== null && this.number !== undefined) {
    output.writeFieldBegin('number', Thrift.Type.I32, 3);
    output.writeI32(this.number);
    output.writeFieldEnd();
  }
  if (this.weight !== null && this.weight !== undefined) {
    output.writeFieldBegin('weight', Thrift.Type.DOUBLE, 4);
    output.writeDouble(this.weight);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.STRING, 5);
    output.writeString(this.amount);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

SellerPostageBasic = module.exports.SellerPostageBasic = function(args) {
  this.productPostageBasicList = null;
  if (args) {
    if (args.productPostageBasicList !== undefined) {
      this.productPostageBasicList = args.productPostageBasicList;
    }
  }
};
SellerPostageBasic.prototype = {};
SellerPostageBasic.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.LIST) {
        var _size8 = 0;
        var _rtmp312;
        this.productPostageBasicList = [];
        var _etype11 = 0;
        _rtmp312 = input.readListBegin();
        _etype11 = _rtmp312.etype;
        _size8 = _rtmp312.size;
        for (var _i13 = 0; _i13 < _size8; ++_i13)
        {
          var elem14 = null;
          elem14 = new ttypes.ProductPostageBasic();
          elem14.read(input);
          this.productPostageBasicList.push(elem14);
        }
        input.readListEnd();
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

SellerPostageBasic.prototype.write = function(output) {
  output.writeStructBegin('SellerPostageBasic');
  if (this.productPostageBasicList !== null && this.productPostageBasicList !== undefined) {
    output.writeFieldBegin('productPostageBasicList', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.productPostageBasicList.length);
    for (var iter15 in this.productPostageBasicList)
    {
      if (this.productPostageBasicList.hasOwnProperty(iter15))
      {
        iter15 = this.productPostageBasicList[iter15];
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

SellerPostageReturn = module.exports.SellerPostageReturn = function(args) {
  this.sellerId = null;
  this.postage = null;
  if (args) {
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.postage !== undefined) {
      this.postage = args.postage;
    }
  }
};
SellerPostageReturn.prototype = {};
SellerPostageReturn.prototype.read = function(input) {
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
        this.postage = input.readString();
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

SellerPostageReturn.prototype.write = function(output) {
  output.writeStructBegin('SellerPostageReturn');
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 1);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.postage !== null && this.postage !== undefined) {
    output.writeFieldBegin('postage', Thrift.Type.STRING, 2);
    output.writeString(this.postage);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

CalculatePostageParam = module.exports.CalculatePostageParam = function(args) {
  this.sellerPostageBasicList = null;
  this.sendToProvince = null;
  if (args) {
    if (args.sellerPostageBasicList !== undefined) {
      this.sellerPostageBasicList = args.sellerPostageBasicList;
    }
    if (args.sendToProvince !== undefined) {
      this.sendToProvince = args.sendToProvince;
    }
  }
};
CalculatePostageParam.prototype = {};
CalculatePostageParam.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.LIST) {
        var _size16 = 0;
        var _rtmp320;
        this.sellerPostageBasicList = [];
        var _etype19 = 0;
        _rtmp320 = input.readListBegin();
        _etype19 = _rtmp320.etype;
        _size16 = _rtmp320.size;
        for (var _i21 = 0; _i21 < _size16; ++_i21)
        {
          var elem22 = null;
          elem22 = new ttypes.SellerPostageBasic();
          elem22.read(input);
          this.sellerPostageBasicList.push(elem22);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.sendToProvince = input.readString();
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

CalculatePostageParam.prototype.write = function(output) {
  output.writeStructBegin('CalculatePostageParam');
  if (this.sellerPostageBasicList !== null && this.sellerPostageBasicList !== undefined) {
    output.writeFieldBegin('sellerPostageBasicList', Thrift.Type.LIST, 1);
    output.writeListBegin(Thrift.Type.STRUCT, this.sellerPostageBasicList.length);
    for (var iter23 in this.sellerPostageBasicList)
    {
      if (this.sellerPostageBasicList.hasOwnProperty(iter23))
      {
        iter23 = this.sellerPostageBasicList[iter23];
        iter23.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.sendToProvince !== null && this.sendToProvince !== undefined) {
    output.writeFieldBegin('sendToProvince', Thrift.Type.STRING, 2);
    output.writeString(this.sendToProvince);
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
        var _size24 = 0;
        var _rtmp328;
        this.storehouseList = [];
        var _etype27 = 0;
        _rtmp328 = input.readListBegin();
        _etype27 = _rtmp328.etype;
        _size24 = _rtmp328.size;
        for (var _i29 = 0; _i29 < _size24; ++_i29)
        {
          var elem30 = null;
          elem30 = new ttypes.Storehouse();
          elem30.read(input);
          this.storehouseList.push(elem30);
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
    for (var iter31 in this.storehouseList)
    {
      if (this.storehouseList.hasOwnProperty(iter31))
      {
        iter31 = this.storehouseList[iter31];
        iter31.write(output);
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
        var _size32 = 0;
        var _rtmp336;
        this.postageTemplateList = [];
        var _etype35 = 0;
        _rtmp336 = input.readListBegin();
        _etype35 = _rtmp336.etype;
        _size32 = _rtmp336.size;
        for (var _i37 = 0; _i37 < _size32; ++_i37)
        {
          var elem38 = null;
          elem38 = new ttypes.PostageTemplate();
          elem38.read(input);
          this.postageTemplateList.push(elem38);
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
    for (var iter39 in this.postageTemplateList)
    {
      if (this.postageTemplateList.hasOwnProperty(iter39))
      {
        iter39 = this.postageTemplateList[iter39];
        iter39.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

CalculatePostageResult = module.exports.CalculatePostageResult = function(args) {
  this.result = null;
  this.sellerPostageReturnList = null;
  this.totalPostage = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.sellerPostageReturnList !== undefined) {
      this.sellerPostageReturnList = args.sellerPostageReturnList;
    }
    if (args.totalPostage !== undefined) {
      this.totalPostage = args.totalPostage;
    }
  }
};
CalculatePostageResult.prototype = {};
CalculatePostageResult.prototype.read = function(input) {
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
        var _size40 = 0;
        var _rtmp344;
        this.sellerPostageReturnList = [];
        var _etype43 = 0;
        _rtmp344 = input.readListBegin();
        _etype43 = _rtmp344.etype;
        _size40 = _rtmp344.size;
        for (var _i45 = 0; _i45 < _size40; ++_i45)
        {
          var elem46 = null;
          elem46 = new ttypes.SellerPostageReturn();
          elem46.read(input);
          this.sellerPostageReturnList.push(elem46);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.totalPostage = input.readString();
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

CalculatePostageResult.prototype.write = function(output) {
  output.writeStructBegin('CalculatePostageResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.sellerPostageReturnList !== null && this.sellerPostageReturnList !== undefined) {
    output.writeFieldBegin('sellerPostageReturnList', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.sellerPostageReturnList.length);
    for (var iter47 in this.sellerPostageReturnList)
    {
      if (this.sellerPostageReturnList.hasOwnProperty(iter47))
      {
        iter47 = this.sellerPostageReturnList[iter47];
        iter47.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.totalPostage !== null && this.totalPostage !== undefined) {
    output.writeFieldBegin('totalPostage', Thrift.Type.STRING, 3);
    output.writeString(this.totalPostage);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

