var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./controllers/seller_controller');
var products = require("./controllers/product_controller");
var managers = require("./controllers/manager_controller");
var sellers = require("./controllers/seller_controller");
var menu = require("./views/layout/main_menu");
var view_index = require('./view_center/index/view_index');
var domain = require('domain');
var SessionInterceptor = require('./lib/middleware/SessionInterceptor');

var signup = require("./controllers/signup_controller");
var signin = require("./controllers/signin_controller");
var signout = require("./controllers/signout_controller");
var index = require("./controllers/index_controller");

/*类目请求路由*/
var subjects = require("./controllers/subject_controller");

var slotImage = require("./controllers/slotImage_controller");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('viewsDir', path.join(__dirname, 'views'));
app.set('partialsDir', path.join(__dirname, 'views/partials'));
app.set('layoutsDir', path.join(__dirname, 'views/layout'));

var hbs = require("express-hbs");
console.log(":::::::: __dirname:::::::::;"+ __dirname);
console.log('layoutsDir::::::::::::'+app.get('layoutsDir'));
// view engine setup
app.engine('hbs', hbs.express4({
  viewsDir    : path.join(__dirname, 'views'),
  partialsDir : path.join(__dirname, 'views/partials'),
  layoutsDir  : path.join(__dirname, 'views/layout')
}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /static
app.use(favicon(path.join(__dirname, 'static', 'img/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

/*************************************************************
 * 锟斤拷锟斤拷一锟斤拷domain锟斤拷锟叫硷拷锟斤拷锟斤拷锟矫恳伙拷锟斤拷锟斤拷蠖及锟斤拷锟斤拷锟揭伙拷锟斤拷锟斤拷锟斤拷锟絛omain锟斤拷
 * domain锟斤拷锟斤拷锟斤拷锟届常
 **************************************************************/
app.use(function (req,res, next) {

  var d = domain.create();
  d.on('error', function (err) {
    console.log(err.stack);
    res.statusCode = 500;
    res.json({'sucess':false,'messag': 'domain处理异常'});

  });
  d.add(req);
  d.add(res);

  d.run(next);
});


/**
 * 非登录路由
 */
app.use('/signup',signup);
app.use('/signin',signin);
app.use('/signout',signout);

app.use(SessionInterceptor.ajaxValid());
app.use(SessionInterceptor.nomalValid());

app.use('/', index);
app.use('/users', users);
app.use('/product',products);
app.use('/subject',subjects);
app.use('/manager',managers);
app.use('/seller',sellers);
app.use('/slotImage',slotImage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  view_index.notfound(req, res, next, err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    view_index.err(req, res, next, err);
    console.log("系统错误 " + err.message);
    console.log("系统错误 " + err.stack);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  view_index.err(req, res, next, err);

  console.log("系统错误 " + err.message);
});


module.exports = app;
