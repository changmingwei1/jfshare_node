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


var ttypes = require('./afterSale_types');

//HELPER FUNCTIONS AND STRUCTURES

AfterSaleServ_request_args = function(args) {
  this.afterSale = null;
  if (args) {
    if (args.afterSale !== undefined) {
      this.afterSale = args.afterSale;
    }
  }
};
AfterSaleServ_request_args.prototype = {};
AfterSaleServ_request_args.prototype.read = function(input) {
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
        this.afterSale = new ttypes.AfterSale();
        this.afterSale.read(input);
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

AfterSaleServ_request_args.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_request_args');
  if (this.afterSale !== null && this.afterSale !== undefined) {
    output.writeFieldBegin('afterSale', Thrift.Type.STRUCT, 1);
    this.afterSale.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_request_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
AfterSaleServ_request_result.prototype = {};
AfterSaleServ_request_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new result_ttypes.StringResult();
        this.success.read(input);
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

AfterSaleServ_request_result.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_request_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_auditPass_args = function(args) {
  this.afterSale = null;
  if (args) {
    if (args.afterSale !== undefined) {
      this.afterSale = args.afterSale;
    }
  }
};
AfterSaleServ_auditPass_args.prototype = {};
AfterSaleServ_auditPass_args.prototype.read = function(input) {
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
        this.afterSale = new ttypes.AfterSale();
        this.afterSale.read(input);
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

AfterSaleServ_auditPass_args.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_auditPass_args');
  if (this.afterSale !== null && this.afterSale !== undefined) {
    output.writeFieldBegin('afterSale', Thrift.Type.STRUCT, 1);
    this.afterSale.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_auditPass_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
AfterSaleServ_auditPass_result.prototype = {};
AfterSaleServ_auditPass_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new result_ttypes.StringResult();
        this.success.read(input);
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

AfterSaleServ_auditPass_result.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_auditPass_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_queryAfterSale_args = function(args) {
  this.param = null;
  if (args) {
    if (args.param !== undefined) {
      this.param = args.param;
    }
  }
};
AfterSaleServ_queryAfterSale_args.prototype = {};
AfterSaleServ_queryAfterSale_args.prototype.read = function(input) {
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
        this.param = new ttypes.AfterSaleQueryParam();
        this.param.read(input);
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

AfterSaleServ_queryAfterSale_args.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_queryAfterSale_args');
  if (this.param !== null && this.param !== undefined) {
    output.writeFieldBegin('param', Thrift.Type.STRUCT, 1);
    this.param.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_queryAfterSale_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
AfterSaleServ_queryAfterSale_result.prototype = {};
AfterSaleServ_queryAfterSale_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.AfterSaleResult();
        this.success.read(input);
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

AfterSaleServ_queryAfterSale_result.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_queryAfterSale_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_queryAfterSaleOrder_args = function(args) {
  this.param = null;
  this.pagination = null;
  if (args) {
    if (args.param !== undefined) {
      this.param = args.param;
    }
    if (args.pagination !== undefined) {
      this.pagination = args.pagination;
    }
  }
};
AfterSaleServ_queryAfterSaleOrder_args.prototype = {};
AfterSaleServ_queryAfterSaleOrder_args.prototype.read = function(input) {
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
        this.param = new ttypes.AfterSaleOrderParam();
        this.param.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
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

AfterSaleServ_queryAfterSaleOrder_args.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_queryAfterSaleOrder_args');
  if (this.param !== null && this.param !== undefined) {
    output.writeFieldBegin('param', Thrift.Type.STRUCT, 1);
    this.param.write(output);
    output.writeFieldEnd();
  }
  if (this.pagination !== null && this.pagination !== undefined) {
    output.writeFieldBegin('pagination', Thrift.Type.STRUCT, 2);
    this.pagination.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServ_queryAfterSaleOrder_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
AfterSaleServ_queryAfterSaleOrder_result.prototype = {};
AfterSaleServ_queryAfterSaleOrder_result.prototype.read = function(input) {
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
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.AfterSaleOrderResult();
        this.success.read(input);
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

AfterSaleServ_queryAfterSaleOrder_result.prototype.write = function(output) {
  output.writeStructBegin('AfterSaleServ_queryAfterSaleOrder_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

AfterSaleServClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this._seqid = 0;
    this._reqs = {};
};
AfterSaleServClient.prototype = {};
AfterSaleServClient.prototype.seqid = function() { return this._seqid; }
AfterSaleServClient.prototype.new_seqid = function() { return this._seqid += 1; }
AfterSaleServClient.prototype.request = function(afterSale, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_request(afterSale);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_request(afterSale);
  }
};

AfterSaleServClient.prototype.send_request = function(afterSale) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('request', Thrift.MessageType.CALL, this.seqid());
  var args = new AfterSaleServ_request_args();
  args.afterSale = afterSale;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

AfterSaleServClient.prototype.recv_request = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new AfterSaleServ_request_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('request failed: unknown result');
};
AfterSaleServClient.prototype.auditPass = function(afterSale, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_auditPass(afterSale);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_auditPass(afterSale);
  }
};

AfterSaleServClient.prototype.send_auditPass = function(afterSale) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('auditPass', Thrift.MessageType.CALL, this.seqid());
  var args = new AfterSaleServ_auditPass_args();
  args.afterSale = afterSale;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

AfterSaleServClient.prototype.recv_auditPass = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new AfterSaleServ_auditPass_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('auditPass failed: unknown result');
};
AfterSaleServClient.prototype.queryAfterSale = function(param, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_queryAfterSale(param);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_queryAfterSale(param);
  }
};

AfterSaleServClient.prototype.send_queryAfterSale = function(param) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('queryAfterSale', Thrift.MessageType.CALL, this.seqid());
  var args = new AfterSaleServ_queryAfterSale_args();
  args.param = param;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

AfterSaleServClient.prototype.recv_queryAfterSale = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new AfterSaleServ_queryAfterSale_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('queryAfterSale failed: unknown result');
};
AfterSaleServClient.prototype.queryAfterSaleOrder = function(param, pagination, callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    var _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_queryAfterSaleOrder(param, pagination);
    return _defer.promise;
  } else {
    this._reqs[this.seqid()] = callback;
    this.send_queryAfterSaleOrder(param, pagination);
  }
};

AfterSaleServClient.prototype.send_queryAfterSaleOrder = function(param, pagination) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('queryAfterSaleOrder', Thrift.MessageType.CALL, this.seqid());
  var args = new AfterSaleServ_queryAfterSaleOrder_args();
  args.param = param;
  args.pagination = pagination;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

AfterSaleServClient.prototype.recv_queryAfterSaleOrder = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new AfterSaleServ_queryAfterSaleOrder_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('queryAfterSaleOrder failed: unknown result');
};
AfterSaleServProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
AfterSaleServProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

AfterSaleServProcessor.prototype.process_request = function(seqid, input, output) {
  var args = new AfterSaleServ_request_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.request.length === 1) {
    Q.fcall(this._handler.request, args.afterSale)
      .then(function(result) {
        var result = new AfterSaleServ_request_result({success: result});
        output.writeMessageBegin("request", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new AfterSaleServ_request_result(err);
        output.writeMessageBegin("request", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.request(args.afterSale,  function (err, result) {
      var result = new AfterSaleServ_request_result((err != null ? err : {success: result}));
      output.writeMessageBegin("request", Thrift.MessageType.REPLY, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

AfterSaleServProcessor.prototype.process_auditPass = function(seqid, input, output) {
  var args = new AfterSaleServ_auditPass_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.auditPass.length === 1) {
    Q.fcall(this._handler.auditPass, args.afterSale)
      .then(function(result) {
        var result = new AfterSaleServ_auditPass_result({success: result});
        output.writeMessageBegin("auditPass", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new AfterSaleServ_auditPass_result(err);
        output.writeMessageBegin("auditPass", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.auditPass(args.afterSale,  function (err, result) {
      var result = new AfterSaleServ_auditPass_result((err != null ? err : {success: result}));
      output.writeMessageBegin("auditPass", Thrift.MessageType.REPLY, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

AfterSaleServProcessor.prototype.process_queryAfterSale = function(seqid, input, output) {
  var args = new AfterSaleServ_queryAfterSale_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.queryAfterSale.length === 1) {
    Q.fcall(this._handler.queryAfterSale, args.param)
      .then(function(result) {
        var result = new AfterSaleServ_queryAfterSale_result({success: result});
        output.writeMessageBegin("queryAfterSale", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new AfterSaleServ_queryAfterSale_result(err);
        output.writeMessageBegin("queryAfterSale", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.queryAfterSale(args.param,  function (err, result) {
      var result = new AfterSaleServ_queryAfterSale_result((err != null ? err : {success: result}));
      output.writeMessageBegin("queryAfterSale", Thrift.MessageType.REPLY, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

AfterSaleServProcessor.prototype.process_queryAfterSaleOrder = function(seqid, input, output) {
  var args = new AfterSaleServ_queryAfterSaleOrder_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.queryAfterSaleOrder.length === 2) {
    Q.fcall(this._handler.queryAfterSaleOrder, args.param, args.pagination)
      .then(function(result) {
        var result = new AfterSaleServ_queryAfterSaleOrder_result({success: result});
        output.writeMessageBegin("queryAfterSaleOrder", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function (err) {
        var result = new AfterSaleServ_queryAfterSaleOrder_result(err);
        output.writeMessageBegin("queryAfterSaleOrder", Thrift.MessageType.REPLY, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.queryAfterSaleOrder(args.param, args.pagination,  function (err, result) {
      var result = new AfterSaleServ_queryAfterSaleOrder_result((err != null ? err : {success: result}));
      output.writeMessageBegin("queryAfterSaleOrder", Thrift.MessageType.REPLY, seqid);
      result.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
}

