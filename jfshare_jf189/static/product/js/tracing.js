function do_post(params) {
    //用isDSS参数判断是否调用
    if(isDSS == null || isDSS == undefined || isDSS == 'false'){
        return false;
    }
    var url = dssUrl_Out + "/trace";
    //var url = "http://60.166.15.147:8000/dss/trace";
    try {
            jQuery.ajax({
                type : "GET",
                url : url,
                data : params,
                dataType : 'jsonp',
                jsonp : 'jsonpcallback',
                success : function(responseText, textStatus, XMLHttpRequest) {
                    //alert("succ:" + responseText);
                }
            });
        } catch(err) {
            //alert(err);
        }

}
function do_cookie() {
    var cookieString = new String(document.cookie);
    var cookieHeader = "DssClientId";
    var beginPosition = cookieString.indexOf(cookieHeader);
    if (beginPosition != -1) //Get Cookie
    {
        //alert(cookieString);
        var arrCookie = cookieString.split(";");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0].replace(/(^\s*)|(\s*$)/gi, "") == "DssClientId")return arr[1];
        }
    }
    else //add Cookie
    {
        var exp = new Date();
        var value = exp.getTime();
        var Days = 30; //此 cookie 将被保存 30 天
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "DssClientId=" + value + ";expires=" + exp.toGMTString();
        return value;
    }
}

function getSessionId() {
    var cookieString = new String(document.cookie);
    var arrCookie = cookieString.split(";");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0].replace(/(^\s*)|(\s*$)/gi, "") == "JSESSIONID")return arr[1];
    }
}

$(function() {
    var clientId = do_cookie();
    var sessionId = getSessionId();
    //alert(sessionId);
    var e = $("#infoscape-cfg");
    var referrer = document.referrer;
    var cfg = parse_cfg(e);
    //var trace = cfg.toJSONString();
    try {
        var trace = JSON.stringify(cfg);
        //alert(trace);
        //trace = encodeURI(encodeURI(trace));
        trace = encodeURIComponent(encodeURIComponent(trace));
        var pdata;
        if (referrer) {
            var rr = encodeURIComponent(encodeURIComponent(referrer));
            pdata = "payload=" + trace + "&rr=" + rr + "&clientId=" + clientId + "&sessionId=" + sessionId;
        } else {
            pdata = "payload=" + trace + "&clientId=" + clientId + "&sessionId=" + sessionId;
        }
        if (trace != 'undefined') {
            do_post(pdata);
        }
    } catch(err) {
    }
});


function favor_cfg(userId, productId, brand, path) {
    userId=userId.replace(/(^\s*)|(\s*$)/g, "");
    var clientId = do_cookie();
    var sessionId = getSessionId();
    var cfg = {
        userId : userId,
        type : 'favor',
        favor : {
            productId : productId,
            brand : brand,
            category : path
        }
    };
    try {
        var trace = JSON.stringify(cfg);
        var params = "payload=" + trace + "&clientId=" + clientId + "&sessionId=" + sessionId;
        if (trace != 'undefined') {
            do_post(params);
        }
    } catch(err) {
    }
}

function merchantFavor_cfg(userId, merId, merName) {
    userId=userId.replace(/(^\s*)|(\s*$)/g, "");
    var clientId = do_cookie();
    var sessionId = getSessionId();
    var cfg = {
        userId : userId,
        type : 'merchantFavor',
        favor : {
            merchantId : merId,
            merchantName : merName
        }
    };
    var trace = JSON.stringify(cfg);
    var params = "payload=" + trace + "&clientId=" + clientId + "&sessionId=" + sessionId;
    if (trace != 'undefined') {
        do_post(params);
    }
}

function login_cfg(userId) {
    userId=userId.replace(/(^\s*)|(\s*$)/g, "");
    var clientId = do_cookie();
    var sessionId = getSessionId();
    var cfg = {
        userId : userId,
        type : 'login',
        login : {
            userId : userId
        }
    };
    try {
        var trace = JSON.stringify(cfg);
        var params = "payload=" + trace + "&clientId=" + clientId + "&sessionId=" + sessionId;
        if (trace != 'undefined') {
            do_post(params);
        }
    } catch(err) {
    }

}

function comments_cfg(userId, productId, commentId, content) {
    userId=userId.replace(/(^\s*)|(\s*$)/g, "");
    var clientId = do_cookie();
    var sessionId = getSessionId();
    var cfg = {
        userId : userId,
        type : 'comments',
        comments : {
            productId : productId,
            commentId : commentId,
            content : content
        }
    };
    try {
        var trace = JSON.stringify(cfg);
        trace = encodeURI(encodeURI(trace));
        var params = "payload=" + trace + "&clientId=" + clientId + "&sessionId=" + sessionId;
        if (trace != 'undefined') {
            do_post(params);
        }
    } catch(err) {
    }
}


function parse_cfg(e) {
    var k,v,s,t,q,c = {},is_array = true,a = [];

    if (!e) return c;
    q = ($("dl.infoscape-cfg", e)[0] || e).childNodes;
    if (typeof(q) != "undefined") {
        for (var i = 0; i < q.length; i++) {
            switch (q[i].nodeName.toLowerCase()) {
                case 'dt':
                    a[a.length] = k = $.trim(q[i].innerHTML);
                    c[k] = true;
                    break;
                case 'dd':
                    // not an array
                    is_array = false;

                    // nested dl(s)?
                    //t = q[i].getElementsByTagName("dl");
                    t = [];
                    s = q[i].childNodes;
                    for (var j = 0; j < s.length; j++) {
                        if (s[j].nodeName.toLowerCase() == "dl") {
                            t.push(s[j]);
                        }
                    }

                    if (t.length) {
                        v = [];
                        for (var j = 0; j < t.length; j++) {
                            v.push(parse_cfg(t[j]));
                        }

                        if (v.length == 1) {
                            v = v[0];
                        }
                        c[k] = v;
                    } else {
                        v = $.trim(q[i].innerHTML).substring(0, 200);

                        c[k] = v;
                        break;
                    }
            }
        }
        if (is_array && a.length) c = a;
        return c;
    }

}

