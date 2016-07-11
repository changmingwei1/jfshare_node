exports.notfound = function(req, res, next) {
    res.render("index/404", res.resData);
}

exports.err = function(req, res, next, data) {
    data.tyHostUrl = res.resData.tyHostUrl;
    res.render("index/500", data);
}

exports.tip = function(req, res, next, data) {
    data.tyHostUrl = res.resData.tyHostUrl;
    res.render("index/tip", data);
}




