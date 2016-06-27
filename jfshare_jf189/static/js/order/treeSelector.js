(function ($) {
    "use strict";

    var TreeSelector = function (e, curAddr) {
        this.elem = e; //div对象
        this.provinceId = curAddr.provinceId; //选中省id
        this.cityId = curAddr.cityId; //选择市id
        this.countyId = curAddr.countyId; //选中区di
        this.data = {}; //获取到的数据Map
        this.changeListeners = []; //改变选中事件

        //加载省市区div内容
        this.loadValues = function () {
            var postValues = [];
            //if (!this.data[this.root]) {
            //    postValues.push(this.root);
            //}

            for (var i = 0; i < this.values.length; i++) {
                if (!this.data[this.values[i]]) {
                    postValues.push(this.values[i]);

                }
            }
            var that = this;
            var loaderUrl = "";
            if (!empty(this.cityId))
            $.get(loaderUrl, {values:postValues.join(",")}, function (data) {
                $.extend(that.data, data);
                that.render();
            }, "json");

        }

        this.fireChangeEvent = function(){
            for(var i=0; i<this.changeListeners.length; i++){

                this.changeListeners[i](this);

            }
        }
        this.render = function () {
            //var template = $.templates("<select data-parent='{{:parent}}' data-level='{{:level}}'>" +
            //    "{{if id==null}}<option>请选择...</option>{{/if}}" +
            //    "{{for options}}<option value='{{:id}}' {{if id==#parent.parent.data.id}} selected {{/if}} parentid='{{:#parent.parent.data.id}}'>{{:name}}</option>{{/for}}" +
            //    "</select>");

            var source   = $("#consignee_region_template").html();
            var template = Handlebars.compile(source);
            Handlebars.registerHelper('self_null_option',function(id) {
               return empty(id) ? "<option>请选择...</option>" : "";
            });

            Handlebars.registerHelper('self_selected_option',function(id, parent) {
                return id==$("#"+parent).parent.data.id ? "selected" : "";
            });

            var parent = this.root;
            var html = "";
            for (var i = 0; i < this.values.length; i++) {
                var options = this.data[parent];
                if (options && options.length > 0) {
                    html += template({"parent":parent, "options":options, "id":this.values[i], level:i});//template.render({"parent":parent, "options":options, "id":this.values[i], level:i});
                    parent = this.values[i];
                }
            }
            if (this.data[parent] != null && this.data[parent].length > 0) {
                var options = this.data[parent];
                html += template({"parent":parent, "options":options, level:this.values.length});//template.render({"parent":parent, "options":options, level:this.values.length});
            }

            alert(html);
            $(this.elem).html(html);
            var that = this;

            $("select", this.elem).bind("change", function (e) {
                var level = $(this).attr("data-level");
                var pos = parseInt(level);
                var id = $(this).val();
                var len = that.values.length;
                len = len > 0 ? len : len -1;
                that.values.splice(pos,len);
                that.values[pos] = id;
                that.loadValues();
                that.fireChangeEvent();

            });

        }

        this.getSelectedRegion = function () {
            if (this.values == null || this.values.length == 0) {
                return null;
            }
            return this.values[this.values.length - 1];
        }

        this.isLast = function () {
            var regionId = this.getSelectedRegion();
            if (this.data[regionId] != null && this.data[regionId].length == 0) {
                return true;
            }
            return false;
        }

        this.getSelectedRegionFullName = function () {
            var parent = this.root;
            var result = "";
            for (var i = 0; i < this.values.length; i++) {
                var arr = this.data[parent];
                if(arr == undefined){
                    continue;
                }
                for (var j = 0; j < arr.length; j++) {
                    var col = arr[j];
                    if (col.id === this.values[i]) {
                        result = result + col.name;
                        parent = col.id;
                        break;
                    }
                }
            }
            return result;
        }

        this.addChangeListener = function (listener) {
            this.changeListeners.push(listener);
        }
    }
    $.TreeSelector = TreeSelector;

})(jQuery);