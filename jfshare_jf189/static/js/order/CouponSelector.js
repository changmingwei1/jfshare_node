(function ($) {
    $.CouponSelector = function (elem, showTemplate, editTemplate, saveUrl, oc, merchantId, cartType) {
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

        this.edit = function () {
            var that = this;
            that.mode = "edit";
            $(that.elem).html($(editTemplate).render(that.oc));
            $(".cancel", this.elem).click(function () {
                that.mode = "show";
                that.show();
            });

            $(".save",that.elem).click(function(){
                var ruleCanUseAmount = {};
                var allCardBatches = that.oc.allCardBatches;
                var isChecked = true;
                var canUseAmount = that.oc.canUseCardAmount;
                var selectUse = {};
                var cardBatchObjs = $(".cardBatch",that.elem);
                cardBatchObjs.each(function(i){
                    var currObj = $(this);
                    var count = currObj.val();
                    if(count == ""){
                        count = 0;
                    }
                    if(isNaN(count)){
                        alert("您选择使用的卡数额输入不正确！");
                        isChecked = false;
                        currObj.focus();
                        return;
                    }
                    var batchId = currObj.attr("batchId");
                    for(var i=0;i<allCardBatches.length;i++){
                        var oneBatch = allCardBatches[i];
                        if(oneBatch.id == batchId){
                            if(Number(count) > oneBatch.allCards.length){
                                count = oneBatch.allCards.length;
                            }
                            var amount = Number(count) * parseFloat(oneBatch.faceValue);
//                            if(amount > oneBatch.maxUseAmount && canUseAmount > 0){
//                                alert("根据优惠规则设定，优惠券(" + oneBatch.name + ")最多能使用" + oneBatch.maxUseAmount + "元！");
//                                currObj.focus();
//                                isChecked = false;
//                                return false;
//                            }

                            if(ruleCanUseAmount[oneBatch.ruleId] == undefined){
                                ruleCanUseAmount[oneBatch.ruleId] = amount;
                            }else{
                                ruleCanUseAmount[oneBatch.ruleId] = ruleCanUseAmount[oneBatch.ruleId] + amount;
                            }

                            if(ruleCanUseAmount[oneBatch.ruleId] > parseFloat(oneBatch.maxUseAmount)){
//                                alert("您选择使用的卡数额大于本订单允许使用的数额！");

                                var tempStr = "";
                                for(var j=0;j<allCardBatches.length;j++){
                                    var tempBatch = allCardBatches[j];
                                    if(tempBatch.ruleId == oneBatch.ruleId){
                                        tempStr += "(" + tempBatch.name + ")";
                                        if(j<allCardBatches.length){
                                            tempStr += "，";
                                        }
                                    }
                                }
                                var msg = "根据优惠规则设定，优惠券" + tempStr + "一共最多能使用" + oneBatch.maxUseAmount + "元！";
                                alert(msg);

                                currObj.focus();
                                isChecked = false;
                                return false;
                            }

                            canUseAmount -= amount;
                            selectUse[oneBatch.id] = count;
                        }
                    }
                });

                var selectUseCount = 0;
                for(var key in selectUse){
                    selectUseCount++;
                }

                if(isChecked && selectUseCount > 0){
                    $.post(that.saveUrl, {"selected":JSON.stringify(selectUse), "m":that.merchantId, "t":that.cartType,mode:'of'}, function (data) {
                        if (data.state === 'ok') {
                            window.oc = data.oc;
                            that.oc = data.oc;
                            if (window.onOcChange) {
                                window.onOcChange(data.oc);
                            }
                            that.mode = "show";
                            //that.show();
                        }
                        else {
                            alert(data.msg);
                            return;
                        }
                    }, 'json');
                }
            });
        }
    }
})(jQuery);