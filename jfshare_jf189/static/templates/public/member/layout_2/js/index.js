/*=======最新订单========*/
$(function () {
    $(".pic_list").find("a:gt(2)").hide();
    $(".u_tabmenu").find("a").bind("click", function () {
        $(this).addClass("cur");
        $(this).siblings().removeClass("cur");
        var s = $(this).index();
        $(".eachCom").siblings().eq(s).show().siblings().hide();
    });
});
function closeDiv(num) {
    $("#blk" + num).css("display", "none");
}
function showDiv(num) {
    center("#blk" + num);
}
function showPicDiv(id) {
    if ($("#icon_pic_" + id).hasClass('ic_hide')) {
        $("#pic_list_" + id).find("a").show()
        $("#icon_pic_" + id).attr("class", "ic_show");
    } else {
        $("#pic_list_" + id).find("a:gt(2)").hide()
        $("#icon_pic_" + id).attr("class", "ic_hide");
    }
}
function showOrderStateTack(id,c, orderId, delMerchantId, billNo) {
    var obj = $(this);
    var cName = $("#orderState_track_ul_" + id).attr("class");
    if (cName != "s_hover") {
        $("#orderState_track_b_" + id).attr("class", "s_hover");
        $("#orderState_track_ul_" + id).show();

        var obj = $("#orderState_track_ul_" +id), verifyCode = 0;
        obj.html("<li style='text-align: center;'><span>加载中</span></li>")
        jQuery.ajaxSettings['contentType'] = "application/x-www-form-urlencoded; charset=utf-8";
        jQuery.post("/member/returnLogisticsInfo.jsp", {delMerchantId:delMerchantId, billNo:billNo, verifyCode:verifyCode, orderId:orderId}, function (res) {
            obj.empty().append(res);
        });
    }
}
function hideOrderStateTack(id) {
    var obj = $(this);
    var cName = $("#orderState_track_ul_" + id).attr("class");
    if (cName != "s_hover") {
        $("#orderState_track_b_" + id).attr("class", "hover");
        $("#orderState_track_ul_" + id).hide();
    }
}
/*============================end 最新订单==============================*/

/*==============================待评价商品=======================================*/
function showComment(userId, pid, stylePath, path, type) {
    if (userId == null || userId == '') {
        loginBlock(t, pid)
    } else {
        loadComment(pid, stylePath, path);
    }
}
function loadComment(pid, stylePath, path) {
    params = new Object();
    params["pid"] = pid;
    params["stylePath"] = stylePath;
    params["layout"] = path;
    jQuery("#addCommentDiv").load(frontPath + "/member/commentLayer.jsp", params, function () {
        center("#addCommentDiv");
    });
}

/*--------------------评论弹出层----------------------------------*/
$(function () {
    $("#c_stat_span").find("a").bind("click", function () {
        var index = $(this).index();
        if (index == 0) {
            $(this).parent().attr("class", "sa1")
        } else if (index == 1) {
            $(this).parent().attr("class", "sa2")
        } else if (index == 2) {
            $(this).parent().attr("class", "sa3")
        } else if (index == 3) {
            $(this).parent().attr("class", "sa4")
        } else if (index == 4) {
            $(this).parent().attr("class", "sa5")
        }
        document.getElementById("grade").value = index + 1;
    });
    /*不能超过300个字*/
    $(".commentProductContent").keyup(function () {
        var maxLength = 300;
        var countStr = $(this).val().length;
        var addAffter = maxLength - countStr;
        var showCount = addAffter;
        if (countStr >= 300) {
            showCount = "0";
            $("#counts").css({"color":"#FF6600"});
        } else {
            $("#counts").css({"color":"#999999"});
        }
        $("#counts").html(showCount);
    });
    /*end 不能超过300个字*/
});

$().ready(function () {
    $("#commentBtnSave").click(function () {
        var options = {
            beforeSubmit:checkComment,
            success:successCom
        };
        $("#commentProductform").ajaxSubmit(options);
    });
});

function checkComment() {
    var theForm = document.getElementById("commentProductform");
    var title = theForm.title.value;
    if (title == "") {
        alert("请填写评论标题!")
        return false;
    }
    var str = $.trim(theForm.content.value);
    if (str == "") {
        alert("请填写评论内容!")
        return false;
    }
    if (str.length > 300) {
        alert("请限制字数在300字内!")
        return false;
    }
}

