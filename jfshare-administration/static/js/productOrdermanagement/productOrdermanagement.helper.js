
Handlebars.registerHelper("showImage",function(imgUrl,options){
    var img=imgUrl.split(",");
    return new Handlebars.SafeString(_imgServ + img[0]);
});


Handlebars.registerHelper("showStateDesc", function(state,options) {
    return new Handlebars.SafeString(getStateDescByState(state));
});

//根据商品状态渲染操作按钮
Handlebars.registerHelper("showOptBtns", function(state,options){
    return new Handlebars.SafeString(getOptBtnsByState(state));
});

function getStateDescByState(state) {
    var mapActiveState = {
        "100": "未报名",
        "101": "商家下架",
        "102": "审核未通过",
        "103": "管理员下架",
        "200": "审核中",
        "300": "销售中"
    };
    return mapActiveState[state];
}

function getOptBtnsByState(state) {
    var btn_view = '<a class="btn btn-info btn-xs opt-view OrderDetails" href="javascript:void(0)"><i class="glyphicon glyphicon-zoom-in icon-white"></i>订单详情</a><br/><br/>';
    var btn_review_pass = '<a class="btn btn-success btn-xs opt-agree" href="javascript:;"><i class="glyphicon glyphicon-ok icon-white"></i>编辑物流单</a><br/><br/>';
    var btn_review_unpass = '<a class="btn btn-warning btn-xs opt-refuse" href="javascript:;"><i class="glyphicon glyphicon-remove icon-white"></i>取消订单</a><br/><br/>';
    var btn_offline = '<a class="btn btn-danger btn-xs opt-offline" href="javascript:;"><i class="glyphicon glyphicon-chevron-down icon-white"></i>紧急下架</a><br/><br/>';
    var str = btn_view;
    if(state) {
        if(state<200) {
            //不可售
            if(state == 102) {
                str += btn_review_pass;
            }
        } else if(state < 300) {
            //审核中
            str += btn_review_pass;
            str += btn_review_unpass;
        } else if(state < 400) {
            //销售中
            str += btn_offline;
        }
    }
    return str;
}