(function ($) {
    $.SkuSelector = function (initconfigs) {
        var $that = this;
        $that.attrs = [];
        $that.skus = [];
        $that.loadAfterEvent = undefined;
        $that.completeAfterEvent = undefined;
        $that.selectedValue = {};

        if (initconfigs) {
            $that.getAttrsUrl = initconfigs.getAttrsUrl ? initconfigs.getAttrsUrl : undefined;
            $that.completeUrl = initconfigs.completeUrl ? initconfigs.completeUrl : undefined;
            $that.loadAfterEvent = initconfigs.loadAfterEvent ? initconfigs.loadAfterEvent : undefined;
            $that.completeAfterEvent = initconfigs.completeAfterEvent ? initconfigs.completeAfterEvent : undefined;
            $that.attr_container = initconfigs.attr_container ? initconfigs.attr_container : undefined;
        }

        $that.load = function (config) {
            $that.productId = undefined;
            if (config) {
                $that.productId = config.productId ? config.productId : undefined;
                $that.oldSelectedSkuId = config.oldSelectedSkuId ? config.oldSelectedSkuId : undefined;
                $that.itemId = config.itemId ? config.itemId : undefined;
                $that.ruleId = config.ruleId ? config.ruleId : undefined;
                $that.cartId = config.cartId ? config.cartId : undefined;
            }
            if(!$that.productId){
                throw "productId is undefined";
            }
            $that.reSetSelectedValue();
            var postData = {productId: $that.productId};
            $.ajax({
                url: $that.getAttrsUrl,
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function (data) {
                    if (data.state == "ok") {
                        $that.attrs = data.attrs;
                        if ($that.loadAfterEvent) {
                            $that.loadAfterEvent.fireEvent();
                        }
                    } else {
                        alert(data.msg);
                    }
                }
            });
        };

        $that.setSelectedValue = function (attrId, attrValueId) {
            $that.selectedValue[attrId] = attrValueId;
            $that.showTips();
        };

        $that.reSetSelectedValue = function () {
            $that.selectedValue = {};
        };

        if ($that.attr_container) {
            var $attr_container = $($that.attr_container);

            //标准值单选事件
            var $doClickValue = $(".doClickValue", $attr_container);
            if ($doClickValue) {
                $doClickValue.die();
                $doClickValue.live("click", function () {
                    var $this = $(this);
                    var attrId = $this.attr("attrId");
                    var valueId = $this.attr("valueId");
                    $that.setSelectedValue(attrId, valueId);
                    $that.reShowValues(attrId, valueId);
                });
            }

            //确认事件
            var $doSelectSkuBtn = $(".doSelectSkuBtn", $attr_container);
            if ($doSelectSkuBtn) {
                $doSelectSkuBtn.die();
                $doSelectSkuBtn.live("click", function () {
                    if (!$that.isSelectedAll()) {
                        alert("请正确选择相应的规格后再点击确认");
                        return;
                    }
                    if(!$that.productId){
                        throw "productId is undefined";
                    }
                    var postData = {productId: $that.productId};
                    postData.attrs = $.toJSON($that.selectedValue);
                    if($that.itemId) postData.itemId = $that.itemId;
                    if($that.ruleId) postData.ruleId = $that.ruleId;
                    if($that.cartId) postData.cartId = $that.cartId;
                    if($that.oldSelectedSkuId) postData.oldSelectedSkuId = $that.oldSelectedSkuId;
                    $.ajax({
                        url: $that.completeUrl,
                        type: 'post',
                        data: postData,
                        dataType: 'json',
                        success: function (data) {
                            if (data.state == "ok") {
                                if ($that.completeAfterEvent) {
                                    $that.completeAfterEvent.fireEvent(data);
                                }
                            } else {
                                alert(data.msg);
                            }
                        }
                    });
                });
            }
        }

        $that.reShowValues = function (curAttrId, curValueId) {
            var curAttrValue = $that.getAttrValue(curAttrId, curValueId);
            //把与当前选择的标准值不匹配的已选择的标准值去掉选中
            $that.removeNotMatchSelected(curAttrId, curAttrValue);
            var $attr_container = $($that.attr_container);
            var $doClickValue = $(".doClickValue", $attr_container);
            if ($doClickValue) {
                $doClickValue.each(function () {
                    var $this = $(this);
                    var attrId = $this.attr("attrId");
                    var valueId = $this.attr("valueId");

                    $this.removeClass("cur");
                    $this.removeClass("disable");
                    if (curAttrId == attrId) {
                        if (curValueId == valueId) {
                            $this.addClass("cur");
                        } else {
                            if (!$that.isMatchSelected(attrId, valueId)) {
                                $this.addClass("disable");
                            }
                        }
                    } else {
                        var relIds = curAttrValue[attrId + "_relIds"];
                        var isMatch = $that.isMatch(relIds, valueId);
                        var isMatchSelected = $that.isMatchSelected(relIds, valueId);
                        if (isMatch && isMatchSelected) {
                            if ($that.isSelected(attrId, valueId)) {
                                $this.addClass("cur");
                            }
                        } else {
                            $this.addClass("disable");
                        }
                    }
                });
            }
        };

        //把与当前选择的标准值不匹配的已选择的标准值去掉选中
        $that.removeNotMatchSelected = function (attrId, attrValue) {
            for (var key in $that.selectedValue) {
                if (attrId != key) {
                    var value = $that.selectedValue[key];
                    if (value && value != "") {
                        var relIds = attrValue[key + "_relIds"];
                        var isExist = $that.isMatch(relIds, value);
                        if (!isExist) {
                            $that.setSelectedValue(key, "");
                        }
                    }
                }
            }
        };

        //检查当前标准值是否满足其他已经选择的标准，如果不满足，则设置为disable
        $that.isMatchSelected = function (attrId, valueId) {
            for (var key in $that.selectedValue) {
                var value = $that.selectedValue[key];

                if (value && value != "") {
                    var attrValue = $that.getAttrValue(key, value);
                    if (attrValue) {
                        var relIds = attrValue[attrId + "_relIds"];
                        if (relIds) {
                            var isExist = $that.isMatch(relIds, valueId);
                            if (!isExist) {
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        };

        $that.isMatch = function (relIds, valueId) {
            var isExist = false;
            if (relIds) {
                var relId = relIds.split(",");
                for (var i = 0; i < relId.length; i++) {
                    if (relId[i] == valueId) {
                        isExist = true;
                    }
                }
            }
            return isExist;
        };

        $that.isSelected = function (attrId, valueId) {
            var value = $that.selectedValue[attrId];
            if (value && value == valueId) {
                return true;
            }
            return false;
        };

        //是否所有购买属性都已选择
        $that.isSelectedAll = function () {
            var selectedSize = 0;
            for (var key in $that.selectedValue) {
                var value = $that.selectedValue[key];
                if (value && value != "") {
                    selectedSize++;
                }
            }
            if (selectedSize == $that.attrs.length) {
                return true;
            }
            return false;
        };

        $that.showTips = function () {
            var html = "";
            for (var key in $that.selectedValue) {
                var value = $that.selectedValue[key];
                if (value && value != "") {
                    if (html == "") {
                        html += $that.getAttrValueName(key, value);
                    } else {
                        html += '，' + $that.getAttrValueName(key, value);
                    }
                }
            }
            html = "您已选择：" + html;
            var $attr_container = $($that.attr_container);
            var $tips = $(".tips", $attr_container);
            if ($tips) {
                $tips.html(html);
            }
        };

        $that.getAttrValueName = function (attrId, valueId) {
            var value = $that.getAttrValue(attrId, valueId);
            if (value) {
                return value.name;
            }
            return "未定义";
        };

        $that.getAttrValue = function (attrId, valueId) {
            if ($that.attrs) {
                for (var i = 0; i < $that.attrs.length; i++) {
                    var attr = $that.attrs[i];
                    if (attr.id == attrId) {
                        var values = attr.values;
                        if (values) {
                            for (var j = 0; j < values.length; j++) {
                                var value = values[j];
                                if (value.id == valueId) {
                                    return value;
                                }
                            }
                        }
                    }
                }
            }
            return undefined;
        };


    }
})(jQuery);