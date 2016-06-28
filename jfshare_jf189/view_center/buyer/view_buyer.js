exports.ucenter = function(req, res, next, data) {
    res.render("ucenter/center", data);
}

exports.info_edit = function(req, res, next, data) {
    res.render("ucenter/buyer/info_edit", data);
}

exports.identity_verification = function(req, res, next) {
    var parameters = {}
    res.render("ucenter/buyer/identity_verification", parameters);
}

exports.buyer_safe = function(req, res, next) {
    res.render("ucenter/buyer/buyer_safe", null);
}

exports.my_orders = function(req, res, next) {
    res.render("ucenter/order/my_orders", res.resData);
}

exports.my_order_detail = function(req, res, next, parameters) {
    res.render("ucenter/order/my_detail", parameters);
}


