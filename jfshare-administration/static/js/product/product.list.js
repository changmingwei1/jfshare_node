/**
 * Created by L on 2015/10/25 0025.
 */

$("#productTab").children("li").on("click", function(){
    var state = $(this).attr("state");
    $("input[name='productStatus']").val(state);
    dataSearch(1);
});


//请求数据
function dataSearch(currentPage){
    //注册一个Handlebars模版，通过id找到某一个模版，获取模版的html框架
    var myTemplate = Handlebars.compile($("#review-table-template").html());

    var param = {};
    param.currentPage = currentPage;
    param.productName = $("#productName").val();
    param.productId = $("#productId").val();
    param.productStatus = $("#productStatus").val();

    console.log(param);
    var spinner = new Spinner(opts);

    $.ajax({
        type: "post",
        url: "/product/list/",
        async: true, // 使用异步方式
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        data: JSON.stringify(param),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend:function() {
            $('#dataTbody').html("<tr><td height='200px' colspan='6' class='text-center'>数据加载中</td></tr>");
            var target = $('#dataTbody tr td').get(0);
            spinner.spin(target);
        },
        complete:function(data) {
            $('.datagrid-mask-msg').remove();
            $('.datagrid-mask').remove();
            spinner.spin();
        },
        success: function(rdata) {
            if(rdata && rdata.result.code==0){
                if(rdata.productSurveyList.length == 0) {
                    $('#dataTbody').html("<tr><td height='200px' colspan='6' class='text-center'>无查询数据</td></tr>");
                  return;
                }
                console.log(rdata);
                $('#dataTbody').html(myTemplate(rdata));
                showExtData();
                doPagination(rdata.pagination);

                //初始化操作按钮事件
                initOptBtnsEvent();

                //初始化日志记录弹窗
                //$(".allOptRecords").popover();
            }else{
                alert("查询信息失败！");
            }
        },
        error: function(){
            //请求出错处理
            alert("系统异常");
        }
    });
}

function showExtData() {
    var $trs = $("#dataTbody").children("tr");
    $.each($trs, function(i, tr){
        //渲染类目
        var subjectId = $(tr).children("td:nth-child(2)").attr("subjectId");
        getSubjectInfo(subjectId, $(tr).children("td:nth-child(2)"));

        //渲染卖家信息
        var sellerId = $(tr).children("td:nth-child(3)").attr("sellerId");
        getSellerInfo(sellerId, $(tr).children("td:nth-child(3)"));

        //渲染商品操作日志
        var productId = $(tr).attr("productId");
        getOptRecord(productId, function(records){
            if(records && records.length > 0) {
                var recordStr = "";
                $.each(records, function(i, productOpt){
                    var rowStr = "[" + productOpt["createTime"] + "]&nbsp;&nbsp;" + productOpt["desc"];

                    if(i == records.length-1) {
                        $(tr).children("td:nth-child(5)").children("div").html(rowStr);
                    }

                    recordStr += rowStr + "<br>";
                });
                console.log(recordStr)
                $(tr).children("td:nth-child(5)").children("a").popover({html:"html", trigger:"hover", title: '商品操作日志', content: recordStr});
            }
        });
    });
}

//制作分页标签
function doPagination(paginationData){
    if($("#pagination")){
        //总记录数
        var totalCount = paginationData.totalCount;
        //每页数量
        var pagesize = paginationData.numPerPage;
        //当前页码
        var currentpage = paginationData.currentPage;

        $("#totalCount").html(totalCount);

        var counts,pagehtml="";
        if(totalCount%pagesize==0){
            counts = parseInt(totalCount/pagesize);
        }else{
            counts = parseInt(totalCount/pagesize)+1;
        }
        //只有一页内容
        if(totalCount<=pagesize){pagehtml="";}
        //大于一页内容
        if(totalCount>pagesize){
            if(currentpage>1){
                pagehtml+= '<li><a href="javascript:dataSearch('+(currentpage-1)+');">上一页</a></li>';
            }
            for(var i=0;i<counts;i++){
                if(i>=(currentpage-3) && i<(currentpage+3)){
                    if(i==currentpage-1){
                        pagehtml+= '<li class="active"><a href="javascript:dataSearch('+(i+1)+');">'+(i+1)+'</a></li>';
                    }else{
                        pagehtml+= '<li><a href="javascript:dataSearch('+(i+1)+');">'+(i+1)+'</a></li>';
                    }

                }
            }
            if(currentpage<counts){
                pagehtml+= '<li><a href="javascript:dataSearch('+(currentpage+1)+');">下一页</a></li>';
            }
        }
        $("#pagination").html(pagehtml);

    }
}

