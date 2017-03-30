/**
 * Created by Administrator on 2017/3/28 0028.
 */
/**
 * Created by zhaoshenghai on 16/3/22.
 */
var express = require('express');
var router = express.Router();

var log4node = require('../log4node');
var logger = log4node.configlog4node.useLog4js(log4node.configlog4node.log4jsConfig);

var Manager = require('../lib/models/manager');

router.post('/getShareUrl', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("getShareUrl request:" + JSON.stringify(arg));
        if (arg == null) {
            result.code = 500;
            res.json(result);
            return;
        }

        //String openId, String userId, String name, String img,String token

        if (arg.openId == null || arg.openId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.userId == null || arg.userId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.name == null || arg.name == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.img == null || arg.img == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.token == null || arg.token == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Manager.getShareUrl(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            result.url = "http://h5.jfshare.com/html/friendshipActivityRecord.html?"+data[0].value;
            res.json(result);
        });
    } catch (ex) {
        logger.error("发生异常:" + ex);
        result.code = 500;
        result.desc = "系统异常";
        res.json(result);
    }
});

router.post('/pushFriends', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("pushFriends request:" + JSON.stringify(arg));
        if (arg == null) {
            result.code = 500;
            res.json(result);
            return;
        }
        //

        if (arg.selfOpenId == null || arg.selfOpenId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.selfName == null || arg.selfName == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.friendsOpenId == null || arg.friendsOpenId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.friendUserId == null || arg.friendUserId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.sign == null || arg.sign == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.selfimg == null || arg.selfimg == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.token == null || arg.token == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Manager.pushFriends(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            result.img = data[0].img;
            result.value = data[0].value;
            result.friendsName = data[0].friendsName;
            res.json(result);
            return;
        });
    } catch (ex) {
        logger.error("发生异常:" + ex);
        result.code = 500;
        result.desc = "系统异常";
        res.json(result);
    }
});
//queryTotalScore

router.post('/queryTotalScore', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("queryTotalScore request:" + JSON.stringify(arg));
        if (arg == null) {
            result.code = 500;
            res.json(result);
            return;
        }
        //

        if (arg.userId == null || arg.userId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.openId == null || arg.openId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Manager.queryTotalScore(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }
            result.value = data[0].value;
            result.img = data[0].img;
            result.name = data[0].friendsName;
            result.date  = data[0].dateTime;
            res.json(result);
            return;
        });
    } catch (ex) {
        logger.error("发生异常:" + ex);
        result.code = 500;
        result.desc = "系统异常";
        res.json(result);
    }
});

router.post('/queryPushList', function (req, res, next) {
    var result = {code: 200};

    try {
        var arg = req.body;
        logger.info("queryPushList request:" + JSON.stringify(arg));
        if (arg == null) {
            result.code = 500;
            res.json(result);
            return;
        }

        if (arg.userId == null || arg.userId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.openId == null || arg.openId == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }
        if (arg.currentPage == null || arg.currentPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        if (arg.numPerPage == null || arg.numPerPage == "") {
            result.code = 500;
            result.desc = "参数错误";
            res.json(result);
            return;
        }

        Manager.queryPushList(arg, function (err, data) {
            if (err) {
                res.json(err);
                return;
            }

            result.pushList = data[0].pushList;
            result.pagination = data[0].pagination;
            res.json(result);
            return;
        });
    } catch (ex) {
        logger.error("发生异常:" + ex);
        result.code = 500;
        result.desc = "系统异常";
        res.json(result);
    }
});


module.exports = router;