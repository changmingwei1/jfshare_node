exports.signup = function(req, res, next, data) {
    res.render("index/signup", data);
}

exports.login = function(req, res, next, data) {
    res.render("index/login", data);
}

exports.notfound = function(req, res, next) {
    var data = {};
    res.render("index/404", data);
}

exports.err = function(req, res, next, data) {
    res.render("index/500", data);
}

exports.tip = function(req, res, next, data) {
    res.render("index/tip", data);
}




