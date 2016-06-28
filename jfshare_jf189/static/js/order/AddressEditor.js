(function ($) {
    var AddressEditor = function (addresses, elem, initMode) {
        //alert(addresses.length);
        this.addresses = addresses; //收货地址列表
        this.elem = elem; //收货地址div对象
        this.mode = initMode; //显示模式（详情页签还是列表编辑）
        //this.addressSelector = null; //省市区选择器
        //this.addressChangeListeners = []; //省市区改变事件

        //this.addr 当前选中  (若当前如未选中，默认选中默认收货地址，无默认收货地址选中第一个地址)
        if (empty(this.addr)) {
            if (!empty(this.addresses)) {
                for (var i = 0; i < this.addresses.length; i++) {
                    var addr = this.addresses[i];
                    if (!empty(addr.isDefault) && addr.isDefault == "1") {
                        this.addr = addr;
                    }
                }
                if (empty(this.addr)) {
                    this.addr = this.addresses[0];
                }
            }
        }

        if (empty(this.addr)) {
            this.mode = "edit";
            this.cloneAddr = {}; //编辑框中是否有内容
        }

        this.show = function () {
            var that = this;
            //列表+编辑
            if (this.mode === 'edit') {
                var showAddr = clone(this.cloneAddr);
                showAddr.consigneeList = this.addresses;
                renderEditAddress(showAddr);
                $("#consigneeList input[class!='other']", this.elem).bind("change", function () {
                    var selectedAddressId = $("#consigneeList input:checked", that.elem).val();
                    for (var i = 0; i < that.addresses.length; i++) {
                        var address = that.addresses[i];
                        if (String(address.id) === selectedAddressId) {
                            that.addr = address;
                            that.cloneAddr = clone(that.addr);
                            break;
                        }
                    }
                    that.show();

                });

                //获取省市区控件
                renderSelectCity(showAddr);
                //alert("开始获取省市区" + $("#js_selectcity") + "," + $(".citylists").attr("prov-data"));

                //new $.fn.citySelect();
                //var e = $(".region", this.elem);
                //this.addressSelector = new $.TreeSelector(e, this.cloneAddr);
                //this.addressSelector.addChangeListener(function (selector) {
                //    that.cloneAddr.regionName = selector.getSelectedRegionFullName();
                    //that.mode = "show";
                    //that.show();
                    //$(".regionName",that.elem).html(that.cloneAddr.regionName);
                //});

                //this.addressSelector.loadValues();

                $(".cancelEdit", this.elem).click(function () {
                    if(that.addr != undefined && that.addr != null){
                        that.mode = "show";
                        that.cloneAddr = clone(that.addr);
                        that.show();
                    }
                });
                $(".save", this.elem).click(function () {
                    that.saveAddress();
                });
                $(".saveNew", this.elem).click(function () {
                    that.saveNewAddress();
                });

                $("a.delete",this.elem).click(function(){
                    if(confirm("是否确认删除？")){
                        var addrId = $(this).attr("addrid");
                        that.remove(addrId, function(){
                            if(that.addresses.length == 0) {
                                that.resetAddress();
                            }
                        });
                    }
                });
                $("a.default",this.elem).click(function(){
                    var addrId = $(this).attr("addrid");
                    that.defaultAddr(addrId);
                });

                $(".other",this.elem).click(function(){
                    that.resetAddress();
                });
            }
            else {   //详情页签
                if(this.addr == undefined || this.addr == null) {
                    alert("请完善收货地址信息!");
                }

                renderShowAddress(this.addr);
                $(".edit", this.elem).click(function () {
                        that.cloneAddr = clone(that.addr);
                        that.mode = "edit";
                        that.show();
                    }
                );
            }
        }

        this.remove = function(addrId, callback){
            var that = this;
            for(var i=0; i<this.addresses.length;i++){
                var addr = this.addresses[i];
                //alert(addr.id+",to del =="+addrId + ",equal?"+(String(addr.id)===addrId));
                if(String(addr.id)===addrId){
                    this.addresses.splice(i,1);
                    this.addr = null;
                    break;
                }
            }

            $.post("/address/delete",{addrId:addrId,mode:'of'},function(data){
                if(data.status === 200){
                    that.show();
                    callback();
                }
                else{
                    alert("服务器出现异常,返回了错误：" + data.error);
                }
            },"json")
            this.show();

        }
        this.defaultAddr = function(addrId){
            var that = this;

            $.post("/address/default",{addrId:addrId,mode:'of'},function(data){
                if(data.status === 200){
                    for(var i=0; i<that.addresses.length;i++){
                        var addr = that.addresses[i];
                        //alert(addr.id+",to del =="+addrId + ",equal?"+(String(addr.id)===addrId) + ", isDefault:" + addr["isDefault"]);
                        if(String(addr.id)===addrId){
                            that.addresses[i].isDefault = 1;
                        } else {
                            that.addresses[i].isDefault = 0;
                        }
                    }
                    that.show();
                    alert("设置默认地址成功");
                }
                else{
                    alert("服务器出现异常,返回了错误：" + data.error);
                }
            },"json")
            this.show();

        }
        this.saveAddress = function () {
            var that = this;
            var result = that.checkSelect();
            if(!result){
                return false;
            }
            $.post("/address/save", {"addr":JSON.stringify(this.cloneAddr),mode:'of', ssid:$("#ssid").val()}, function (data) {
                if (data.status === 200) {
                    var found = false;

                    that.cloneAddr["id"] = data.newId;
                    that.addr = that.cloneAddr;
                    if(data["regionIds"]){
                        that.addr["regionIds"] = data["regionIds"];
                    }
                    for (var i = 0; i < that.addresses.length; i++) {
                        var address = that.addresses[i];
                        if (String(address.id) === String(that.addr.id)) {
                            that.addresses[i] = that.addr;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        if (empty(that.addresses)) {
                            that.addresses = [];
                        }
                        that.addr.isDefault = 0;
                        that.addresses.push(that.addr);
                    }
                    that.cloneAddr = clone(that.addr);
                    that.mode = "show";
                    that.show();
                    //that.fireAddressChange();
                } else if (data.status === 501) {
                    alert(data.error);
                } else {
                    alert("服务器出现异常，返回的错误信息：" + data.error);
                }
            }, 'json');
        }
        this.saveNewAddress = function () {
            if(this.addresses.length >= 5) {
                alert("最多可以添加5个默认收货地址");
                return;
            }
            this.cloneAddr["id"] = "";
            this.saveAddress();
        }

        this.resetAddress = function () {
            $("#receiverName").val("");
            $("#detailAddress").val("");
            $("#mobile").val("");
            $("#telCode").val("");
            $("#tel").val("");
            $("#telExtNumber").val("");
            $("#email").val("");
            $("#jsSelectcityPanel").find("li").find(".js_postcode").val("");
            $("#jsSelectcityPanel").find("li").find("p.txt").find("span").html("");
            $("#jsSelectcityPanel").find("li").find(".prov").val("");
            $("#jsSelectcityPanel").find("li").find(".prov").attr("txt", "");
            $("#jsSelectcityPanel").find("li").find(".city").val("");
            $("#jsSelectcityPanel").find("li").find(".city").attr("txt", "");
            $("#jsSelectcityPanel").find("li").find(".dist").val("");
            $("#jsSelectcityPanel").find("li").find(".dist").attr("txt", "");
            this.cloneAddr["id"] = "";
        }

        this.checkSelect = function(){
            var that = this;
            var e = that.elem;
            var userNameObj = $("#receiverName", e);
            var detailAddressObj = $("#detailAddress",e);
            var postalCodeObj =$("#jsSelectcityPanel", e).find("li").find(".js_postcode");
            var nncObj  = $("#jsSelectcityPanel", e).find("li").find("p.txt").find("span");
            var emailObj = $("#email", e);

            if(empty(userNameObj.val())){
                this.tipMsg(e, "请填写收货人姓名！", userNameObj);
                return false;
            }

            if(empty(nncObj.html())){
                this.tipMsg(e, "请正确选择地区！", nncObj);
                return false;
            }

            if(empty(detailAddressObj.val())){
                this.tipMsg(e, "请填写详细地址！", detailAddressObj);
                return false;
            }

            if(empty(postalCodeObj.val()) || postalCodeObj.val().length != 6){
                this.tipMsg(e, "邮政编码应该是6位数字！", postalCodeObj);
                return false;
            }

            var mobileObj = $("#mobile", e);
            var telCodeObj = $("#telCode", e);
            var telObj = $("#tel", e);
            var telExtNumberObj = $("#telExtNumber", e);
            if(empty(mobileObj.val())){
                this.tipMsg(e, "请填写手机号码！", mobileObj);
                return false;
            }

            if(!/^(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])\d{8}$/.exec(mobileObj.val())){
                this.tipMsg(e, "请正确输入11位的手机号码 ！", mobileObj);
                return false;
            }

            if(!empty(telCodeObj.val()) && telCodeObj.val().length > 10){
                this.tipMsg(e, "电话区号必须是不超过10位的数字！", postalCodeObj);
                return false;
            }
            if(!empty(telObj.val()) && telObj.val().length > 20){
                this.tipMsg(e, "固定电话必须是不超过20位的数字", postalCodeObj);
                return false;
            }
            if(!empty(telExtNumberObj.val()) && telExtNumberObj.val().length > 10){
                this.tipMsg(e, "电话分机号必须是不超过10位的数字！", postalCodeObj);
                return false;
            }
            //var phoneObj = $("#phone", e);
            //if(!empty(phoneObj.val())){
            //    if(!/^\d{3,4}-\d{8}$|\d{4}-\d{7}|\d{3,4}-\d{8}$/.exec(phone)){
            //        $(".contips").css("color","red").html("&nbsp;");
            //        this.tipMsg(e, "请输入正确格式的电话号码", phoneObj);
            //        return false;
            //    }
            //}

            this.tipMsg(e, "", null);

            that.cloneAddr.receiverName = userNameObj.val();
            that.cloneAddr.address = detailAddressObj.val();
            that.cloneAddr.mobile = mobileObj.val();
            that.cloneAddr.telCode = telCodeObj.val();
            that.cloneAddr.tel = telObj.val();
            that.cloneAddr.telExtNumber = telExtNumberObj.val();
            that.cloneAddr.postCode = postalCodeObj.val();
            that.cloneAddr.email = emailObj.val();
            that.cloneAddr.provinceId =  empty($("#jsSelectcityPanel", e).find("li").find(".prov")) ? null : $("#jsSelectcityPanel", e).find("li").find(".prov").val();
            that.cloneAddr.cityId =  empty($("#jsSelectcityPanel", e).find("li").find(".city")) ? null : $("#jsSelectcityPanel", e).find("li").find(".city").val();
            that.cloneAddr.countyId =  empty($("#jsSelectcityPanel", e).find("li").find(".dist")) ? null : $("#jsSelectcityPanel", e).find("li").find(".dist").val();
            that.cloneAddr.provinceName =  empty($("#jsSelectcityPanel", e).find("li").find(".prov")) ? null : $("#jsSelectcityPanel", e).find("li").find(".prov").attr("txt");
            that.cloneAddr.cityName =  empty($("#jsSelectcityPanel", e).find("li").find(".city")) ? null : $("#jsSelectcityPanel", e).find("li").find(".city").attr("txt");
            that.cloneAddr.countyName =  empty($("#jsSelectcityPanel", e).find("li").find(".dist")) ? null : $("#jsSelectcityPanel", e).find("li").find(".dist").attr("txt");
            return {"cloneAddr":that.cloneAddr};
        }

        this.tipMsg = function (elem, msg, curelem) {
            var obj = $("#tipMsg", elem);
            obj.next(".subtips").css("color","red").html(msg);
            if(!empty(msg)){
                curelem.focus();
            }
        }
    }
    $.AddressEditor = AddressEditor;
})(jQuery);
