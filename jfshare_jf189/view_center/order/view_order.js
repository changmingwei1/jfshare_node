exports.confirm_cart = function(req, res, next, parameters) {
    parameters.tyHostUrl = res.resData.tyHostUrl;
    res.render("order/confirm_cart", parameters);
}

exports.create_order = function(req, res, next, parameters) {
    parameters.tyHostUrl = res.resData.tyHostUrl;
    res.render("order/create_order", parameters);
}

exports.pay_ret = function(req, res, next, parameters) {
    if (parameters == null) {
        parameters = {};
    }
    parameters.tyHostUrl = res.resData.tyHostUrl;
    parameters.title="支付结果页";
    res.render("order/pay_ret", parameters);
}

