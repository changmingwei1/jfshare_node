exports.active = function(req, res, next) {
    parameters.tyHostUrl = res.resData.tyHostUrl;
    res.render("active/201611baoyou", res.paramters);
}




