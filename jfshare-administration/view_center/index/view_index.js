exports.signup = function(req, res, next, data) {
    console.log('index----signup-----view_center');
    res.render("index/signup", data);
}

exports.signin = function(req, res, next, data) {
    console.log('index----signin-----view_center');

    res.render("index/signin", data);
}

exports.signout = function(req, res, next, data) {
    console.log('index----signout-----view_center');
    res.redirect("index/signin");
}

exports.notfound = function(req, res, next, err) {
    console.log('index----unfound-----view_center');
    res.render("index/404", err);
}

exports.err = function(req, res, next, err) {
    console.log('index----syserr-----view_center');
    res.render("index/500", err);
}