function successCom(responseText, statusText) {
    divClose('#commentLayer');
    if (statusText == "success") {
        var data = $.trim(responseText);
        if (data == "ok") {
            //  alert("评论成功， 请耐心等待管理员的审核！");
            center("#msglayer2success");
            show(5);
            divClose('#remarkLayer');
        }
        else {
            if (data == 9) {
                alert("购买过该商品的用户才能评论!")
                refreshValidateCode();
                return;
            }
            if (data == 2) {
                alert("评论标题不能够为空!")
            }
            if (data == 3) {
                alert("评论内容不能够为空!")
            }
            if (data == 1) {
                loginBlock('c', 0)
            }
            if (data.length > 10) {
                alert("系统繁忙请稍后重试!")
                $("#commentErr").addClass("box_error").html("系统繁忙请稍后重试！");
            }
        }
    }
}
var SysSecond;
var InterValObj;
function show(time) {
    SysSecond = time;
    InterValObj = window.setInterval(showTime, 1000);
}
function showTime() {
    if (SysSecond > 0) {
        SysSecond = SysSecond - 1;
        var second = Math.floor(SysSecond % 60);             // 计算秒
        document.getElementById("timeNum").innerHTML = second;
    } else {//剩余时间小于或等于0的时候，就停止间隔函数
        window.clearInterval(InterValObj);
        divClose('#msglayer2success');
        window.location.reload();
    }
}

/*==============================猜你喜欢=======================================*/
$(function () {
    var page_ = 1;//当前第一页
    var i = 4; //每次切换4张图片
    var len = $("#youLikeScrollbox ul li").length; //获取焦点图个数
    var page_count = Math.ceil(len / i);   //总页数，只要不是整数，就往大的方向取最小的整数
    var unit_width = $("#youLikeScrollbox").width(); //获取框架内容的宽度,不带单位
    var $parent = $("#youLikeScrollbox_ul"); //根据当前点击元素获取到父元素
//向右 按钮
    $("#guessYouLikeNext").click(function () {
        if (!$parent.is(":animated")) {
            if (page_ == (page_count)) {  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
                $parent.animate({ left:0}, "slow"); //通过改变left值，跳转到第一个版面
                page_ = 1;
            } else {
                $parent.animate({ left:'-=' + unit_width}, "slow");  //通过改变left值，达到每次换一个版面
                page_++;
            }
        }
    });
//往左 按钮
    $("#guessYouLikePrve").bind("click", function () {
        if (!$parent.is(":animated")) {
            if (page_ == 1) {  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
                $parent.animate({ left:'-=' + unit_width * (page_count - 1)}, 800); //通过改变left值，跳转到最后一个版面
                page_ = page_count;
            } else {
                $parent.animate({ left:'+=' + unit_width }, 800);  //通过改变left值，达到每次换一个版面
                page_--;
            }
        }
    });
});
/*=============================end=猜你喜欢=======================================*/

/*==============================为您推荐=======================================*/
$(function () {
    var page_ = 1;//当前第一页
    var i = 4; //每次切换4张图片
    var len = $("#recommendScrollbox ul li").length; //获取焦点图个数
    var page_count = Math.ceil(len / i);   //总页数，只要不是整数，就往大的方向取最小的整数
    var unit_width = $("#recommendScrollbox").width(); //获取框架内容的宽度,不带单位
    var $parent = $("#recommendScrollbox_ul"); //根据当前点击元素获取到父元素
//向右 按钮
    $("#recommendNext").click(function () {
        if (!$parent.is(":animated")) {
            if (page_ == (page_count)) {  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。
                $parent.animate({ left:0}, "slow"); //通过改变left值，跳转到第一个版面
                page_ = 1;
            } else {
                $parent.animate({ left:'-=' + unit_width}, "slow");  //通过改变left值，达到每次换一个版面
                page_++;
            }
        }
    });
//往左 按钮
    $("#recommendPrve").bind("click", function () {
        if (!$parent.is(":animated")) {
            if (page_ == 1) {  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。
                $parent.animate({ left:'-=' + unit_width * (page_count - 1)}, 800); //通过改变left值，跳转到最后一个版面
                page_ = page_count;
            } else {
                $parent.animate({ left:'+=' + unit_width }, 800);  //通过改变left值，达到每次换一个版面
                page_--;
            }
        }
    });
});
/*=============================end=为您推荐=======================================*/




