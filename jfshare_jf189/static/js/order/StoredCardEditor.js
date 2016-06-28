(function ($) {
    $.StoredCardEditor = function (elem, showTemplate, editTemplate, addUrl, updateUrl, oc, merchantId, cartType) {
        this.mode = 'show';
        this.elem = elem;
        this.showTemplate = showTemplate;
        this.editTemplate = editTemplate;
        this.addUrl = addUrl;
        this.updateUrl = updateUrl;
        this.oc = oc;
        this.merchantId = merchantId;
        this.cartType = cartType;
        this.cardTypeName='储值卡';
        this.limitUseAmt='-1';//使用限额

        this.setOc = function (oc) {
            this.oc = oc;
        };

        this.setCardTypeName = function (typeName) {
            this.cardTypeName = typeName;
        }

        this.setLimitUseAmt = function (limitUseAmt) {
            this.limitUseAmt = limitUseAmt;
        }

        this.show = function () {
            var that = this;
            that.mode = "show";

            $(this.elem).html($(showTemplate).render(this.oc));
            $(".edit", this.elem).click(function () {
                that.mode = "edit";
                that.edit();

            });
        };
        this.edit = function () {
            var that = this;
            that.mode = "edit";
            $(this.elem).html($(editTemplate).render(that.oc));
            $(".cancel", this.elem).click(function () {
                that.mode = "show";
                that.show();
            });
            $(".useNewStoredCardBtn", that.elem).click(function () {
                var curObj = $(this);
                var panel = $("#useNewStoredCardPanel");
                if (panel.is(":hidden")) {
                    var $cardNumber = $("input.cardNumber", that.elem);
                    var $cardPwd = $("input.cardPwd", that.elem);
                    $cardNumber.val("");
                    $cardPwd.val("");
                    panel.show();
                    $cardNumber.focus();
                    curObj.html("收起使用新的" + that.cardTypeName);
                } else {
                    panel.hide();
                    curObj.html("使用新的" + that.cardTypeName);
                }
            });
            $(".updateUsedStoredCard", that.elem).die();
            $(".updateUsedStoredCard", that.elem).live("click", function () {
                var $parent = $(this).parent().parent();
                var $ucaLabel = $(".ucaLabel", $parent);
                var $ucaSpan = $(".ucaSpan", $parent);
                var $ducaSpan = $(".ducaSpan", $parent);
                var $updateUsedStoredCard = $(".updateUsedStoredCard", $parent);
                var $removeUsedStoredCard = $(".removeUsedStoredCard", $parent);
                $ucaLabel.hide();
                $updateUsedStoredCard.hide();
                $removeUsedStoredCard.hide();
                $ucaSpan.show();
                $ducaSpan.show();
            });
            $(".removeUsedStoredCard", that.elem).die();
            $(".removeUsedStoredCard", that.elem).live("click", function () {
                var $parent = $(this).parent().parent();
                var $cnoLabel = $(".cnoLabel", $parent);
                var cardNumber = $cnoLabel.html();
                var ok = confirm("确定不使用卡号为【" + cardNumber + "】的" + that.cardTypeName + "吗？");
                if (!ok) {
                    return;
                }
                $.post(that.updateUrl, {"cardNumber": cardNumber, "m": that.merchantId, "t": that.cartType, mode: 'of', updateType: 'delete'}, function (data) {
                    if (data.state === 'ok') {
                        window.oc = data.oc;
                        that.oc = data.oc;
                        if (window.onOcChange) {
                            window.onOcChange(data.oc);
                        }
                        that.mode = "edit";
                        that.edit();
                    } else {
                        alert(data.msg);
                    }
                }, 'json');
            });
            $(".doUpdateUsedStoredCard", that.elem).die();
            $(".doUpdateUsedStoredCard", that.elem).live("click", function () {
                var $parent = $(this).parent().parent().parent();
                var $cnoLabel = $(".cnoLabel", $parent);
                var $usedAmount = $(".usedAmount", $parent);
                var cardNumber = $cnoLabel.html();
                var usedAmount = $usedAmount.val();
                var canUseAmount = $(this).attr("data-a");
                if ($.trim(usedAmount) == "") {
                    alert("请输入使用金额");
                    $usedAmount.focus();
                    return;
                }
                if (isNaN(usedAmount)) {
                    alert("请输入正确的使用金额");
                    $usedAmount.focus();
                    return;
                }
                if (Number(usedAmount) <= 0) {
                    alert("使用金额不能小于或等于零");
                    $usedAmount.focus();
                    return;
                }
                if (Number(usedAmount) > Number(canUseAmount)) {
                    alert("使用金额不能大于可用金额，请重新输入");
                    $usedAmount.val(canUseAmount);
                    $usedAmount.focus();
                    return;
                }
                if ((Number(that.limitUseAmt) != -1) && (Number(usedAmount) > Number(that.limitUseAmt))) {
                    alert("使用金额不能超过" + that.limitUseAmt + "元限额");
                    $usedAmount.focus();
                    return;
                }
                $.post(that.updateUrl, {"needPayAmount": window.oc.finalNeedPayAmount, "cardNumber": cardNumber, "usedAmount": usedAmount, "m": that.merchantId, "t": that.cartType, mode: 'of'}, function (data) {
                    if (data.state === 'ok') {
                        window.oc = data.oc;
                        that.oc = data.oc;
                        if (window.onOcChange) {
                            window.onOcChange(data.oc);
                        }
                        that.mode = "edit";
                        that.edit();
                    } else {
                        alert(data.msg);
                    }

                }, 'json');
            });
            $(".save", that.elem).click(function () {
                var $cardNumber = $("input.cardNumber", that.elem);
                var $cardPwd = $("input.cardPwd", that.elem);
                var $safeCode = $("input.safeCode", that.elem);
                var cardNumber = $cardNumber.val();
                var cardPwd = $cardPwd.val();
                var safeCode = $safeCode.val();
                if ($.trim(cardNumber) == "") {
                    alert("请输入" + that.cardTypeName + "卡号");
                    $cardNumber.focus();
                    return;
                }
                if ($.trim(cardPwd) == "") {
                    alert("请输入" + that.cardTypeName + "密码");
                    $cardPwd.focus();
                    return;
                }
                $.post(that.addUrl, {"needPayAmount": window.oc.finalNeedPayAmount, "cardNumber": cardNumber, "cardPwd": cardPwd, "safeCode": safeCode, "m": that.merchantId, "t": that.cartType, mode: 'of'}, function (data) {
                    if (data.state === 'ok') {
                        window.oc = data.oc;
                        that.oc = data.oc;
                        if (window.onOcChange) {
                            window.onOcChange(data.oc);
                        }
                        that.mode = "edit";
                        that.edit();
                    } else {
                        $cardNumber.val("");
                        $cardPwd.val("");
                        $safeCode.val("");
                        $cardNumber.focus();
                        alert(data.msg);
                    }
                }, 'json');
            });

            $("input:radio[name='sCardNo']", that.elem).die();
            $("input:radio[name='sCardNo']", that.elem).live("click", function () {
                var radioVal = $(this).val();
                if (radioVal) {
                    $(".cardNumber", that.elem).val(radioVal);
                }
            });
        };
    }
})(jQuery);