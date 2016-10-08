//拼接图片地址
Handlebars.registerHelper("showImage",function(imgUrl,options){
    if(imgUrl) {
        var newImage = imgUrl.replace(".", "_110x110.");
        return new Handlebars.SafeString(_imgServ + newImage);
    }
});

//组装商品详情url
Handlebars.registerHelper("showProductUrl",function(productId,options){
    var url = "/product/"+productId + "?ssid="+$("#ssid").val();
    return new Handlebars.SafeString(url);
});

//组装天翼详情页金额明细
Handlebars.registerHelper("showPriceTotal",function(closingPrice, productList, postage, options){
    var price = Number(closingPrice);
    var count = Number(productList[0].count);
    var curPrice = Number(productList[0].curPrice);
    var exchangeRate = Number(productList[0].thirdExchangeRate);
    var str;
    if(curPrice >= 1 && exchangeRate > 0) {
        str = '<div class="statistic">商品金额：'+Number((curPrice-Number(exchangeRate/100).toFixed(2))*count).toFixed(2)+'元 + ' + (100*count) + '积分 + 运费：'+postage+'元</div>'
            + '<div class="orderTotal"><p class="total"> <b>实付款(元):</b> <strong class="price">&yen;'+Number((closingPrice-exchangeRate/100*count)).toFixed(2) + '+ '+ (100*count) + '积分 </strong></p></div>';
    } else {
        str = '<div class="statistic">商品金额：'+Number(curPrice*100*count).toFixed(0)+'积分 + 运费：'+postage+'元</div>'
        + '<div class="orderTotal"><p class="total"> <b>实付款(元):</b> <strong class="price">&yen;'+postage+' +'+Number(curPrice*100*count).toFixed(0)+'积分</strong></p></div>';
    }
    return new Handlebars.SafeString(str);
});

//获取订单状态描述
Handlebars.registerHelper("showOrderStateDesc",function(orderState,options){
    var desc = "";
    if(orderState >= 10 && orderState<20) {
        desc = "待付款";
    } else if(orderState >= 30 && orderState<40) {
        desc = "待卖家发货";
    } else if(orderState >= 40 && orderState<50) {
        desc = "待确认收货";
    } else if(orderState >= 50 && orderState<60) {
        desc = "交易成功";
    } else if(orderState >= 60 && orderState<70) {
        desc = "交易关闭";
    }

    return new Handlebars.SafeString(desc);
});

//展示支付渠道
Handlebars.registerHelper("showPayChannelDesc",function(payChannel,options){
    var channelType = Number(payChannel);
    var desc = "";
    if (channelType == 1) {
        desc = "天翼支付";
    }

    return new Handlebars.SafeString(desc);
});

//获取订单列表操作按钮
Handlebars.registerHelper("showOrderOptions",function(order,options){
    var orderId = order.orderId;
    var orderState= order.orderState;
    var productId = order.productList[0].productId;

    var optionStr = '';
    if(orderState === 10) {
        optionStr += '<a href="javascript:cancelOrder('+orderId+');" class=" ordLink authLink">取消</a>&nbsp;&nbsp;';
        optionStr += '<a href="/pay/payApply?ssid='+$("#ssid").val()+'&payApply[orderId]=' + orderId +'&payApply[payChannal]=1" target="_blank" class="ordLink authLink">付款</a>&nbsp;&nbsp;';
    } else if(orderState === 30) {

    } else if(orderState === 40) {
        optionStr += '<a href="javascript:confirmReceipt('+orderId+');" class=" ordLink authLink">确认收货</a>&nbsp;&nbsp;';
    } else if(orderState === 50) {
        optionStr += '<a href="/product/render/'+productId+'?ssid='+$("#ssid").val()+'" class="ordLink authLink">再次购买</a>&nbsp;&nbsp;';
    } else if(orderState === 60) {

    }
    optionStr += '<a href="/buyer/myOrderInfo?ssid='+$("#ssid").val()+'&orderId=' + orderId + '" class="ordLink authLink">详情</a>';

    return new Handlebars.SafeString(optionStr);
});

//获取订单状态描述
Handlebars.registerHelper("orderListPages",function(orderPages,options){
    var counts = orderPages.pageCount;
    var currentpage = orderPages.curPage;

    var pagehtml='';

    //只有一页内容
    if(counts == 1){pagehtml="";}
    //大于一页内容
    if(counts > 1){
        pagehtml += '<a href="javascript:dataSearch(1);"><span>首页</span></a>';
        if(currentpage>1){
            pagehtml+= '<a href="javascript:dataSearch('+(currentpage-1)+');"><span>上页</span></a>';
        }
        for(var i=0;i<counts;i++){
            if(i>=(currentpage-3) && i<(currentpage+3)){
                if(i==currentpage-1){
                    pagehtml+= '<a class="on" href="javascript:dataSearch('+(i+1)+');"><span>'+(i+1)+'</span></a>';
                }else{
                    pagehtml+= '<a href="javascript:dataSearch('+(i+1)+');"><span>'+(i+1)+'</span></a>';
                }
            }
        }
        if(currentpage<counts){
            pagehtml+= '<a href="javascript:dataSearch('+(currentpage+1)+');"><span>下页</span></a>';
        }
        pagehtml += '<a href="javascript:dataSearch('+counts+');"><span>末页</span></a>';
    }

    return new Handlebars.SafeString(pagehtml);
});

Handlebars.registerHelper('self_product_url',function(val1) {
    return empty(val1) ? "javascript:;" : "/product/" + val1;
});
Handlebars.registerHelper('self_pic_url',function(val1) {
    return empty(val1) ? "javascript:;" : img_bath + getZoomImg(val1, "90x90");
});
Handlebars.registerHelper('self_sku_desc',function(val1) {
    return empty(val1) ? "默认规格" : val1;
});


Handlebars.registerHelper("isShowPayInfo",function(payState,options){
    if(payState == 1){
        //已支付
        return options.fn(this);
    }else{
        //未支付
        return options.inverse(this);
    }
});

Handlebars.registerHelper("isShowDeliverInfo",function(orderState,options){
    if(orderState >= 40 && orderState < 50){
        //已支付
        return options.fn(this);
    }else{
        //未支付
        return options.inverse(this);
    }
});


Handlebars.registerHelper("handlerShowExpressTrace",function(deliverInfo,options){
    if(orderState >= 40 && orderState < 50){
        //已支付
        return options.fn(this);
    }else{
        //未支付
        return options.inverse(this);
    }
});

