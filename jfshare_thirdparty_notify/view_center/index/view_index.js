exports.notfound = function(req, res, next) {
    console.log('index----unfound-----view_center');
    var data = {};
    res.render("index/404", data);
}

exports.err = function(req, res, next, data) {
    console.log('index----syserr-----view_center');
    res.render("index/500", data);
}

exports.tip = function(req, res, next, data) {
    console.log('index----tip-----view_center');
    res.render("index/tip", data);
}




