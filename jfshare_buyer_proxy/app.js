var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

//var index = require('./controllers/index_controller');
var product = require('./controllers/product_controller');
var order = require('./controllers/order_controller');
var cart = require('./controllers/cart_controller');
var address = require('./controllers/address_controller');
var buyer = require('./controllers/buyer_controller');
var score = require('./controllers/score_controller');    //万益通
var redPaper = require('./controllers/redpaper_controller');// 积分红包
var thirdpay = require('./controllers/thirdpay_controller');//第三方支付
//var test = require('./controllers/test_controller');
var coupon = require('./controllers/coupon_controller');//优惠券
var zookeeper = require('./resource/zookeeper_util');


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

//app.use('/share', index);
app.use('/buyer/product', product);
app.use('/buyer/class', product);
app.use('/buyer/order', order);
app.use('/buyer/redPaper',redPaper);// 积分红包
app.use('/buyer/cart', cart);
app.use('/buyer/address', address);
app.use('/buyer/coupon', coupon);
app.use('/buyer/buyer',buyer);
app.use('/buyer/score',score);
app.use('/buyer/thirdpay',thirdpay);//第三方支付
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
