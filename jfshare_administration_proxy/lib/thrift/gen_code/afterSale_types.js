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
AfterSale = module.exports.AfterSale = function(args) {
  this.userId = null;
  this.sellerId = null;
  this.orderId = null;
  this.productId = null;
  this.type = null;
  this.reason = null;
  this.state = null;
  this.skuNum = null;
  this.userComment = null;
  this.applyTime = null;
  this.approveComment = null;
  this.approveTime = null;
  this.orderTime = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.productId !== undefined) {
      this.productId = args.productId;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.reason !== undefined) {
      this.reason = args.reason;
    }
    if (args.state !== undefined) {
      this.state = args.state;
    }
    if (args.skuNum !== undefined) {
      this.skuNum = args.skuNum;
    }
    if (args.userComment !== undefined) {
      this.userComment = args.userComment;
    }
    if (args.applyTime !== undefined) {
      this.applyTime = args.applyTime;
    }
    if (args.approveComment !== undefined) {
      this.approveComment = args.approveComment;
    }
    if (args.approveTime !== undefined) {
      this.approveTime = args.approveTime;
    }
    if (args.orderTime !== undefined) {
      this.orderTime = args.orderTime;
    }
  }
};
AfterSale.prototype = {};
AfterSale.prototype.read = function(input) {
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
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.orderId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.productId = input.readString();
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
      if (ftype == Thrift.Type.STRING) {
        this.reason = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.I32) {
        this.state = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.STRING) {
        this.skuNum = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 9:
      if (ftype == Thrift.Type.STRING) {
        this.userComment = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 10:
      if (ftype == Thrift.Type.STRING) {
        this.applyTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 11:
      if (ftype == Thrift.Type.STRING) {
        this.approveComment = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 12:
      if (ftype == Thrift.Type.STRING) {
        this.approveTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 13:
      if (ftype == Thrift.Type.STRING) {
        this.orderTime = input.readString();
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

AfterSale.prototype.write = function(output) {
  output.writeStructBegin('AfterSale');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 3);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.productId !== null && this.productId !== undefined) {
    output.writeFieldBegin('productId', Thrift.Type.STRING, 4);
    output.writeString(this.productId);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 5);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  if (this.reason !== null && this.reason !== undefined) {
    output.writeFieldBegin('reason', Thrift.Type.STRING, 6);
    output.writeString(this.reason);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 7);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  if (this.skuNum !== null && this.skuNum !== undefined) {
    output.writeFieldBegin('skuNum', Thrift.Type.STRING, 8);
    output.writeString(this.skuNum);
    output.writeFieldEnd();
  }
  if (this.userComment !== null && this.userComment !== undefined) {
    output.writeFieldBegin('userComment', Thrift.Type.STRING, 9);
    output.writeString(this.userComment);
    output.writeFieldEnd();
  }
  if (this.applyTime !== null && this.applyTime !== undefined) {
    output.writeFieldBegin('applyTime', Thrift.Type.STRING, 10);
    output.writeString(this.applyTime);
    output.writeFieldEnd();
  }
  if (this.approveComment !== null && this.approveComment !== undefined) {
    output.writeFieldBegin('approveComment', Thrift.Type.STRING, 11);
    output.writeString(this.approveComment);
    output.writeFieldEnd();
  }
  if (this.approveTime !== null && this.approveTime !== undefined) {
    output.writeFieldBegin('approveTime', Thrift.Type.STRING, 12);
    output.writeString(this.approveTime);
    output.writeFieldEnd();
  }
  if (this.orderTime !== null && this.orderTime !== undefined) {
    output.writeFieldBegin('orderTime', Thrift.Type.STRING, 13);
    output.writeString(this.orderTime);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleQueryParam = module.exports.AfterSaleQueryParam = function(args) {
  this.userId = null;
  this.sellerId = null;
  this.orderId = null;
  this.productId = null;
  this.type = null;
  this.state = null;
  this.skuNum = null;
  this.orderIdList = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.productId !== undefined) {
      this.productId = args.productId;
    }
    if (args.type !== undefined) {
      this.type = args.type;
    }
    if (args.state !== undefined) {
      this.state = args.state;
    }
    if (args.skuNum !== undefined) {
      this.skuNum = args.skuNum;
    }
    if (args.orderIdList !== undefined) {
      this.orderIdList = args.orderIdList;
    }
  }
};
AfterSaleQueryParam.prototype = {};
AfterSaleQueryParam.prototype.read = function(input) {
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
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.STRING) {
        this.orderId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.productId = input.readString();
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
        this.state = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.skuNum = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.LIST) {
        var _size0 = 0;
        var _rtmp34;
        this.orderIdList = [];
        var _etype3 = 0;
        _rtmp34 = input.readListBegin();
        _etype3 = _rtmp34.etype;
        _size0 = _rtmp34.size;
        for (var _i5 = 0; _i5 < _size0; ++_i5)
        {
          var elem6 = null;
          elem6 = input.readString();
          this.orderIdList.push(elem6);
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

AfterSaleQueryParam.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleQueryParam');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 2);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 3);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.productId !== null && this.productId !== undefined) {
    output.writeFieldBegin('productId', Thrift.Type.STRING, 4);
    output.writeString(this.productId);
    output.writeFieldEnd();
  }
  if (this.type !== null && this.type !== undefined) {
    output.writeFieldBegin('type', Thrift.Type.I32, 5);
    output.writeI32(this.type);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 6);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  if (this.skuNum !== null && this.skuNum !== undefined) {
    output.writeFieldBegin('skuNum', Thrift.Type.STRING, 7);
    output.writeString(this.skuNum);
    output.writeFieldEnd();
  }
  if (this.orderIdList !== null && this.orderIdList !== undefined) {
    output.writeFieldBegin('orderIdList', Thrift.Type.LIST, 8);
    output.writeListBegin(Thrift.Type.STRING, this.orderIdList.length);
    for (var iter7 in this.orderIdList)
    {
      if (this.orderIdList.hasOwnProperty(iter7))
      {
        iter7 = this.orderIdList[iter7];
        output.writeString(iter7);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleQueryCountParam = module.exports.AfterSaleQueryCountParam = function(args) {
  this.sellerId = null;
  this.state = null;
  if (args) {
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.state !== undefined) {
      this.state = args.state;
    }
  }
};
AfterSaleQueryCountParam.prototype = {};
AfterSaleQueryCountParam.prototype.read = function(input) {
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

AfterSaleQueryCountParam.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleQueryCountParam');
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 1);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.state !== null && this.state !== undefined) {
    output.writeFieldBegin('state', Thrift.Type.I32, 2);
    output.writeI32(this.state);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleResult = module.exports.AfterSaleResult = function(args) {
  this.result = null;
  this.afterSaleList = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.afterSaleList !== undefined) {
      this.afterSaleList = args.afterSaleList;
    }
  }
};
AfterSaleResult.prototype = {};
AfterSaleResult.prototype.read = function(input) {
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
        this.afterSaleList = [];
        var _etype11 = 0;
        _rtmp312 = input.readListBegin();
        _etype11 = _rtmp312.etype;
        _size8 = _rtmp312.size;
        for (var _i13 = 0; _i13 < _size8; ++_i13)
        {
          var elem14 = null;
          elem14 = new ttypes.AfterSale();
          elem14.read(input);
          this.afterSaleList.push(elem14);
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

AfterSaleResult.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.afterSaleList !== null && this.afterSaleList !== undefined) {
    output.writeFieldBegin('afterSaleList', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.afterSaleList.length);
    for (var iter15 in this.afterSaleList)
    {
      if (this.afterSaleList.hasOwnProperty(iter15))
      {
        iter15 = this.afterSaleList[iter15];
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

AfterSaleCountResult = module.exports.AfterSaleCountResult = function(args) {
  this.result = null;
  this.count = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.count !== undefined) {
      this.count = args.count;
    }
  }
};
AfterSaleCountResult.prototype = {};
AfterSaleCountResult.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.I32) {
        this.count = input.readI32();
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

AfterSaleCountResult.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleCountResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.count !== null && this.count !== undefined) {
    output.writeFieldBegin('count', Thrift.Type.I32, 2);
    output.writeI32(this.count);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleOrder = module.exports.AfterSaleOrder = function(args) {
  this.userId = null;
  this.orderId = null;
  this.sellerId = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
  }
};
AfterSaleOrder.prototype = {};
AfterSaleOrder.prototype.read = function(input) {
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
        this.orderId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
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

AfterSaleOrder.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleOrder');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 2);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 3);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleOrderResult = module.exports.AfterSaleOrderResult = function(args) {
  this.result = null;
  this.afterSaleOrders = null;
  this.afterSaleList = null;
  this.pagination = null;
  if (args) {
    if (args.result !== undefined) {
      this.result = args.result;
    }
    if (args.afterSaleOrders !== undefined) {
      this.afterSaleOrders = args.afterSaleOrders;
    }
    if (args.afterSaleList !== undefined) {
      this.afterSaleList = args.afterSaleList;
    }
    if (args.pagination !== undefined) {
      this.pagination = args.pagination;
    }
  }
};
AfterSaleOrderResult.prototype = {};
AfterSaleOrderResult.prototype.read = function(input) {
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
        this.afterSaleOrders = [];
        var _etype19 = 0;
        _rtmp320 = input.readListBegin();
        _etype19 = _rtmp320.etype;
        _size16 = _rtmp320.size;
        for (var _i21 = 0; _i21 < _size16; ++_i21)
        {
          var elem22 = null;
          elem22 = new ttypes.AfterSaleOrder();
          elem22.read(input);
          this.afterSaleOrders.push(elem22);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.LIST) {
        var _size23 = 0;
        var _rtmp327;
        this.afterSaleList = [];
        var _etype26 = 0;
        _rtmp327 = input.readListBegin();
        _etype26 = _rtmp327.etype;
        _size23 = _rtmp327.size;
        for (var _i28 = 0; _i28 < _size23; ++_i28)
        {
          var elem29 = null;
          elem29 = new ttypes.AfterSale();
          elem29.read(input);
          this.afterSaleList.push(elem29);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRUCT) {
        this.pagination = new pagination_ttypes.Pagination();
        this.pagination.read(input);
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

AfterSaleOrderResult.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleOrderResult');
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 1);
    this.result.write(output);
    output.writeFieldEnd();
  }
  if (this.afterSaleOrders !== null && this.afterSaleOrders !== undefined) {
    output.writeFieldBegin('afterSaleOrders', Thrift.Type.LIST, 2);
    output.writeListBegin(Thrift.Type.STRUCT, this.afterSaleOrders.length);
    for (var iter30 in this.afterSaleOrders)
    {
      if (this.afterSaleOrders.hasOwnProperty(iter30))
      {
        iter30 = this.afterSaleOrders[iter30];
        iter30.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.afterSaleList !== null && this.afterSaleList !== undefined) {
    output.writeFieldBegin('afterSaleList', Thrift.Type.LIST, 3);
    output.writeListBegin(Thrift.Type.STRUCT, this.afterSaleList.length);
    for (var iter31 in this.afterSaleList)
    {
      if (this.afterSaleList.hasOwnProperty(iter31))
      {
        iter31 = this.afterSaleList[iter31];
        iter31.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.pagination !== null && this.pagination !== undefined) {
    output.writeFieldBegin('pagination', Thrift.Type.STRUCT, 4);
    this.pagination.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleOrderParam = module.exports.AfterSaleOrderParam = function(args) {
  this.userId = null;
  this.orderId = null;
  this.sellerId = null;
  this.startTime = null;
  this.endTime = null;
  this.payTimeStart = null;
  this.payTimeEnd = null;
  this.fromSource = null;
  if (args) {
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.sellerId !== undefined) {
      this.sellerId = args.sellerId;
    }
    if (args.startTime !== undefined) {
      this.startTime = args.startTime;
    }
    if (args.endTime !== undefined) {
      this.endTime = args.endTime;
    }
    if (args.payTimeStart !== undefined) {
      this.payTimeStart = args.payTimeStart;
    }
    if (args.payTimeEnd !== undefined) {
      this.payTimeEnd = args.payTimeEnd;
    }
    if (args.fromSource !== undefined) {
      this.fromSource = args.fromSource;
    }
  }
};
AfterSaleOrderParam.prototype = {};
AfterSaleOrderParam.prototype.read = function(input) {
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
        this.orderId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.sellerId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.startTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.endTime = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.STRING) {
        this.payTimeStart = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRING) {
        this.payTimeEnd = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 8:
      if (ftype == Thrift.Type.I32) {
        this.fromSource = input.readI32();
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

AfterSaleOrderParam.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleOrderParam');
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 1);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 2);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.sellerId !== null && this.sellerId !== undefined) {
    output.writeFieldBegin('sellerId', Thrift.Type.I32, 3);
    output.writeI32(this.sellerId);
    output.writeFieldEnd();
  }
  if (this.startTime !== null && this.startTime !== undefined) {
    output.writeFieldBegin('startTime', Thrift.Type.STRING, 4);
    output.writeString(this.startTime);
    output.writeFieldEnd();
  }
  if (this.endTime !== null && this.endTime !== undefined) {
    output.writeFieldBegin('endTime', Thrift.Type.STRING, 5);
    output.writeString(this.endTime);
    output.writeFieldEnd();
  }
  if (this.payTimeStart !== null && this.payTimeStart !== undefined) {
    output.writeFieldBegin('payTimeStart', Thrift.Type.STRING, 6);
    output.writeString(this.payTimeStart);
    output.writeFieldEnd();
  }
  if (this.payTimeEnd !== null && this.payTimeEnd !== undefined) {
    output.writeFieldBegin('payTimeEnd', Thrift.Type.STRING, 7);
    output.writeString(this.payTimeEnd);
    output.writeFieldEnd();
  }
  if (this.fromSource !== null && this.fromSource !== undefined) {
    output.writeFieldBegin('fromSource', Thrift.Type.I32, 8);
    output.writeI32(this.fromSource);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ReturnScoreParam = module.exports.ReturnScoreParam = function(args) {
  this.productId = null;
  this.orderId = null;
  this.scoreAmount = null;
  this.passWord = null;
  if (args) {
    if (args.productId !== undefined) {
      this.productId = args.productId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.scoreAmount !== undefined) {
      this.scoreAmount = args.scoreAmount;
    }
    if (args.passWord !== undefined) {
      this.passWord = args.passWord;
    }
  }
};
ReturnScoreParam.prototype = {};
ReturnScoreParam.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRING) {
        this.orderId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.scoreAmount = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.passWord = input.readString();
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

ReturnScoreParam.prototype.write = function(output) {
  output.writeStructBegin('ReturnScoreParam');
  if (this.productId !== null && this.productId !== undefined) {
    output.writeFieldBegin('productId', Thrift.Type.STRING, 1);
    output.writeString(this.productId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 2);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.scoreAmount !== null && this.scoreAmount !== undefined) {
    output.writeFieldBegin('scoreAmount', Thrift.Type.I32, 3);
    output.writeI32(this.scoreAmount);
    output.writeFieldEnd();
  }
  if (this.passWord !== null && this.passWord !== undefined) {
    output.writeFieldBegin('passWord', Thrift.Type.STRING, 4);
    output.writeString(this.passWord);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

ScoreBackProduct = module.exports.ScoreBackProduct = function(args) {
  this.id = null;
  this.productId = null;
  this.userId = null;
  this.orderId = null;
  this.amount = null;
  this.createTime = null;
  if (args) {
    if (args.id !== undefined) {
      this.id = args.id;
    }
    if (args.productId !== undefined) {
      this.productId = args.productId;
    }
    if (args.userId !== undefined) {
      this.userId = args.userId;
    }
    if (args.orderId !== undefined) {
      this.orderId = args.orderId;
    }
    if (args.amount !== undefined) {
      this.amount = args.amount;
    }
    if (args.createTime !== undefined) {
      this.createTime = args.createTime;
    }
  }
};
ScoreBackProduct.prototype = {};
ScoreBackProduct.prototype.read = function(input) {
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
      if (ftype == Thrift.Type.STRING) {
        this.productId = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.userId = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.orderId = input.readString();
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
      case 6:
      if (ftype == Thrift.Type.STRING) {
        this.createTime = input.readString();
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

ScoreBackProduct.prototype.write = function(output) {
  output.writeStructBegin('ScoreBackProduct');
  if (this.id !== null && this.id !== undefined) {
    output.writeFieldBegin('id', Thrift.Type.I32, 1);
    output.writeI32(this.id);
    output.writeFieldEnd();
  }
  if (this.productId !== null && this.productId !== undefined) {
    output.writeFieldBegin('productId', Thrift.Type.STRING, 2);
    output.writeString(this.productId);
    output.writeFieldEnd();
  }
  if (this.userId !== null && this.userId !== undefined) {
    output.writeFieldBegin('userId', Thrift.Type.I32, 3);
    output.writeI32(this.userId);
    output.writeFieldEnd();
  }
  if (this.orderId !== null && this.orderId !== undefined) {
    output.writeFieldBegin('orderId', Thrift.Type.STRING, 4);
    output.writeString(this.orderId);
    output.writeFieldEnd();
  }
  if (this.amount !== null && this.amount !== undefined) {
    output.writeFieldBegin('amount', Thrift.Type.I32, 5);
    output.writeI32(this.amount);
    output.writeFieldEnd();
  }
  if (this.createTime !== null && this.createTime !== undefined) {
    output.writeFieldBegin('createTime', Thrift.Type.STRING, 6);
    output.writeString(this.createTime);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

MaxReturnScoreResult = module.exports.MaxReturnScoreResult = function(args) {
  this.productFinishScore = null;
  this.orderFinishScore = null;
  this.orderExchangeScore = null;
  this.productPrice = null;
  this.orderPostage = null;
  this.sbpList = null;
  this.result = null;
  if (args) {
    if (args.productFinishScore !== undefined) {
      this.productFinishScore = args.productFinishScore;
    }
    if (args.orderFinishScore !== undefined) {
      this.orderFinishScore = args.orderFinishScore;
    }
    if (args.orderExchangeScore !== undefined) {
      this.orderExchangeScore = args.orderExchangeScore;
    }
    if (args.productPrice !== undefined) {
      this.productPrice = args.productPrice;
    }
    if (args.orderPostage !== undefined) {
      this.orderPostage = args.orderPostage;
    }
    if (args.sbpList !== undefined) {
      this.sbpList = args.sbpList;
    }
    if (args.result !== undefined) {
      this.result = args.result;
    }
  }
};
MaxReturnScoreResult.prototype = {};
MaxReturnScoreResult.prototype.read = function(input) {
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
        this.productFinishScore = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I32) {
        this.orderFinishScore = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.I32) {
        this.orderExchangeScore = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.STRING) {
        this.productPrice = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 5:
      if (ftype == Thrift.Type.STRING) {
        this.orderPostage = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 6:
      if (ftype == Thrift.Type.LIST) {
        var _size32 = 0;
        var _rtmp336;
        this.sbpList = [];
        var _etype35 = 0;
        _rtmp336 = input.readListBegin();
        _etype35 = _rtmp336.etype;
        _size32 = _rtmp336.size;
        for (var _i37 = 0; _i37 < _size32; ++_i37)
        {
          var elem38 = null;
          elem38 = new ttypes.ScoreBackProduct();
          elem38.read(input);
          this.sbpList.push(elem38);
        }
        input.readListEnd();
      } else {
        input.skip(ftype);
      }
      break;
      case 7:
      if (ftype == Thrift.Type.STRUCT) {
        this.result = new result_ttypes.Result();
        this.result.read(input);
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

MaxReturnScoreResult.prototype.write = function(output) {
  output.writeStructBegin('MaxReturnScoreResult');
  if (this.productFinishScore !== null && this.productFinishScore !== undefined) {
    output.writeFieldBegin('productFinishScore', Thrift.Type.I32, 1);
    output.writeI32(this.productFinishScore);
    output.writeFieldEnd();
  }
  if (this.orderFinishScore !== null && this.orderFinishScore !== undefined) {
    output.writeFieldBegin('orderFinishScore', Thrift.Type.I32, 2);
    output.writeI32(this.orderFinishScore);
    output.writeFieldEnd();
  }
  if (this.orderExchangeScore !== null && this.orderExchangeScore !== undefined) {
    output.writeFieldBegin('orderExchangeScore', Thrift.Type.I32, 3);
    output.writeI32(this.orderExchangeScore);
    output.writeFieldEnd();
  }
  if (this.productPrice !== null && this.productPrice !== undefined) {
    output.writeFieldBegin('productPrice', Thrift.Type.STRING, 4);
    output.writeString(this.productPrice);
    output.writeFieldEnd();
  }
  if (this.orderPostage !== null && this.orderPostage !== undefined) {
    output.writeFieldBegin('orderPostage', Thrift.Type.STRING, 5);
    output.writeString(this.orderPostage);
    output.writeFieldEnd();
  }
  if (this.sbpList !== null && this.sbpList !== undefined) {
    output.writeFieldBegin('sbpList', Thrift.Type.LIST, 6);
    output.writeListBegin(Thrift.Type.STRUCT, this.sbpList.length);
    for (var iter39 in this.sbpList)
    {
      if (this.sbpList.hasOwnProperty(iter39))
      {
        iter39 = this.sbpList[iter39];
        iter39.write(output);
      }
    }
    output.writeListEnd();
    output.writeFieldEnd();
  }
  if (this.result !== null && this.result !== undefined) {
    output.writeFieldBegin('result', Thrift.Type.STRUCT, 7);
    this.result.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

