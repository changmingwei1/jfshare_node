var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var buyer = require('./controllers/buyer_controller');// 启用禁用用户
var user = require('./controllers/user_controller');// 增加权限功能
var product=require('./controllers/product_controller');
var order  = require('./controllers/order_controller');

var subject = require('./controllers/subject_controller');

var message = require('./controllers/message_controller');
var seller = require('./controllers/seller_controller');
var score = require('./controllers/score_controller');
var score_cards = require('./controllers/score_cards_controller');// 积分卡
var redPaper = require('./controllers/redpaper_controller');// 积分红包
var brand = require('./controllers/brand_controller');
var address = require('./controllers/address_controller');
var afterSale = require('./controllers/afterSale_controller');
var slotImage = require('./controllers/slotImage_controller');// 主页轮播图模块页面的配置
var moduleConfig = require('./controllers/moduleConfig_controller');// 商品和品牌模块页面的配置
var permission = require('./controllers/permission_controller');// 权限管理

var friendsActivity = require('./controllers/friendsActivity_controller');//临时活动

var coupon = require('./controllers/coupon_controller');
var zookeeper = require('./resource/zookeeper_util');
var app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/manager/subject',subject);
app.use('/manager',user);
app.use('/manager/product',product);
app.use('/manager/order',order);
app.use('/manager/address',address);
app.use('/manager/permission',permission);
app.use('/manager/buyer',buyer);

app.use('/manager/score',score);

app.use('/manager/scoreCards',score_cards);// 积分卡   
app.use('/manager/redPaper',redPaper);// 积分红包
app.use('/manager/activity',friendsActivity);

app.use('/manager/message',message);
app.use('/manager/seller',seller);
app.use('/manager/brand',brand);
app.use('/manager/afterSale',afterSale);
app.use('/manager/coupon',coupon);
app.use('/manager/slotImage',slotImage);// 主页轮播图模块页面的配置
app.use('/manager/moduleConfig',moduleConfig);
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
