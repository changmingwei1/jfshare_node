/**
 * Created by Administrator on 2016/5/8.
 */
$(function(){
    var $orderStats=$("#orderStats"); //订单状态;
    var $orderInfo=$("#orderInfo");   //订单信息
    var $orderTime=$("#orderTime");   //订单时间
    var $ReceivingMan=$("#ReceivingMan"); //收货人
    var $ReceivingPhone=$("#ReceivingPhone");//收货人手机
    var $Receivingaddress=$("#Receivingaddress"); //收货地址
    var $Receivingdesc=$("#Receivingdesc");     //备注

    var $dataTbody=$("#dataTbody");  //获取table

    var $account=$("#account");  //商品数量总
    var $ordersum=$("#ordersum"); //运费总金额
    var $gainsum=$("#gainsum");    //总运费
    var $integration=$("#integration"); //商品积分
    var $sum=$("#sum");               //订单金额
    var productList=null;
    var deliverInfo=null;             //物流全局
    var domain="http://proxy.jfshare.com"       //域名

    var userId;
    var productId;
    var skuNum;
    var orderId=window.localStorage.getItem('orderId');
    var sellId=window.localStorage.getItem('sellId');
    var orderState=window.localStorage.getItem('orderState');
    var magId=window.localStorage.getItem("managerId")

    /*初始化加载信息*/
    function init(){
        var html="";
        var url=domain+"/manager/order/info";
        $.ajax({
            url:url,
            type:"post",
            async: false,
            //data:{"orderId":orderId,"sellerId":sellId,"orderState":orderState},
            data:{"orderId":orderId,"sellerId":sellId},
            dataType:"json",
            success:function(data) {   //这里需要修改
                var hbsTemplate = "";
                 productList=data.productList;
                 deliverInfo=data.deliverInfo;
                 if(data.code==200){
                     if(data.type == 3){
                         /**
                          * //虚拟待支付
                          */
                         if(data.orderState>=50 && data.orderState <60){
                             /**
                              * 已完成
                              */
                             hbsTemplate = Handlebars.compile($("#VirualComplete-view-template").html());
                             $.ajax({
                                 url:domain+'/manager/order/carList',
                                 type:"post",
                                 dataType:'json',
                                 data:{
                                     productId:data.productList[0].productId,
                                     orderId:data.orderId
                                 }
                             }).done(function(data1){
                                 if(data1.code == 200){
                                     data.cardList = data1.cardList;
                                     $('#orderDetailPaid').html(hbsTemplate(data));
                                 }else{
                                     data.cardList = [];
                                     $('#orderDetailPaid').html(hbsTemplate(data));
                                 }

                             }).fail(function(error){
                                 console.log(error)
                             })

                         }else{
                             /**
                              * 已关闭或者待支付
                              */
                                 //如果商品是虚拟商品,请求券码信息
                             hbsTemplate = Handlebars.compile($("#VirualPaid-view-template").html());
                             $('#orderDetailPaid').html(hbsTemplate(data));

                         }
                     }else{
                         if(data.orderState<30){
                             /**
                              * 实物待支付
                              */
                             hbsTemplate = Handlebars.compile($("#goodPaid-view-template").html());
                             $('#orderDetailPaid').html(hbsTemplate(data));
                         }else if(data.orderState>=30 && data.orderState<40){
                             /**
                              * 实物待发货
                              */
                             hbsTemplate = Handlebars.compile($("#goodSends-view-template").html());
                             $('#orderDetailPaid').html(hbsTemplate(data));


                         }else if(data.orderState>=40 && data.orderState<=61){
                             /**
                              * 实物已完成
                              */
                             if(data.orderState ==60 || data.orderState ==61 ){
                                 /**
                                  * 实物已关闭
                                  */
                                 if(data.orderState ==60){
                                     hbsTemplate = Handlebars.compile($("#goodPaidhidePay-view-template").html());
                                 }else{
                                     if(data.payState == 0 || data.payState == 2){
                                         hbsTemplate = Handlebars.compile($("#goodPaidhidePayWithInfoNopay-view-template").html());
                                     }else {
                                         hbsTemplate = Handlebars.compile($("#goodPaidhidePayWithInfo-view-template").html());
                                     }

                                 }

                                 $('#orderDetailPaid').html(hbsTemplate(data));
                                 $(".orderIsClosed").hide();
                                 var afterSaleList = data.afterSaleList;
                                 if(afterSaleList){
                                     $.each(afterSaleList,function(i,vel){
                                         if(vel.orderId==orderId){
                                             $orderStats.html("退款/售后");
                                         }
                                     });
                                 }
                                 var totalcount=0;
                                 var totalprice=0;

                                 $.each(data.productList,function(i,val){
                                     html +="<tr>";
                                     html +="<td style='text-align: center; vertical-align: middle'>"+val.productName+"</td>";
                                     html +="<td style='text-align: center; vertical-align: middle'>"+val.sku.skuName+"</td>";
                                     html +="<td style='text-align: center; vertical-align: middle'>"+val.curPrice+"</td>";
                                     html +="<td style='text-align: center; vertical-align: middle'>"+val.count+"</td>";
                                     //html +="<td style='text-align: center; vertical-align: middle'>"+val.postage+"</td>";
                                     html +="<td style='text-align: center; vertical-align: middle'>"+(val.count*val.curPrice)+"</td>";
                                     var notafter=true;
                                     if(afterSaleList){
                                         $.each(afterSaleList,function(i,vel){
                                             if(vel.productId==val.productId && vel.skuNum == val.sku.skuNum){
                                                 if(vel.state ==1){
                                                     html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货审核中</a></p></td>";
                                                 }else  if(vel.state ==3){
                                                     html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货失败</a></p></td>";
                                                 }else  if(vel.state ==2){
                                                     html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货成功</a></p></td>";
                                                 }
                                                 notafter=false;
                                             }
                                         });
                                     }
                                     if(notafter){
                                         html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderNormal'>无</a></p></td>";
                                     }
                                     html +="</tr>";
                                     totalprice = totalprice+val.curPrice*val.count;
                                     totalcount=totalcount+val.count;
                                 });
                                 $account.html(totalcount);
                                 $ordersum.html(totalprice);
                                 $integration.html(Math.floor(data.closingPrice*100));
                                 $gainsum.html(data.postage);
                                 $sum.html(data.closingPrice);
                                 $dataTbody.html(html);
                                 return false;

                             }
                             hbsTemplate = Handlebars.compile($("#goodComplete-view-template").html());
                             var num=deliverInfo.expressNo;     //物流单号
                             var comId=deliverInfo.expressId;
                             $.ajax({
                                 url:domain+"/manager/order/queryexpress",
                                 type:'post',
                                 dataType:'json',
                                 timeout:'5000',
                                 data:{orderId:data.orderId,num:num,comId:comId}
                             }).done(function(data1){
                                 console.log(data1);
                                 if(data1.code == 200){
                                     if(data1.traceItems.length == 0){
                                         data.freightInfoFlag = false;
                                     }else{
                                         data.freightInfoFlag = true;
                                         data.freightInfo = data1.traceItems;
                                     }
                                     $('#orderDetailPaid').html(hbsTemplate(data));
                                 }else{
                                     data.freightInfo = [];
                                     data.freightInfoFlag = false;
                                     $('#orderDetailPaid').html(hbsTemplate(data));
                                 }

                             }).fail(function(error){
                                 console.log(error)

                             });


                         }else{}

                     }

                     var afterSaleList = data.afterSaleList;
                     if(afterSaleList){
                         $.each(afterSaleList,function(i,vel){
                             if(vel.orderId==orderId){
                                 $orderStats.html("退款/售后");
                             }
                         });
                     }
                     var totalcount=0;
                     var totalprice=0;
                     $.each(data.productList,function(i,val){
                         html +="<tr>";
                         html +="<td style='text-align: center; vertical-align: middle'>"+val.productName+"</td>";
                         html +="<td style='text-align: center; vertical-align: middle'>"+val.sku.skuName+"</td>";
                         html +="<td style='text-align: center; vertical-align: middle'>"+val.curPrice+"</td>";
                         html +="<td style='text-align: center; vertical-align: middle'>"+val.count+"</td>";
                         //html +="<td style='text-align: center; vertical-align: middle'>"+val.postage+"</td>";
                         html +="<td style='text-align: center; vertical-align: middle'>"+(val.count*val.curPrice)+"</td>";
                         //html +="<td style='text-align: center; vertical-align: middle'>"+data.postage+"</td>";
                         var notafter=true;
                         if(afterSaleList){
                             $.each(afterSaleList,function(i,vel){
                                 if(vel.productId==val.productId && vel.skuNum == val.sku.skuNum){
                                     if(vel.state ==1){
                                         html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货审核中</a></p></td>";
                                     }else  if(vel.state ==3){
                                         html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货失败</a></p></td>";
                                     }else  if(vel.state ==2){
                                         html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderAfter' productId="+vel.productId+" skuNum="+vel.skuNum+">退货成功</a></p></td>";
                                     }
                                     notafter=false;
                                 }
                             });
                         }
                         if(notafter){
                             html += "<td style='text-align: center; vertical-align: middle'><p><a href='javascript:void(0)' class='OrderNormal'>无</a></p></td>";
                         }
                         html +="</tr>";
                         totalprice = totalprice+val.curPrice*val.count;
                         totalcount=totalcount+val.count;
                     });
                     $account.html(totalcount);
                     $ordersum.html(totalprice);
                     $integration.html(Math.floor(data.closingPrice*100));
                     $gainsum.html(data.postage);
                     $sum.html(data.closingPrice);
                     $dataTbody.html(html);
                 }
            }
        });

    }

    /*用户点击售后详情后*/
    $dataTbody.on("click", "a.OrderAfter", function () {
        var index = $(this).parents("tr").index();
        productId=$(this).attr("productId");
        skuNum=$(this).attr("skuNum");
        console.log(orderId);
        var urlgain=domain+"/manager/afterSale/toReview";
        $.ajax({
            url:urlgain,
            type:"post",
            data:{orderId:orderId,productId:productId,skuNum:skuNum},
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    userId=data.message.userId;
                    if(data.message.state>1){
                        $(".isFail").hide();
                        $(".isSucess").show();
                        $("#applytime").text(data.message.approveTime);
                        $("#approveComment").text(data.message.approveComment);



                    }else{
                        $(".isFail").show();
                        $(".isSucess").hide();
                        $("#aftercomment").text(data.message.userComment);

                    }
                    $("#aftertime").text(data.message.applyTime);
                    $("#afterreason").text(data.message.reason);


                    //var List=data.traceItems;
                    //$.each(List,function(i,val){
                    //    gainHTML+="<li>"+val.time+"</li>"
                    //    gainHTML+="<li>"+val.context+"</li>"
                    //});
                }
                else{

                }
            }
        })
        $("#aftergoodsModal").modal("show");
    });

    $("#corfirmorafter").on("click", function () {
        var url = domain+"/manager/afterSale/review";
       var approveComment= $("#aftermanagercomment").val();
        //return false;
        $.ajax({
            url: url,
            type: "post",
            data: {productId:productId,orderId:orderId,userId:userId,sellerId:sellId,skuNum:skuNum,reviewResult:0,approveComment:approveComment},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    alert("操作成功");
                    window.location.reload();
                } else {
                    alert(data.desc);
                }

            }
        })
        $("#aftergoodsModal").modal("hide");
    });

    $("#Toreturn").on("click", function () {
        var url = domain+"/manager/afterSale/review";
        var approveComment= $("#aftermanagercomment").val();

        $.ajax({
            url: url,
            type: "post",
            data: {productId:productId,orderId:orderId,userId:userId,sellerId:sellId,skuNum:skuNum,reviewResult:1,approveComment:approveComment},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    alert("操作成功");
                    window.location.reload();
                } else {
                    alert(data.desc);
                }

            }
        })
        $("#aftergoodsModal").modal("hide");

    });

    init();

});
