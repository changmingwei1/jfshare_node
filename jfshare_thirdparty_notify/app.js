var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

var kuaidi = require('./controllers/kuaidi100_controller');
var tests = require('./controllers/test_controller');
var view_index = require("./view_center/index/view_index");
var pay = require('./controllers/pay_controller');
var app = express();
var zk = require('./resource/zookeeper_util.js');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(function (req, res, next){
  //console.log("-----------reqUrl===" + req.url);
  if (req.method !== 'GET' && (req.url === '/pay/notify/alipay' || req.url == '/pay/notify/weixinpay' ||
      req.url == '/pay/notify/hebaopay')) {
    req.headers['content-type'] = 'application/x-www-form-urlencoded';
  }
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/kuaidi', kuaidi);
app.use('/test', tests);
app.use('/pay',pay);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("##############################################");
  var err = new Error('Not Found');
  err.status = 404;
  console.log("访问的页面不存在： " + req.url);
  view_index.notfound(req,res, next);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    view_index.err(req,res, next,{
      message: err.message,
      error: err
    });
    console.log("系统错误 " + err.message);
    console.log("系统错误 " + err.stack);
  });
}

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  view_index.err(req,res, next,{
    message: err.message,
    error: err
  });
  console.log("系统错误 " + err.message);
});



module.exports = app;
