var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var user = require('./controllers/user_controller');
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


app.use('/manager/score',score);

app.use('/manager/scoreCards',score_cards);// 积分卡   
app.use('/manager/redPaper',redPaper);// 积分红包


app.use('/manager/message',message);
app.use('/manager/seller',seller);
app.use('/manager/brand',brand);
app.use('/manager/afterSale',afterSale);
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
