var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

var index = require('./controllers/index_controller');
var product = require('./controllers/product_controller');
var order = require('./controllers/order_controller');
var cart = require('./controllers/cart_controller');
var address = require('./controllers/address_controller');
var captcha = require('./controllers/captcha_controller');
var active = require('./controllers/active_controller');
var test = require('./controllers/test_controller');
var zookeeper = require('./resource/zookeeper_util');
var slotImage = require('./controllers/slotImage_controller');// 主页和商品模块页面的配置
var moduleConfig = require('./controllers/moduleConfig_controller');// 商品和品牌模块页面的配置

//var view_index = require("./view_center/index/view_index");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/shop', index);
app.use('/shop/product', product);
app.use('/shop/class', product);
app.use('/shop/order', order);
app.use('/shop/cart', cart);
app.use('/shop/address', address);
app.use('/shop/captcha',captcha);
app.use('/shop/active',active);
app.use('/shop/slotImage',slotImage);// 主页和商品模块页面的配置
app.use('/shop/moduleConfig',moduleConfig);
//app.use('/test', test);
//app.use('/test', tests);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("##############################################");
  console.log("访问的页面不存在： " + req.url);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("系统错误 " + err.message);
    console.log("系统错误 " + err.stack);
  });
}

// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  console.log("系统错误 " + err.message);
});



module.exports = app;
