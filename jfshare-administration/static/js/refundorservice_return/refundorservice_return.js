/**
 * Created by Administrator on 2016/5/11.
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

        var $account=$("#account");
        var $ordersum=$("#ordersum");
        var $gainsum=$("#gainsum");
        var $integration=$("#integration");
        var $sum=$("#sum");
        var productList=null;



        var orderId=window.localStorage.getItem('orderId');
        var sellId=window.localStorage.getItem('sellId');

        /*初始化加载信息*/
        function init(){
            var html="";
            var url="http://120.24.153.102:18004/manager/order/info";
            $.ajax({
                url:url,
                type:"post",
                async:false,
                data:{"orderId":"17680034","sellerId":"2","orderState":"40"},
                dataType:"json",
                success:function(data) {   //这里需要修改
                    console.log(data);
                      productList=data.productList;
                    if(data.code==200){
                        $orderStats.html(data.orderState);
                        $orderTime.html(data.createTime);
                        $ReceivingMan.html(data.deliverInfo.receiverName);
                        $ReceivingPhone.html(data.deliverInfo.receiverMobile);
                        $Receivingaddress.html(data.deliverInfo.receiverAddress);
                        $Receivingdesc.html(data.comment);

                        $account.html(data.productList[0].count);
                        $ordersum.html(data.productList[0].postage);
                        $gainsum.html(data.productList[0].postage);
                        $sum.html(data.productList[0].count*data.productList[0].orgPrice);

                        $.each(productList,function(i,val){
                            html +="<tr>";
                            html +="<td style='text-align: center; vertical-align: middle'>"+val.productName+"</td>";
                            html +="<td style='text-align: center; vertical-align: middle'>"+val.curPrice+"</td>";
                            html +="<td style='text-align: center; vertical-align: middle'>"+val.count+"</td>";
                            html +="<td style='text-align: center; vertical-align: middle'>"+val.postage+"</td>";
                            html +="<td style='text-align: center; vertical-align: middle'>"+(val.count*val.curPrice)+"</td>";
                            html +="</tr>";
                        });

                        $dataTbody.html(html);
                    }
                }
            });

            /*加载物流信息*/
            var urlgain="http://120.24.153.102:18004/manager/order/queryexpress";
            var num=productList.deliverInfo.expressNo;     //物流单号
            var orderId=productList.orderId;               //物流单号
            var comId=productList.deliverInfo.expressId;                           //物流商
            var $logistics=$("#logistics");
            var gainHTML="";
            $.ajax({
                url:urlgain,
                type:"post",
                data:{orderId:orderId,num:num,comId:comId},
                dataType:"json",
                success:function(data){
                    console.log(data);
                   /* var List=[
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"},
                        {name:"2016-03-07 08:55:34 深圳龙岗 的 朱振球 正在派件 请保持电话畅通"}
                        ];*/
                    $.each(List,function(i,val){
                        gainHTML+="<li>"+val.name+"</li>"
                    });

                    $logistics.html(gainHTML);
                }
            })
        }

        init();

    });
