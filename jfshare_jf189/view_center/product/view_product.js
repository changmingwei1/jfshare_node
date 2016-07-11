exports.detail = function(req, res, next, paramters) {
    paramters.tyHostUrl = res.resData.tyHostUrl;
    res.render("product/detail", paramters);
};

