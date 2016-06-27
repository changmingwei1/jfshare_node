(function ($) {
    $.PaymentSelector = function (elem, editTemplate, showTemplate, payments, selectedPaymentId, saveSelectedPaymentUrl,merchantId) {
        this.mode = 'show';
        this.elem = elem;
        this.editTemplate = editTemplate;
        this.showTemplate = showTemplate;
        this.payments = payments;
        this.selectedPaymentId = selectedPaymentId;
        this.saveSelectedPaymentUrl = saveSelectedPaymentUrl;
        this.enableCOD = true;
        this.merchantId = merchantId;

        this.show = function () {
            var selectedPayment = null;
            for (var i = 0; i < this.payments.length; i++) {
                var payment = this.payments[i];
                if (payment.id === this.selectedPaymentId) {
                    selectedPayment = payment;
                }
            }
            if(selectedPayment==null){
                this.mode = "edit";
                this.edit();
                return;
            }

            if(this.enableCOD == false && (selectedPayment.payInterfaceId == "payi_0"|| selectedPayment.payInterfaceId == "payi_17" || selectedPayment.payInterfaceId == "payi_20" || selectedPayment.payInterfaceId == "payi_21" || selectedPayment.payInterfaceId == "payi_101")){
                this.mode = "edit";
                this.edit();
                return;
            }

            $(this.elem).html($(showTemplate).render(selectedPayment));
            that = this;
            $(".edit",this.elem).click(function(){
                that.edit();
                that.mode = "edit";
            });
        }

        this.edit = function(){
            var that = this;
            if(this.payments==null || this.payments.length==0){
                return;
            }
            var canSelectPayments = [];
            if (this.enableCOD == false) {
                for (var i = 0; i < payments.length; i++) {
                    var payment = payments[i];
                    if (payment.payInterfaceId == "payi_0" || payment.payInterfaceId == "payi_17" || payment.payInterfaceId == "payi_20" || payment.payInterfaceId == "payi_21" || payment.payInterfaceId == "payi_101") {
                        continue;
                    }
                    canSelectPayments.push(payment);
                }
            } else {
                canSelectPayments = payments;
            }
            $(this.elem).html($(editTemplate).render({selectedPaymentId:this.selectedPaymentId,payments:canSelectPayments,"enableCOD":this.enableCOD}));
            var thisInputs = $("input",that.elem);
            if(thisInputs.length == 1){
                thisInputs[0].checked=true;
            }
            $(".cancel",that.elem).click(function(){
//                that.mode = "show";
//                that.show();
                $(".btnSave a",this.elem).click();
            });
            $(".btnSave a",this.elem).click(function(){
                var result = that.checkSelect();
                if(!result){
                    return;
                }

                $.post(that.saveSelectedPaymentUrl,{'selectedPaymentId':result.selectedPaymentId,mode:'of','orderType':oc.orderType,'merchantId':that.merchantId},function(data){
                    if(data.state==="ok"){
                        that.selectedPaymentId = result.selectedPaymentId;
                        that.show();
                        that.mode = "show";
                    }else if(data.state==="failed"){
                        alert(data.msg);
                        return null;
                    }
                    else{
                        alert("服务器出现错误," + data.msg);
                        return null;
                    }
                },"json");
            });

        }

        this.setEnableCOD = function(bool){
            this.enableCOD = bool;
        }

        this.checkSelect = function(){
            var selectedPayInterfaceId = $("input:checked",this.elem).attr("title");
            $("#selectedPayInterfaceId").val(selectedPayInterfaceId);
            var selectedPaymentId = $("input:checked",this.elem).val();
            if(!selectedPaymentId){
                alert("请选择一种支付方式。");
                return false;
            }else{
                return {"selectedPaymentId":selectedPaymentId};
            }
        }
    }
})(jQuery);