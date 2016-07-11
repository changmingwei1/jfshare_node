exports.my_orders = function(req, res, next) {
    res.render("ucenter/order/my_orders", res.resData);
}

exports.my_order_detail = function(req, res, next) {
    res.render("ucenter/order/my_detail", res.resData);
}


