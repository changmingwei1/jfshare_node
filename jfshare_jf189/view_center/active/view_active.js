exports.baoyou = function(req, res, next) {
    res.render("active/201701shangpin", res.resData);
};
exports.christmas = function(req, res, next) {
    res.render("active/201702qingrenjie", res.resData);
};

// 敷轻松百分尊享
exports.fuqingsong = function(req, res, next) {
	res.render("active/201703fuqingsong", res.resData);
};
// 伊诗兰顿百分尊享
exports.hufu = function(req, res, next) {
	res.render("active/201703hufu", res.resData);
};




