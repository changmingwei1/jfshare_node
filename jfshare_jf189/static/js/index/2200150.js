$(document).ready(function () {

    $(".clock").each(function(){
        var self = $(this);
        var maxtime = self.attr("data-end");
        var timestamp = Date.parse(new Date()) / 1000;
        maxtime = maxtime / 1000 - timestamp;
        var timer = setInterval(function () {
            if (maxtime >= 0) {
                d = Math.floor(maxtime / 86400),
                    h = Math.floor((maxtime % 86400) / 3600),
                    m = Math.floor(((maxtime % 86400) % 3600) / 60),
                    s = Math.floor(((maxtime % 86400) % 3600) % 60);
                msg = " <i class='icon'></i><em>仅剩</em><b>" + d + "</b>天<b>" + h + "</b>时<b>" + m + "</b>分<b>" + s + "</b>秒";
                self.html(msg);
                --maxtime;
            }
            else {
                clearInterval(timer);
                self.html(" <i class='icon'></i><em>已结束!</em>");
            }
        }, 1000);
    });
});  