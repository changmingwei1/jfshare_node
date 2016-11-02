var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
// create "middleware"
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('domain');
var session = require('express-session');

var zookeeper = require('./lib/util/zookeeper_util');
var log4node = require('./lib/util/log4node');
var MultipleRedisStore = require('connect-redis-multiple')(session);
var SessionInterceptor = require('./lib/middleware/SessionInterceptor');

//非登录请求路由
var index = require('./controllers/index_controller');
var login = require('./controllers/login_controller');
var logout = require('./controllers/logout_controller');
var signup = require('./controllers/signup_controller');
var buyers = require('./controllers/buyer_controller');
var test = require('./controllers/test_controller');
var jf189 = require('./controllers/jf189_controller');
var active = require('./controllers/active_controller');
//订单
var orders = require("./controllers/order_controller");
var commons = require("./controllers/common_controller");
var addresses = require("./controllers/address_controller");
var products = require("./controllers/product_controller");
var carts = require("./controllers/cart_controller");
var pays = require("./controllers/pay_controller");
var sellers = require("./controllers/seller_controller");

var view_index = require("./view_center/index/view_index");
var view_buyer = require("./view_center/buyer/view_buyer");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('viewsDir', path.join(__dirname, 'views'));
app.set('partialsDir', path.join(__dirname, 'views/partials'));
app.set('layoutsDir', path.join(__dirname, 'views/layout'));
app.set('orderDir', path.join(__dirname, 'views/order'));
app.set('productDir', path.join(__dirname, 'views/product'));
app.set('cartDir', path.join(__dirname, 'views/cart'));
var hbs = require("express-hbs");

// =================log record=================
log4node.configlog4node.appLog4js(app);
var logger =log4node.configlog4node.servLog4js();
// =================log record=================


logger.info(":::::::: __dirname:::::::::;"+ __dirname);
logger.info('layoutsDir::::::::::::'+app.get('layoutsDir'));
app.engine('hbs', hbs.express4({
  viewsDir    : path.join(__dirname, 'views'),
  partialsDir : path.join(__dirname, 'views/partials'),
  layoutsDir  : path.join(__dirname, 'views/layout'),
  orderDir :  path.join(__dirname, 'views/order'),
  productDir :  path.join(__dirname, 'views/product'),
  cartDir :  path.join(__dirname, 'views/cart')
}));

app.set('view engine', 'hbs');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

/*domain异常处理*/
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



app.use(SessionInterceptor.cookieDisabled());
var opts = {
  servers: [
    {
      //host: zookeeper.getData("redis_host"),
      //port: zookeeper.getData("redis_port"),
      //pass:zookeeper.getData("redis_pwd"),
      host:'10.24.200.181',
      //host:'101.201.39.63',
      port:'6380',
      pass:'JFshare#0328',
      client: null,
      socket: null,
      ttl: 36000,
      disableTTL: false,
      prefix: 'web-sid:',
      access: 'RW',
      db:2,
    }
  ],
  balance: 'random'
}

 //设置 Session
app.use(session({
  store:new MultipleRedisStore(opts),
  secret:'jfshare_secret',
  saveUninitialized: true,
  resave: false,
  rolling:true,
  key: 'ssid'
}));

app.use(SessionInterceptor.buildResData());
//引入app模块中
app.use('/test', test);
app.use('/login', login);
app.use('/logout', logout);
app.use('/product',products);
app.use('/pay',pays);
app.use('/jf189',jf189);
app.use('/seller', sellers);
app.use('/', index);
app.use('/nnc', commons);
app.use('/active', active);

app.use(SessionInterceptor.ajaxValid());
app.use(SessionInterceptor.nomalValid());
/*登录后路由**************************************/
app.use('/order', orders);
app.use('/address', addresses);
app.use('/buyer', buyers);
app.use('/cart', carts);

//app.use(function(){console.log("=======================静态资源======================")});

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
