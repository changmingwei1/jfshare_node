exports.confirm_cart = function(req, res, next, parameters) {
    res.render("order/confirm_cart", parameters);
}

exports.create_order = function(req, res, next, parameters) {
    res.render("order/create_order", parameters);
}

exports.pay_ret = function(req, res, next, parameters) {
    if (parameters == null) {
        parameters = {};
    }
    parameters.title="支付结果页";
    res.render("order/pay_ret", parameters);
}

