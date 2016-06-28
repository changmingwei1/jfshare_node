var addressEditor;
var deliveryRuleSelector;
var paymentSelector;
var depositAndPointsEditor;
var storedCardEditor;
var couponSelector;
var isCheckPhone = false;

$(function () {
    //addressEditor = new $.AddressEditor(window.addresses, $("#consigneePanel"), "show", "#consignee_edit_template", "#consignee_show_template", "#addressListTemplate", saveUrl, deleteUrl);
    //addressEditor.show();
    //addressEditor.addAddressChangeListener(function (addr) {
    //    $.post("/shopping/handle/v3/getCart.jsp", {regionId:addr.regionId, m:merchantId,mode:'of',t:oc.cartType,objectId:window.objectId}, function (data) {
    //        if (data.state === 'ok') {
    //            oc = data.oc;
    //            if(!oc.notDelivery){
    //                deliveryRuleSelector.setOc(oc);
    //                deliveryRuleSelector.setRegionIds(addr.regionIds);
    //                deliveryRuleSelector.mode = "edit";
    //                deliveryRuleSelector.show();
    //            }
    //        }
    //    }, "json");
    //});



//    if(!oc.notDelivery){
//        deliveryRuleSelector = new $.DeliveryRuleSelector(oc, "show", $("#deliveryPanel"),"delivery_edit_template","delivery_show_template", '/shopping/handle/v3/selectDeliveryRule.jsp?objectId='+window.objectId, merchantId);
//        if(addressEditor.addr){
//            deliveryRuleSelector.setRegionIds(addressEditor.addr.regionIds);
//        }
//        if(isAutoSelectDeliveryMode == "true"){
//            deliveryRuleSelector.show();
//        }else{
//            deliveryRuleSelector.mode = "edit";
//            deliveryRuleSelector.show();
//        }
//
//
//        deliveryRuleSelector.deliveryRuleChangeListener(function(selectedDeliveryRuleResult){
//            if(selectedDeliveryRuleResult != null){
//                var enableCOD = selectedDeliveryRuleResult.enableCOD;
//                paymentSelector.setEnableCOD(enableCOD);
//                if(!enableCOD){
//                    for(var i=0;i<window.payments.length;i++){
//                        var payment = window.payments[i];
//                        if(payment.id == paymentSelector.selectedPaymentId){
//                            if(payment.payInterfaceId == "payi_0" || payment.payInterfaceId == "payi_17" || payment.payInterfaceId == "payi_20" || payment.payInterfaceId == "payi_21" || payment.payInterfaceId == "payi_101"){
//                                paymentSelector.mode = "edit";
//                                paymentSelector.edit();
//                            }else{
//                                if(paymentSelector.mode == "edit"){
//                                    paymentSelector.edit();
//                                }
//                            }
//                        }
//                    }
//                }else{
//                    if(paymentSelector.mode == "edit"){
//                        paymentSelector.edit();
//                    }
//                }
//            }
//        });
//    }
//
//    paymentSelector = new $.PaymentSelector($("#paymentPanel"), $("#payment_edit_template"), $("#payment_show_template"), window.payments, window.selectedPaymentId, '/shopping/handle/v3/selectPayment.jsp',merchantId);
//    if(oc.selectedDeliveryRuleResult){
//        paymentSelector.setEnableCOD(oc.selectedDeliveryRuleResult.enableCOD && oc.enableCOD);
//    }
//    paymentSelector.show();
//    depositAndPointsEditor = new $.DepositAndPointEditor($("#depositAndPointPanel"), $("#deposit_and_points_show_template"), $("#deposit_and_points_edit_template"), '/shopping/handle/v3/setUseDepositAndPoints.jsp?objectId='+window.objectId, window.oc, merchantId, cartType);
//    depositAndPointsEditor.edit();
//
//    storedCardEditor = new $.StoredCardEditor($("#storedCardPanel"), $("#storedCard_show_template"), $("#storedCard_edit_template"), '/shopping/handle/v3/setUseStoredCard.jsp?objectId='+window.objectId, '/shopping/handle/v3/updateUseStoredCard.jsp?objectId='+window.objectId, window.oc, merchantId, cartType);
//    storedCardEditor.setLimitUseAmt(limitUseAmt);
//    storedCardEditor.setCardTypeName(cardTypeName);
//    storedCardEditor.edit();
//
//
//    $("#barcodePay").html($("#barcodePayShow").render({payments:payments}));
//
//    $("#cartBodyPanel").html($("#cart_body_template").render(oc));
//    if(oc.autoUseCard){
//        $("#couponPanel").html($("#use_cards_template").render(oc));
//    }else{
//        couponSelector = new $.CouponSelector($("#couponPanel"), null, $("#coupon_edit_template"), '/shopping/handle/v3/setUseCoupon.jsp?objectId='+window.objectId, window.oc, merchantId, cartType);
//        couponSelector.edit();
//    }
//    $("#bottomPanel").html($("#order_bottom_template").render(oc));
//
//    $(".showInvoice").live("click", function () {
//        $("#invoiceLayer").show();
//        $("#invoiceTitle").focus();
//    });
//    $(".closeInvoice").live("click", function () {
//        $("#invoiceLayer").hide();
//    });
//    $("#barcodePay .btnSave .save").live("click", function () {
//        var addItionnumber = $("#addItionnumber").val();
//        var paymentId = $("#addItionnumber").attr("paymentId");
//        if (addItionnumber == "" || addItionnumber == null) {
//            alert("请输入条形码");
//            return;
//        } else {
//            $.post("handle/v3/queryAddItionnumber.jsp", {addItionnumber: addItionnumber, paymentId: paymentId,merchantId:merchantId,cartType:cartType,mode:'of'}, function (data) {
//                if (data.state == "ok") {
//                    $("#barcodePayPrice").html(parseFloat(data.activityAmountPaid));
//                    if (window.onOcChange) {
//                        window.onOcChange(data.oc);
//                    }
//                } else {
//                    $("#barcodePayPrice").html("0.00");
//                    alert(data.msg);
//                }
//            }, "json");
//        }
//    });
//    $("input[name='invoiceType']").live("change",function(){
//        if(this.value == "个人"){
//            if(window.oc.invoiceInfo && window.oc.invoiceInfo.invoiceTitleType == "单位"){
//                $("#invoiceUserName").val("");
//                $("#invoicePhone").val("");
//            }
//            $("#invoiceTitleDetail").hide();
//            $("#invoicePersonal").show();
//            $("#invoiceUserName").focus();
//        }else{
//            if(window.oc.invoiceInfo && window.oc.invoiceInfo.invoiceTitleType == "个人"){
//                $("#invoiceTitle").val("");
//                $("#invoiceCertificate").val("");
//            }
//            $("#invoicePersonal").hide();
//            $("#invoiceTitleDetail").show();
//            $("#invoiceTitle").focus();
//        }
//    });
//
//    $("#saveInvoice").live("click", function () {
//        var currObj = $(this);
//        var invoiceTitle = "";
//        var invoiceUserName = "";
//        var invoicePhone = "";
//        var invoiceCertificate = "";
//        var titleObj = $("input[name='invoiceType']:checked");
//        var address = $("#invoiceTitle");
//        if (titleObj.val() == "单位") {
//            if (address.val() == "") {
//                alert("请填写发票单位名称！");
//                address.focus();
//                return false;
//            }
//            invoiceTitle = address.val();
//            invoiceCertificate = $("#invoiceCertificate").val() || "";
//        }else if(titleObj.val() == "个人"){
//            invoiceTitle = addressEditor.addr.userName;
//            invoiceUserName=$("#invoiceUserName").val();
//            if(!invoiceUserName){
//                alert("请填写姓名！");
//                return false;
//            }
//            invoicePhone = $("#invoicePhone").val() || "";
//        }else{
//            alert("请选择发票抬头！");
//            return false;
//        }
//
//        var params = {"needInvoiceKey":"yes", "title":invoiceTitle, "invoiceCertificate":invoiceCertificate,
//            "content":"", "titleType":titleObj.val(),"invoiceUserName":invoiceUserName,"invoicePhone":invoicePhone,
//            "merchantId":currObj.attr("merchantId"), "cartType":currObj.attr("cartType"),"mode":'of'};
//        $.post("handle/v3/saveInvoice.jsp", params, function (data) {
//            if (data.state == "ok") {
//                $("#invoiceLayer").hide();
//                $(".showInvoice").html("修改发票");
//                var html = "";
//                if(titleObj.val() == "个人"){
//                    html = "(您选择的发票抬头为：" + titleObj.val() + ")";
//                }else{
//                    html = "(您选择的发票抬头为：" + titleObj.val() + "“" + invoiceTitle + "”)";
//                }
//                $("#invoice_selected").html(html);
//            } else {
//                alert("保存发票信息异常！");
//            }
//        }, "json");
//    });
//
//    $("#saveNoInvoice").live("click", function () {
//        var currObj = $(this);
//        var params = {"merchantId":currObj.attr("merchantId"), "cartType":currObj.attr("cartType")};
//        $.post("handle/v3/saveInvoice.jsp", params, function (data) {
//            if (data.state == "ok") {
//                $("input[name='invoiceType']").get(0).checked = true;
//                $(".showInvoice").html("索要发票");
//                $("#invoice_selected").html("");
//                $("#invoiceTitleDetail").hide();
//                $("#invoiceLayer").hide();
//            } else {
//                alert("保存发票信息异常！");
//            }
//        }, "json");
//    });
//
//    var discriptionVal = "备注中有关收货人信息、支付方式、配送方式、发票信息等购买要求一律以上面的选择为准，备注无效。";
//    $("#description").live({
//        focus:function(){
//            if(this.value == discriptionVal){
//                $(this).val("");
//            }
//        },
//        blur:function(){
//            if(this.value == ""){
//                this.value = discriptionVal;
//            }
//        }
//    });
//
//    $("#btnSubmit").live("click", function () {
//        if(window.oc.orderType == "common" ){
//            if($(".item_check:checked").length == 0){
//                alert("请至少选中一个商品！");
//                return false;
//            }else{
//                var buyItems = window.oc.buyItems;
//                var hasChecked = false;
//                for(var j=0; j<buyItems.length;j++){
//                    var item = buyItems[j];
//                    if(item.checked){
//                        hasChecked = true;
//                        break;
//                    }
//                }
//                if(!hasChecked){
//                    alert("请至少选中一个商品！");
//                    return false;
//                }
//            }
//        }
//
//        var saveDate = {"mode":'of','orderType':window.oc.orderType};
//        if (addressEditor.mode == "edit") {
//            var address_result = addressEditor.checkSelect();
//            $(document).scrollTop($(".order_title",addressEditor.elem).offset().top);
//            if(address_result){
//                alert("请保存收货人信息。");
//            }
//            return false;
////            saveDate["addr"] = JSON.stringify(address_result.cloneAddr);
////            saveDate["toSaveAddr"] = "1";
//        }
//        if ((!window.oc.notDelivery) && (deliveryRuleSelector.mode == "edit" || oc.selectedDeliveryRuleResult == null)) {
//            var delivery_result = deliveryRuleSelector.checkSelect();
//            $(document).scrollTop($(".order_title",deliveryRuleSelector.elem).offset().top);
//            if(delivery_result){
//                alert("请保存配送方式。");
//            }
//            return false;
//           /* saveDate["selectedDeliveryTime"]=delivery_result.selectedDeliveryTime;
//            saveDate["selectedRuleId"]=delivery_result.selectedRuleId;
//            saveDate["selectedDeliveryPointId"]=delivery_result.selectedDeliveryPointId;
//            saveDate["selectedDeliveryPointRegionId"]=delivery_result.selectedDeliveryPointRegionId;
//            saveDate["regionId"] = delivery_result.regionId;
//            saveDate["m"]=merchantId;
//            saveDate["toSaveDelivery"] = "1";*/
//        }
//        if (paymentSelector.mode == "edit") {
//            var payment_result = paymentSelector.checkSelect();
//            $(document).scrollTop($(".order_title",paymentSelector.elem).offset().top);
//            if(payment_result){
//                alert("请保存支付方式。");
//            }
//            return false;
//           /* saveDate["selectedPaymentId"] = payment_result.selectedPaymentId;
//            saveDate["toSavePayment"] = "1";*/
//        }
//
//        var $Contract = $("#theContract");
//        if ($Contract.length > 0 && !$Contract.is(':checked')) {
//            alert("请阅读并同意合同条约");
//            return false;
//        }
//
//        if (!(oc.selectedDeliveryRuleResult.enableCOD && oc.enableCOD)) {
//            var selectedPayment=null;
//            for (var i = 0; i < window.payments.length; i++) {
//                var payment = window.payments[i];
//                if (payment.id === paymentSelector.selectedPaymentId) {
//                    selectedPayment = payment;
//                    break;
//                }
//            }
//            if(selectedPayment ==null){
//                paymentSelector.mode = "edit";
//                paymentSelector.edit();
//                $(document).scrollTop($(".order_title",paymentSelector.elem).offset().top);
//                return false;
//            }
//            if(selectedPayment.payInterfaceId == "payi_0"|| selectedPayment.payInterfaceId == "payi_17" || selectedPayment.payInterfaceId == "payi_20" || selectedPayment.payInterfaceId == "payi_21" || selectedPayment.payInterfaceId == "payi_101"){
//                paymentSelector.mode = "edit";
//                paymentSelector.edit();
//                $(document).scrollTop($(".order_title",paymentSelector.elem).offset().top);
//                return false;
//            }
//        }
//
//        var count = 0;
//        for ( var  key  in  saveDate){
//            count++;
//        }
//
//        if(count > 2){
//            var canContinue = false;
//            $(this).html("正在提交...");
//            $.ajax({
//                url:"/shopping/handle/v3/order_before_create_handler.jsp",
//                data:saveDate,
//                async:false,
//                cache:false,
//                dataType:"json",
//                type:"post",
//                success:function(data){
//                    if((data.addressOut == "" || data.addressOut.state == "ok") && (data.paymentOut == "" || data.paymentOut.state == "ok") && (data.deliveryOut == "" || data.deliveryOut.state == "ok")){
//                        canContinue = true;
//                    }
//                }
//            });
//            if(!canContinue){
//                alert("提交订单异常！");
//                $(this).html("提交订单");
//                return false;
//            }
//        }
//
//        if(isCheckMobileSubmitOrder){
//            if(!isCheckPhone){
//                var selectedPayInterfaceId = $("#selectedPayInterfaceId").val() ;
//                if(selectedPayInterfaceId == "payi_0"){
//                    params = new Object();
//                    if($("#favoriteLoginLayer").html()==null || $("#favoriteLoginLayer").html()==""){
//                        jQuery("#favoriteLoginLayer").load("/login/checkPhonebox.jsp?m="+merchantId+"&height=280", params, function() {
//                            document.getElementById("favoriteLoginLayer").style.left = "13%";
//                            document.getElementById("favoriteLoginLayer").style.display = "block";
//                        });
//                    }else{
//                        $("#valiCode").val("");
//                        $("#favoriteLoginLayer").show();
//                    }
//
//                    return false;
//                }
//            }
//        }
//
//        //检查储值卡
//        var that = this;
//        var payInterfaceId = "";
//        if (paymentSelector.mode == "edit") {
//            var checkedObj = $("input:radio:checked",this.elem);
//            payInterfaceId = checkedObj.attr("if");
//        }else{
//            payInterfaceId = $("#selectedPayInterfaceId").val();
//        }
//        if(payInterfaceId == "payi_101"){
//            tb_show(null,"/shopping/order_confirm_layer.jsp?height=500&width=500&modal=true",null);
//            var elem = $("#confirmLyaer");
//            $("#moreSvCard").live("click",function(){
//                //var currObj = $(this);
//                var ulObj = $("#cardBox");
//                var cloneObj = ulObj.children(":first").clone(true);
//                cloneObj.find("input").val("").after('&nbsp;&nbsp;<a href="javascript:;" class="deleteCard" style="color:#0066CC;">删除</a>');
//                cloneObj.children(":last").html("");
//                ulObj.append(cloneObj);
//            });
//            $("#closeConfirmLayer").live("click",function(){
//                $("#moreSvCard").die();
//                $(".deleteCard").die();
//                $("#checkCard").die();
//                tb_remove();
//                $("#orderFormSubmit").children("input[name='cardNos']").remove();
//            });
//            $(".deleteCard").live("click",function(){
//                $(this).parent().parent().remove();
//            });
//
//            $("#checkCard").live("click",function(){
//                var cardNos = "";
//                var isOk=false;
//                var allInputCardNo = $("input[name='svCardNo']");
//                allInputCardNo.each(function(){
//                    if(this.value != ""){
//                        if(this.value.length>11){
//                             isOk=true;
//                        }else{
//                        cardNos += this.value + ",";
//                        }
//                    }
//                });
//                if(isOk){
//                    alert("您输入储值卡号长度不能超过11位数！")
//                    return false;
//                }
//                if(cardNos == ""){
//                    alert("请输入要使用的储值卡号！")
//                    return false;
//                }
//                $("#orderFormSubmit").append("<input type='hidden' name='cardNos' value='"+cardNos+"' />");
//                $("#checkCard").hide();
//                var html = '<a href="javascript:;" id="saveConfirm" class="btn_01">确认提交</a>';
//                $(".btns",$("#confirmLyaer")).append(html);
//                $("#saveConfirm").click(function(){
//                    submitOrder(that);
//                });
//                  //注释下方的，现在商城不验证储值卡了，直接传过去，昂捷验证
//               /* $.post("/shopping/handle/v3/check_value_card_handler.jsp",{merchantId:oc.merchantId,cardNos:cardNos},function(data){
//                    if(data.state){
//                        var finalNeedPayAmount = parseFloat(window.oc.finalNeedPayAmount);
//                        var cardNoSpilt = cardNos.split(",");
//                        for(var i=0;i<cardNoSpilt.length;i++){
//                            var cardNo = $.trim(cardNoSpilt[i]);
//                            if(cardNo == ""){
//                                continue;
//                            }
//                            var cardResult = data[cardNo];
//                            var cardAmount = parseFloat(cardResult["cardAmount"]);
//                            allInputCardNo.each(function(){
//                                if(this.value == cardNo){
//                                    var tempAmount = finalNeedPayAmount - cardAmount;
//                                    var useAmount = tempAmount > 0 ? tempAmount : cardAmount;
//                                    $(this).parent().next().html("卡号" + cardNo + "余额为：" + cardAmount + "元。");
//                                    return false;
//                                }
//                            });
//                        }
//                        if(parseFloat(data["allCardAmount"]) > finalNeedPayAmount){
//                            $("#orderFormSubmit").append("<input type='hidden' name='cardNos' value='"+cardNos+"' />");
//                            $("#checkCard").hide();
//                            var html = '<a href="javascript:;" id="saveConfirm" class="btn_01">确认提交</a>';
//                            $(".btns",$("#confirmLyaer")).append(html);
//                            $("#saveConfirm").click(function(){
//                                submitOrder(that);
//                            });
//                        }else{
//                            alert("您的储值卡余额不足支付此订单，可以选择调整支付方式！");
//                            return false;
//                        }
//                    }else{
//                        alert(data.msg);
//                    }
//                },"json");*/
//            });
//            return false;
//        }
//
//        function submitOrder(obj){
//            if (checkOc(window.oc)) {
//                if($("#description").val() != discriptionVal){
//                    $("#input_description").val($("#description").val());
//                }
//                //document.getElementById("orderFormSubmit").submit();
//                $("#orderFormSubmit").submit();
//                $(obj).html("正在提交...");
//                return false;
//            } else {
//                alert("还有商品没有选择具体规格，请选择具体规格后提交订单。");
//                return false;
//            }
//            return true;
//        }
//        if(!submitOrder(this)){
//            return false;
//        }
//    });
//    window.onOcChange = function (oc) {
//        var oldOcItemLength = 0;
//        if (window.oc.buyItems) {
//            oldOcItemLength = window.oc.buyItems.length;
//        }
//        window.oc = oc;
//        window.ocs = [oc];
//        if (oc.depositPoints == 1) {
//            depositAndPointsEditor.setOc(oc);
//            depositAndPointsEditor.edit();
//        }
//        if (oc.autoUseCard) {
//            $("#couponPanel").html($("#use_cards_template").render(oc));
//        } else {
//            if(!couponSelector){
//                couponSelector = new $.CouponSelector($("#couponPanel"), null, $("#coupon_edit_template"), '/shopping/handle/v3/setUseCoupon.jsp?objectId='+window.objectId, window.oc, merchantId, cartType);
//            }
//            couponSelector.setOc(oc);
//            couponSelector.edit();
//        }
//        $("#cartBodyPanel").html($("#cart_body_template").render(oc));
//        $("#bottomPanel").html($("#order_bottom_template").render(oc));
//
//        var newOcItemLength = 0;
//        if (oc.buyItems) {
//            newOcItemLength = oc.buyItems.length;
//        }
//        if (newOcItemLength != oldOcItemLength) {
//            //当商品行改变，重新计算配送规则
//            deliveryRuleSelector.setOc(oc);
//            deliveryRuleSelector.mode = "edit";
//            deliveryRuleSelector.show();
//        }
//    };
//
//    $("#promotionPanel").html($("#promotion_template").render(oc));
//
//    $("#promotionUser").bind({
//        click:function(){
//        },
//        blur:function(){
//            var phone = this.value;
//            if(phone == ""){
//            }else{
//                var parent = $(this).parent("div");
//                var tip = parent.children(".subtips");
//                if (!(/^(13[0-9]|15[0-9]|18[0-9]|147)\d{8}$/.test(phone))) {
//                    tip.css("color","red").html("输入的推荐人手机号有误,请重新输入");
//                    this.focus();
//                    return false;
//                }
//                var response = $.ajax({url:"handle/v3/check_user_handler.jsp",data:{userKey:phone},cache:false,async:false}).responseText;
//                if(response){
//                    var result = JSON.parse(response);
//                    if(result.code != 100){
//                        $("#promotionUserId").val("");
//                        tip.css("color","red").html(result.msg);
//                        this.focus();
//                    }else{
//                        $("#promotionUserPhone").attr("value",phone);
//                        $("#promotionUserId").attr("value",result.data);
//                        if(promotionPrice && promotionPrice != ""){
//                            tip.css("color","green").html("推荐成功,订单提交后订单金额会减少 "+promotionPrice+" 元");
//                        }
//                    }
//                }
//            }
//        }
//    });
});






