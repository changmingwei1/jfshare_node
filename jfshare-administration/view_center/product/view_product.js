exports.list = function(req, res, next, data) {
    console.log('product----list-----view_center');

    res.render("product/productList", data);
};





