(function ($) {
    $.DepositAndPointEditor = function (elem, showTemplate, editTemplate, saveUrl, oc, merchantId, cartType) {
        this.mode = 'show';
        this.elem = elem;
        this.showTemplate = showTemplate;
        this.editTemplate = editTemplate;
        this.saveUrl = saveUrl;
        this.oc = oc;
        this.merchantId = merchantId;
        this.cartType = cartType;

        this.setOc = function(oc){
            this.oc = oc;
        }

        this.show = function () {
            var that = this;
            that.mode = "show";

//            var showPointPay = false,showDepositPay = false;
//            for (var i = 0; i < window.payments.length; i++) {
//                var payment = window.payments[i];
//                if (payment.payInterfaceId == "payi_4") {
//                    showPointPay = true;
//                }
//                if (payment.payInterfaceId == "payi_5") {
//                    showDepositPay = true;
//                }
//            }
////            if(selectedPayment==null){
////                this.mode = "edit";
////                this.edit();
////                return;
////            }
//            var ocObj = eval("("+this.oc+")");
//
//            ocObj["showPointPay"]=showPointPay;
//            ocObj["showDepositPay"]=showDepositPay;

//alert(ocObj["merchantId"])

            $(this.elem).html($(showTemplate).render(this.oc));
            $(".edit", this.elem).click(function () {
                that.mode = "edit";
                that.edit();

            });
        }
        this.edit = function () {
            var that = this;
            that.mode = "edit";
            $(this.elem).html($(editTemplate).render(that.oc));
            $(".cancel", this.elem).click(function () {
                that.mode = "show";
                that.show();
            });
            $(".save", this.elem).click(function () {
                var depositAmount = $("input.deposit", this.elem).val();
                var $points=$("input.points", this.elem);
                var pointsAmount = $points.val();
                if(pointsAmount && pointsAmount !=""){
                    var integralMultipleInt=parseInt(integralMultiple);
                    var pointsAmountExp = /^\d+(\.\d{1,2}){0,1}$/;
                    var integralMultipleMsg="您最低只能使用到分进行支付！";
                    if(integralMultipleInt==10){
                        pointsAmountExp = /^\d+(\.\d){0,1}$/;
                        integralMultipleMsg="您最低只能使用到角进行支付！";
                    }else if(integralMultipleInt == 100){
                        pointsAmountExp = /^\d+$/;
                        integralMultipleMsg="您只能使用到元进行支付！";
                    }
                    if(!pointsAmountExp.test(pointsAmount)){
                        alert(integralMultipleMsg);
                        $points.focus();
                        return;
                    }
                }
                $.post(that.saveUrl, {"deposit":depositAmount, "points":pointsAmount, "m":that.merchantId, "t":that.cartType,mode:'of'}, function (data) {
                    if (data.state === 'ok') {
                        window.oc = data.oc;
                        that.oc = data.oc;
                        if (window.onOcChange) {
                            window.onOcChange(data.oc);
                        }
                        that.mode = "edit";
                        that.edit();
                    }else {
                        alert(data.msg);
                        return;
                    }

                }, 'json');
            });
        }

    }
})(jQuery);