/**
 * 查询商品操作日志
 * @param productId
 * @param calback
 */
function getOptRecord(productId, calback) {
    var param = {productId:productId}
    $.ajax({
        type: "post",
        url: "/manager/queryProductOptRecords",
        async: true, // 使用异步方式
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        data: JSON.stringify(param),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(rdata) {
            if(rdata && rdata.code==0){
                calback(rdata["productOptRecords"])
            }else{
                console.log(rdata);
            }
        }
    });
}

/**
 * 查询类目信息
 */
function getSubjectInfo(subjectId, td){
    $.ajax({
        type: "get",
        url: "/subject/getSuperTree/"+subjectId,
        async: true, // 使用同步方式
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        //data: JSON.stringify(param),
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function(rdata) {
            if(rdata && rdata.result.code==0){
                var subjectPath = "";

                $.each(rdata.subjectNodes,function(i, subjectNode){
                    subjectPath += subjectNode.name + " /";
                });

                subjectPath = subjectPath.substring(0, subjectPath.length-1);

                td.html(subjectPath);
            }else{
                console.log("获取商品类目信息失败！");
            }
        }
    });
}

/**
 * 查询商家信息
 */
function getSellerInfo(sellerId, td){
    $.ajax({
        type: "get",
        url: "/seller/getSellerInfo?sellerId=" + sellerId,
        async: true, // 使用同步方式
        // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
        // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
        //data: JSON.stringify(param),
        //contentType: "application/json; charset=utf-8",
        //dataType: "json",
        success: function(rdata) {
            if(rdata.result){
                td.html("商家ID:"+rdata.seller.sellerId+"</br>"+rdata.seller.sellerName);
            }else{
                td.html("");
            }
        }
    });
}

//绑定操作按钮事件
function  initOptBtnsEvent(){

    $(".opt-view").on("click", function(){
        var productDetailServerPath = 'http://120.24.153.102:13003/product/';
        var productId = $(this).parent("td").parent("tr").attr("productId");
        var el = document.createElement("a");
        document.body.appendChild(el);
        el.href = productDetailServerPath + productId;
        el.target = '_bank'; //指定在新窗口打开
        el.click();
        document.body.removeChild(el);
    });

    $(".opt-agree").on("click", function(){
        var newState = 300;
        var $tr = $(this).parent("td").parent("tr");
        var productId = $tr.attr("productId");
        var curState = $tr.attr("state");
        modifyProductState(productId, curState, newState);
    });

    $(".opt-refuse").on("click", function(e){
        e.preventDefault();
        var $tr = $(this).parent("td").parent("tr");
        var productId = $tr.attr("productId");
        $("#refuseProductId").val(productId);

        $('#reviewModal').modal('show');
    });

    $(".opt-offline").on("click", function(){
        var newState = 103;
        var $tr = $(this).parent("td").parent("tr");
        var productId = $tr.attr("productId");
        var curState = $tr.attr("state");
        modifyProductState(productId, curState, newState);
    });
}

$("#unpassSubmit").on("click", function(){
    $('#reviewModal').modal('hide');
    var newState = 102;
    var productId = $("#refuseProductId").val();
    var curState = $("#dataTbody").children("tr[productId='"+productId+"']").attr("state");
    var refuseReason = $("#refuseReason").val();
    modifyProductState(productId, curState, newState, refuseReason);
});

function modifyProductState(productId, curState, newState, reason) {
    console.log(productId+", "+ curState+", "+newState+"," +reason);
    var spinner = new Spinner(opts_center);

    if(productId && curState && newState) {
        var param = {}
        param["productId"] = productId;
        param["curState"] = curState;
        param["newState"] = newState;
        param["reason"] = reason;
        param["operatorId"] = "manager001";
        $.ajax({
            type: "post",
            url: "/product/setProductState/",
            async: true, // 使用异步方式
            // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
            // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
            data: JSON.stringify(param),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend:function() {
                var target = $("#spin_show").get(0);
                spinner.spin(target);
            },
            success: function(data) {
                setTimeout(function(){
                    spinner.spin();
                    if(data && data.code==0) {
                        var curPage = $("#pagination").children("li.active").children("a").text();
                        dataSearch(curPage);
                    } else {
                        alert("下架操作失败，请重试！");
                    }
                },2000);
            },
            error: function(){
                spinner.spin();
                //请求出错处理
                alert("操作失败");
            }
        });
    } else {
        alert("提交的参数不完整!");
    }
}