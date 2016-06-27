(function ($) {
    var DeliveryRuleSelector = function (oc, mode, elem, editTemplate, showTemplate, saveUrl, merchantId) {
        this.mode = mode;
        this.oc = oc;
        this.elem = elem;
        this.editTemplate = "#" + editTemplate;
        this.showTemplate = "#" + showTemplate;
        this.saveUrl = saveUrl;
        this.merchantId = merchantId;
        this.regionIds = null;
        this.regionSelector = null;
        this.deliveryRuleChangeListeners = [];

        this.selectedDeliveryTimeMapTable = {
            "everyday":"工作日、周末及假日均可送货",
            "m2f":"仅工作日送货",
            "s2s":"仅周末或假日送货"
        };
        this.setOc = function(oc){
            this.oc = oc;
            if (!oc.selectedDeliveryRuleId || !oc.selectedDeliveryTime) {
                this.mode = "edit";
            }
            else {
                if (oc.availableDeliveryRuleResults && oc.availableDeliveryRuleResults.length > 0) {
                    var found = false;
                    for (var i = 0; i < oc.availableDeliveryRuleResults.length; i++) {
                        var r = oc.availableDeliveryRuleResults[i];
                        if (r.ruleId == oc.selectedDeliveryRuleId ) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.mode = "edit";
                    }
                }
            }
        }

        this.setOc(oc);
        this.show = function () {
            if (this.oc && this.oc.availableDeliveryRuleResults && this.oc.availableDeliveryRuleResults.length > 0) {
                if (this.mode === 'edit') {
                    $(this.elem).html($(this.editTemplate).render(this.oc));
                    $(this.elem).addClass("editing");
                    var that = this;

                    var ocSelectedDeliveryRuleResult = that.oc.selectedDeliveryRuleResult;

                    var checkedObj = $("input:checked[name='deliveryRule']", that.elem);
                    if(checkedObj){
                        var descObj = checkedObj.parent().find(".wayDesc");
                        if(descObj){
                            descObj.show();
                        }
                    }

                    $("input[name='deliveryRule']",that.elem).bind("change",function(){
                        var obj = $(this);
                        if(obj.attr("supportDP") == "1"){
                            var pointId = ""
                            if(ocSelectedDeliveryRuleResult != null){
                                pointId = ocSelectedDeliveryRuleResult.selectedDeliveryPointId;
                            }
                            if(pointId == null){
                                pointId = "";
                            }
                            that.loadRegionSelect(obj.val(),pointId);
                            $(".deliveryPointPanel_" + obj.val(),that.elem).show();
                        }else{
                            $("div[class*='deliveryPointPanel_']",that.elem).hide();
                        }

                        $(".wayDesc",that.elem).hide();
                        var descObj = obj.parent().parent().find(".wayDesc");
                        if(descObj){
                            descObj.slideDown();
                        }


//                        var result = that.checkSelect();
//                        if(!result){
//                            return;
//                        }

                        $.post(that.saveUrl, {'orderType':oc.orderType,'selectedRuleId':obj.val(), 'selectedDeliveryTime':"",'selectedDeliveryPointId':"", 'regionId':that.oc.regionId, "m":that.merchantId,mode:'of',selectedDeliveryPointRegionId:""}, function (data) {
                            if (data.state === 'ok') {
                                window.oc = data.oc;   //修改全局变量，这里好像很糟糕,改成fire一个Event
                                that.oc = data.oc;
                                if (window.onOcChange) {
                                    window.onOcChange(data.oc);
                                }
//                                that.mode = 'show';
//                                that.show();
                                that.fireDeliveryRuleChange();
                            }
                        }, 'json');

                    });

                    if(ocSelectedDeliveryRuleResult != null && ocSelectedDeliveryRuleResult.selectedDeliveryPointId != null){
                        var selectedRuleId = $("input:checked[name='deliveryRule']", that.elem).val();
                        var pointId = ocSelectedDeliveryRuleResult.selectedDeliveryPointId
                        if(pointId == null){
                            pointId = "";
                        }
                        that.loadRegionSelect(selectedRuleId,pointId);
                        $(".deliveryPointPanel_" + selectedRuleId,that.elem).show();
                    }else if(that.oc.availableDeliveryRuleResults.length == 1){
                        var ruleResult = (that.oc.availableDeliveryRuleResults)[0];
                        if(ruleResult.supportDP){
                            that.loadRegionSelect(ruleResult.ruleId,"");
                            $(".deliveryPointPanel_" + ruleResult.ruleId,that.elem).show();
                        }
                    }

                    $(".save", that.elem).click(function () {
                        var result = that.checkSelect();
                        if(!result){
                            return;
                        }

                        $.post(that.saveUrl, {'orderType':oc.orderType,'selectedRuleId':result.selectedRuleId, 'selectedDeliveryTime':result.selectedDeliveryTime,'selectedDeliveryPointId':result.selectedDeliveryPointId, 'regionId':that.oc.regionId, "m":that.merchantId,mode:'of',selectedDeliveryPointRegionId:result.selectedDeliveryPointRegionId}, function (data) {
                            if (data.state === 'ok') {
                                window.oc = data.oc;   //修改全局变量，这里好像很糟糕,改成fire一个Event
                                that.oc = data.oc;
                                if (window.onOcChange) {
                                    window.onOcChange(data.oc);
                                }
                                that.mode = 'show';
                                that.show();
                                that.fireDeliveryRuleChange();
                            }
                        }, 'json');
                    });
                    $(".cancel",that.elem).click(function(){
//                        that.mode = "show";
//                        that.show();
                        $(".save", that.elem).click();
                    });
                }
                else {
                    if(this.oc.selectedDeliveryTime && this.oc.selectedDeliveryRuleResult != null){
                        this.oc.selectedDeliveryTimeName = this.selectedDeliveryTimeMapTable[this.oc.selectedDeliveryTime];
                        $(this.elem).html($(this.showTemplate).render(this.oc));
                        $(this.elem).removeClass("editing");
                    }
                    else{
                        alert("还没有选择好配送方式或者由于情况发生了变化，需要你重新选择配送方式。");
                        this.mode = "edit";
                        this.show();
                    }
                    var that = this;
                    $(".edit",this.elem).click(function(){
                        that.mode = "edit";
                        that.show();
                    });
                }
            }
            else {
                $(this.elem).html($("#delivery_error_template").render(oc));
                $(this.elem).removeClass("editing");
            }
        }

        this.setRegionIds = function (ids){
            if(ids == undefined){
                ids = null;
            }
            this.regionIds = ids;
        }

        this.loadRegionSelect = function(deliveryRuleId,deliveryPointId){
            var elem = this.elem;
            var e = $(".DP_region",this.elem);
            if(e != undefined && e != null && e.length > 0){
                var ruleId = e.attr("ruleId");
                if(deliveryRuleId != undefined){
                    ruleId = deliveryRuleId;
                }
				var mid = this.merchantId;
                this.regionSelector = new $.TreeSelector(e, "/tools/selectColumnEx.jsp", "c_region_1602", this.regionIds);
                this.regionSelector.addChangeListener(function(treeSelector){
                    var domQuery = "input:checked[name='deliveryPoint_" + ruleId + "']";
                    var selectedDeliveryPointId = $(domQuery, this.elem).val();
                    if(selectedDeliveryPointId == undefined || selectedDeliveryPointId == null){
                        selectedDeliveryPointId = deliveryPointId;
                    }
                    $.get("/shopping/handle/v3/loadDeliveryPoint.jsp",{regionId:treeSelector.getSelectedRegion(),merchantId:mid,selectedDeliveryPointId:selectedDeliveryPointId,deliveryRuleId:ruleId},function(data){
                        if(data['state']){
                            $("#deliveryPointsList_" + ruleId,elem).html($("#delivery_point_list_template").render({"ruleId":ruleId,"availableDeliveryPoints":data['points']}));
                        }else{
                            $("#deliveryPointsList_" + ruleId,elem).html("<li style='padding-left:20px;color:#E60000;'>"+data['errorMsg']+"</li>");
                        }
                    },"json");
                });

                this.regionSelector.loadValues();
                this.regionSelector.fireChangeEvent();
            }

        }

        this.deliveryRuleChangeListener = function(listener){
            this.deliveryRuleChangeListeners.push(listener);
        }

        this.fireDeliveryRuleChange=function(){
            for(var i=0; i<this.deliveryRuleChangeListeners.length; i++){
                this.deliveryRuleChangeListeners[i](this.oc.selectedDeliveryRuleResult);
            }
        }

        this.checkSelect = function(){
            var selectedRuleId = $("input:checked[name='deliveryRule']", this.elem).val();
            var selectedDeliveryTime = $("input:checked[name='deliveryTime']", this.elem).val();
            if (selectedDeliveryTime == null) {
                alert("请选择配送时间。");
                return false;
            }
            if (selectedRuleId == null) {
                alert("请选择配送方式。");
                return false;
            }
            var selectedRuleResult;
            for(var i=0;i<this.oc.availableDeliveryRuleResults.length;i++){
                var ruleResult =this.oc.availableDeliveryRuleResults[i];
                if(ruleResult.ruleId===selectedRuleId){
                    selectedRuleResult = ruleResult;
                    break;
                }
            }
            var selectedDeliveryPointId = "";
            if(selectedRuleResult.supportDP){
                var domQuery = "input:checked[name='deliveryPoint_" + selectedRuleResult.ruleId + "']";
                selectedDeliveryPointId = $(domQuery, this.elem).val();
                if(!selectedDeliveryPointId) {
                    alert("请选择自提点！");
                    return false;
                }
            }
            var  selectedDeliveryPointRegionId = '';
            if(this.regionSelector && this.regionSelector.getSelectedRegion()){
                selectedDeliveryPointRegionId = this.regionSelector.getSelectedRegion();
            }

            var result ={
                "selectedDeliveryTime":selectedDeliveryTime,
                "selectedRuleId":selectedRuleId,
                "selectedDeliveryPointId":selectedDeliveryPointId,
                "selectedDeliveryPointRegionId":selectedDeliveryPointRegionId,
                "regionId":this.oc.regionId
            };
            return result;
        }
    }

    $.DeliveryRuleSelector = DeliveryRuleSelector;
})(jQuery);