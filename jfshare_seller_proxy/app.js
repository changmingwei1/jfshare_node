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
var expressOrder = require('./controllers/express_controller');

var stock = require('./controllers/stock_controller');
var address = require('./controllers/address_controller');
var app = express();

var template = require('./controllers/template_controller');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/seller/template',template);
app.use('/seller/subject',subject);
app.use('/seller',user);
app.use('/seller/product',product);
app.use('/seller/order',order);
app.use('/seller/address',address);
app.use('/seller/expressorder',expressOrder);
app.use('/seller/stock',stock);
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
