/**
 * Created by Administrator on 2016/5/7.
 */
//分页插件
(function ($) {

    var ms = {
        init: function (obj, args) {
            return (function () {
                ms.fillHtml(obj, args);
                ms.bindEvent(obj, args);
            })();
        },
        //填充html
        fillHtml: function (obj, args) {
            return (function () {
                obj.empty();
                //上一页
                if (args.current > 1) {
                    obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
                } else {
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                if (args.current != 1 && args.current >= 4 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
                }
                if (args.current - 2 > 2 && args.current <= args.pageCount && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                var start = args.current - 2, end = args.current + 2;
                if ((start > 1 && args.current < 4) || args.current == 1) {
                    end++;
                }
                if (args.current > args.pageCount - 4 && args.current >= args.pageCount) {
                    start--;
                }
                for (; start <= end; start++) {
                    if (start <= args.pageCount && start >= 1) {
                        if (start != args.current) {
                            obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                        } else {
                            obj.append('<span class="current">' + start + '</span>');
                        }
                    }
                }
                if (args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5) {
                    obj.append('<span>...</span>');
                }
                if (args.current != args.pageCount && args.current < args.pageCount - 2 && args.pageCount != 4) {
                    obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
                }
                //下一页
                if (args.current < args.pageCount) {
                    obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
                } else {
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent: function (obj, args) {
            return (function () {
                obj.on("click", "a.tcdNumber", function () {
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj, {"current": current, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click", "a.prevPage", function () {
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj, {"current": current - 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current - 1);
                    }
                });
                //下一页
                obj.on("click", "a.nextPage", function () {
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj, {"current": current + 1, "pageCount": args.pageCount});
                    if (typeof(args.backFn) == "function") {
                        args.backFn(current + 1);
                    }
                });
            })();
        }
    };
    $.fn.createPage = function (options) {
        var args = $.extend({
            pageCount: 10,
            current: 1,
            backFn: function () {
            }
        }, options);
        ms.init(this, args);
    }
})($);

//定向充值的文件路径
var tempPath;
//定向充值中上传文件后增加的div的id
var tempId;
//按钮是否可以点击
var isCanClick=true;
//当前页
var tempCurPage;
//每个条目的查看的网络请求的请求参数
var tempParam = {};
//批次活动列表的返回的List
var List = null;


$('.date-picker').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    language: "zh-CN",
    todayHighlight: true,
    orientation: "bottom auto",
    autoclose: true
});

$(".date-timer-picker").datetimepicker({
        timeFormat: 'hh:mm:ss'
    }
); // 日期+时分秒




function init(curPage) {
    tempCurPage=curPage;
    var param = {};
    param.name = $("input[name='batchName']").val() || "";  //批次名称
    param.minPieceValue = $("input[name='faceValueStart']").val()|| "";//面值开始
    param.maxPieceValue = $("input[name='faceValueEnd']").val()|| "";//面值结束
    param.minStartTime =$("#startTimeF").val()|| "";//日期开始
    param.maxStartTime =$("#startTimeS").val()|| "";//日期结束
    param.minEndTime =$("#endTimeF").val()|| "";//日期开始
    param.maxEndTime =$("#endTimeS").val()|| "";//日期结束
    var tempCardState= $("select[name='state']").find("option:selected").val();
    if(tempCardState=="0"){
        tempCardState="";
    }
    console.log("tempCardState"+tempCardState);
    param.curStatus =tempCardState;//1:作废 2：可用 3：过期全部:不传值
    param.currentPage = curPage;
    param.numPerPage = 15;
    console.log(JSON.stringify(param) + " param.numPerPage");
    $.when(
        $.ajax({
            type: "post",
            url: "http://120.24.153.102:18004/manager/scoreCards/getActivityList",
            data: param,
            dataType: "json",
            beforeSend: function () {
                $('#dataCardBody').html("<tr><td height='100px' colspan='10' class='text-center'>数据加载中<img src='/img/load.gif' alt='' width='30px;' height='30px'></td></tr>");
            }
        }).promise()
    ).done(function (data) {
        if (data.code == 200) {
            //数据拼接
            var html = "";
            if (!data.activityList || data.activityList.length == 0) {
                $('#dataCardBody').html("<tr><td height='200px' colspan='10' class='text-center'>暂无数据</td></tr>");
                $("#productTabContent .pagination").hide();
                return false;
            }
            $("#productTabContent .pagination").show();
            List = data.activityList;
            $.each(data.activityList, function (i, val) {
                html += "<tr>";
                //编号
                html += "<td style='text-align:center;vertical-align:middle'>" +
                    "<span>" + val.id + "</span><br/>" +
                    "</td>";
                //批次名称
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.name + "</td>";
                //面值
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.pieceValue + "</td>";
                //数量
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.totalCount + "</td>";
                //已发放数量
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.SendCount + "</td>";
                //已充值数量
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.UsedCount + "</td>";
                //有效期
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.startTime + "至" + val.endTime + "</td>";
                //状态
                if (val.curStatus == 1) {
                    html += "<td style='text-align:center;vertical-align:middle;'>" + "作废" + "</td>";
                } else if (val.curStatus == 2) {
                    html += "<td style='text-align:center;vertical-align:middle;'>" + "可用" + "</td>";
                } else if (val.curStatus == 3) {
                    html += "<td style='text-align:center;vertical-align:middle;'>" + "过期" + "</td>";
                }
                // 创建时间
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.createTime + "</td>";
                //查看 作废
                if (val.curStatus == 2) {
                    html += "<td style='text-align:center;vertical-align:middle'>" +
                        "<a href='javascript:void(0)' class='see' > 查看</a>" + "<a href='javascript:void(0)' class='invalid' > 作废</a>" +
                        "</td>";
                } else if (val.curStatus == 1 || val.curStatus == 3) {
                    html += "<td style='text-align:center;vertical-align:middle'>" +
                        "<a href='javascript:void(0)' class='see'> 查看</a>" + "</td>";

                }


                html += "</tr>"


            });


            $("#dataCardBody").html(html);
            $("#productTabContent .pagination").off().createPage({
                pageCount: data.pagination.pageNumCount,
                current: curPage,
                backFn: function (p) {
                    console.log("current  + " + p);
                    curPage = p;
                    init(curPage);
                }
            });

        } else {

            console.log(data.desc)
        }

    }).fail(function (error) {
        console.log("请求失败");
    })


}
//每个条目的查看的网络请求
function batchcartlist(curPage, activityId) {
    var param = {};

        param.cardName = $("input[name='cardNumber']").val() || "";
        param.cardPsd = $("input[name='cardPwd']").val() || "";
        param.sendStatus = $("select[name='giveOutState']").find("option:selected").val() || "";
        param.rechargeStatus = $("select[name='payState']").find("option:selected").val() || "";
        param.rechargeAccount = $("input[name='cardAccount']").val() || "";
    param.currentPage = curPage;
    param.numPerPage = 20;
    param.activityId = activityId;
    tempParam = param;
    $.when(
        $.ajax({
            type: "post",
            url: "http://120.24.153.102:18004/manager/scoreCards/getActivityCardsList",
            data: param,
            dataType: "json",
            beforeSend: function () {
                $('#NewCardBody').html("<tr><td height='100px' colspan='10' class='text-center'>数据加载中<img src='/img/load.gif' alt='' width='30px;' height='30px'></td></tr>");
                $("#query .pagination").hide();
            }
        }).promise()
    ).done(function (data) {
        if (data.code == 200) {
            //数据拼接
            var html = "";
            if (!data.cardList || data.cardList.length == 0) {
                $('#NewCardBody').html("<tr><td height='200px' colspan='10' class='text-center'>暂无数据</td></tr>");
                $("#query .pagination").hide();
                return false;
            }
            $("#query .pagination").show();
            $.each(data.cardList, function (i, val) {
                html += "<tr>";

                //卡号
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.cardName + "</td>";
                //卡密
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.cardPsd + "</td>";
                //发放状态
                if (val.sendStatus==0){
                    html += "<td style='text-align:center;vertical-align:middle;'>" + "未发放" + "</td>";
                }else {
                    html += "<td style='text-align:center;vertical-align:middle;'>" + "已发放" + "</td>";
                }
                //充值账号
                if (!val.rechargeAccount||val.rechargeAccount.length==0){
                    html += "<td style='text-align:center;vertical-align:middle;'>" + ""+ "</td>";
                }else {
                    html += "<td style='text-align:center;vertical-align:middle;'>" + val.rechargeAccount + "</td>";

                }
                //充值时间
                html += "<td style='text-align:center;vertical-align:middle;'>" + val.rechargeTime + "</td>";



                html += "</tr>"
            });


            $("#NewCardBody").html(html);
            $("#query .pagination").off().createPage({
                pageCount: data.pagination.pageNumCount,
                current: curPage,
                backFn: function (p) {
                    console.log("current  + " + p);
                    curPage = p;
                    batchcartlist(curPage, activityId);
                }
            });

        } else {

            console.log(data.desc)
        }

    }).fail(function (error) {
        console.log("请求失败");
    })


}

//每个条目作废的网络请求
function invalidOne(activityId,pwd) {
    var param = {};

    param.activityId = activityId;
    param.psd = pwd;
    // param.psd=111111;
    $.when(
        $.ajax({
            type: "post",
            url: "http://120.24.153.102:18004/manager/scoreCards/invalidOneActivity",
            data: param,
            dataType: "json",

        }).promise()
    ).done(function (data) {
        if (data.code == 200) {

            //作废成功
            alert("作废成功");
            //刷新积分卡界面所有批次的列表
            init(tempCurPage);
        } else {
            alert("作废失败");
            console.log(data.desc)
        }
        $("#useless").modal("hide");

    }).fail(function (error) {
        console.log("请求失败");
        alert("请求失败");
        $("#useless").modal("hide");
    })


}


//导出 密码校验成功->导出
function showVerifyPwdDialog(activityId) {

    $("#verifyPwd").modal('show');
    $("#pwdEnsure").off().on("click", function () {

        var param = {};
        var pwdTemp = $("input[name='verifyPwdName']").val() || ""
        param.password = pwdTemp;
        console.log("activityId"+activityId);
        exportExcel(activityId, pwdTemp);


    });
    $("#pwdCancel").on("click", function () {

        $("#verifyPwd").modal('hide');

    })


}
function exportExcel(activityId, pwdTemp) {
    var param = {};
    param.activityId = activityId;
    param.psd = pwdTemp;
        param.cardName = tempParam.cardName;
        param.cardPsd = tempParam.cardPsd;
        param.sendStatus = tempParam.sendStatus;
        param.rechargeStatus = tempParam.rechargeStatus;
        param.rechargeAccount = tempParam.rechargeAccount;
    $.when(
        $.ajax({
            type: "post",
            url: "http://120.24.153.102:18004/manager/scoreCards/exportExcelByqueryCards",
            data: param,
            dataType: "json",

        }).promise()
    ).done(function (data) {
        if (data.code == 200) {
            //alert( "请求成功了"+data.path);

            var tempExportPath="http://120.24.153.155/"+data.path;
            console.log("tempExportPath"+tempExportPath);
            $("#verifyPwd").modal('hide');
            window.location.href=tempExportPath;


        } else {
            alert("--------------"+data.desc);
            console.log(data.desc)
        }

    }).fail(function (error) {
        alert("请求失败");
    })

}

//定向充值
function directionRecharge(activityId, filePath, password) {
    var param = {};

    param.filePath = filePath;
    param.activityId = activityId;
    param.password = password;
    $.when(
        $.ajax({
            type: "post",
            url: "http://120.24.153.102:18004/manager/scoreCards/directionRecharge",
            data: param,
            dataType: "json",

        }).promise()
    ).done(function (data) {
        if (data.code == 200) {

            alert("成功个数" + data.sucessNum + "    " + "失败个数" + data.failedNum);
            //充值成功后 最外面的数据刷新  保持原来选择的当前页
            init(tempCurPage);
            //充值的网络请求执行完毕后  刷新查看的查询结果  选择第一页
            batchcartlist(1,activityId);
            //弹出的定向充值的提示框消失
            $("#selectfile").modal('hide');
        } else {
            alert(data.desc);
            console.log(data.desc)
        }
        $("#rechargesure").attr("disabled", false);


    }).fail(function (error) {

        console.log("请求失败");
        alert("请求失败");
        $("#rechargesure").attr("disabled", false);

    })


}





$(document).ready(function () {

    init(1);
    $("#search").on("click", function () {
        init(1);

    })

    $("#new").on("click", function () {

        $("#reviewModal").modal('show');
        $("#newCardBatch label.error").hide();
        $("#newBatchName").val("");
        $("#newFaceValue").val("");
        $("#newIntegrationCount").val("");
        $("#validityFir").val("");
        $("#validitySec").val("");
        $("input[type='radio']").removeAttr('checked');
        $('#newCardBatch').validate({
            errorPlacement: function (error, element) {
                var eid = element.attr('name'); //获取元素的name属性
                if (element.is(':radio')) { //如果是radio或checkbox
                    error.appendTo(element.parent()); //将错误信息添加当前元素的父结点后面
                }else if(element.is("#newFaceValue")){
                    error.appendTo(element.parent());
                }else if(element.is("#newIntegrationCount")){
                    error.appendTo(element.parent());
                }else {
                    error.insertAfter(element);
                }
            },
            onfocusout: function (element) {
                $(element).valid();
            },

            rules: {
                newBatchName: {
                    required: true,
                    minlength: 1,
                    maxlength: 40

                },
                newFaceValue: {
                    required: true,
                    digits: true,
                    min: 1,
                    max: 100000
                },
                newIntegrationCount: {
                    required: true,
                    digits: true,
                    min: 1,
                    max: 5000
                },
                pay: {
                    required: true
                },
                payNumber: {
                    required: true
                },
                validityFir: {
                    required: true
                },
                validitySec: {
                    required: true
                }
            },
            messages: {
                newBatchName: {
                    required: '批次名称需为1-40字符',
                    minlength: "批次名称需为1-40字符",
                    maxlength: "批次名称需为1-40字符"
                },
                newFaceValue: {
                    required: "面值需为1-100000的整数",
                    digits: "面值需为1-100000的整数",
                    min: "面值需为1-100000的整数",
                    max: "面值需为1-100000的整数"
                },
                newIntegrationCount: {
                    required: "数量需为1-5000的整数",
                    digits: "数量需为1-5000的整数",
                    min: "数量需为1-5000的整数",
                    max: "数量需为1-5000的整数"
                },
                pay: {
                    required: "请选择充值方式"
                },
                payNumber: {
                    required: "请选择是否允许单个账号多次充值"
                },
                validityFir: {
                    required: "请选择开始时间"
                },
                validitySec: {
                    required: "请选择结束时间"
                }


            },
            success: "valid"
        });

        $("#createCardBatch").off().click(function () {

           var tempBatchName= $("input[name='cardNumber']").val().trim();
            if(tempBatchName.length==0){
                tempBatchName.value="";
            }
            $("#createCardBatch").attr("disabled", true);
            var isValidSuccess=$("#newCardBatch").valid();
            if(!isValidSuccess){
                $("#createCardBatch").attr("disabled", false);
                return ;
            }
            var tempValiditySec = $("input[name='validitySec']").val();
            var tempValidityFir = $("input[name='validityFir']").val();
            if (tempValiditySec.length > 0 && tempValidityFir.length > 0) {
                var beginTimes = tempValidityFir.substring(0, 10).split('-');
                var endTimes = tempValiditySec.substring(0, 10).split('-');
                beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + tempValidityFir.substring(10, 19);
                endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + tempValiditySec.substring(10, 19);
                var time = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
                if (time <= 0) {
                    alert("结束时间需晚于开始时间");
                    $("#createCardBatch").attr("disabled", false);
                    return;
                }
            }
            //打开时默认清空里面所有的数据
            var param = {};
            param.name = $("input[name='newBatchName']").val() || "";
            param.pieceValue = $("input[name='newFaceValue']").val() || "";
            var temp = $("#newIntegrationCount").val();
            var totalCount = parseInt(temp)
            param.totalCount = totalCount;
            var startTime = $("#validityFir").val();
            var endTime = $("#validitySec").val();
            param.startTime = startTime;
            param.endTime = endTime;
            if (document.getElementById("rechargeAuto").checked) {
                param.rechargeType = "1";
            }
            if (document.getElementById("rechargeHand").checked) {
                param.rechargeType = "0";
            }
            if (document.getElementById("isMultiRechargeEnable").checked) {
                param.multiRechargeEnable = "0"
            }
            if (document.getElementById("multiRechargeEnable").checked) {
                param.multiRechargeEnable = "1";
            }
            $.when(
                $.ajax({
                    type: "post",
                    url: "http://120.24.153.102:18004/manager/scoreCards/createOneActivity",
                    data: param,
                    dataType: "json",


                }).promise()
            ).done(function (data) {
                if (data.code == 200) {
                    $("#reviewModal").modal('hide');
                    init(1);
                    $("#createCardBatch").attr("disabled", false);
                }
                else {
                    console.log(data.desc);
                    $("#createCardBatch").attr("disabled", false);
                }

            }).fail(function (error) {
                console.log("请求失败");
            })

        });



    })

    //点击对应条目的查看
    $("#dataCardBody").on("click", "a.see", function () {
        var index = $(this).parents("tr").index();
        //批次名称 充值方式  单账号是否允许多次充值
        document.getElementById("batchActivityName").innerHTML=" 批次名称:"+List[index].name;
        if(List[index].rechargeType==1){
            document.getElementById("batchActivityRechargeWay").innerHTML="自动";
        }else{
            document.getElementById("batchActivityRechargeWay").innerHTML="手动";
        }
        if(List[index].multiRechargeEnable==0){
            document.getElementById("batchActivityAllowMul").innerHTML=("允许单个账号多次充值");
        }else{
            document.getElementById("batchActivityAllowMul").innerHTML=("不允许单个账号多次充值");
        }
        $("#query").modal('show');
        //将值进行清空
        $("#cardNumber").val("");
        $("#cardPwd").val("");
        $("#cardAccount").val("");
        document.getElementById("payState")[0].selected=true;
        document.getElementById("giveOutState")[0].selected=true;

        //定向充值按钮应该只有在 可用、自动 的状态下才可以点
        if (List[index].rechargeType==1&&List[index].curStatus==2){
            $("#orientRecharge").removeClass('btn_disable');
            isCanClick=true;
        }else{
            //定向充值按钮置灰
            $("#orientRecharge").addClass('btn_disable');
            //设置不可点击的标志位
            isCanClick=false;
        }



        batchcartlist(1, List[index].id);

        //点击查看的弹出框里面的查询 true的时候params才会添加查询的条件作为参数
        $("#queryCardMes").off().on("click", function () {
            batchcartlist(1, List[index].id);
        })
        //点击导出
        $("#exportMes").off().on("click", function () {
            $("#verifyPwdName").val("");
            showVerifyPwdDialog(List[index].id);
        })
        //点击定向充值
        $("#orientRecharge").off().on("click", function () {
            if (isCanClick){//可以点击
                // directionRecharge(List[index].id);
                $("#selectfile").modal('show');
                //给密码框置空
                $("#rechargePwdName").val("");

                $("#thelist").html("");
                //给存放定向充值的文件路径的tempPath置空  防止下次进来 没有选择excel文件直接点击确定 还充值上次的excel文件
                tempPath = "";
            }else {
                //不可点击状态下 不执行任何操作
            }

        })
        //点击定向充值里的确定按钮
        $("#rechargesure").off().on("click", function () {
            // 确定按钮不可点  防止用户在网络请求期间多次点击
            $("#rechargesure").attr("disabled", true);

            var name = $("#rechargePwdName").val();
            if (!name) {
                alert("密码不能为空");
                return false;
            }
            if (!tempPath) {
                alert("请选择文件");
                return false;
            }

            directionRecharge(List[index].id, tempPath, name);


        })
        //点击定向充值里的取消按钮
        $("#rechargecancel").on("click", function () {
            $("#selectfile").modal('hide');



        })

        //以下为输入框失去焦点的时候 触发请求网络
        //按照卡号查询
        $("#cardNumber").blur(function () {
            batchcartlist(1, List[index].id);
        })
        //按照卡密查询
        $("#cardPwd").blur(function () {
            batchcartlist(1, List[index].id);
        })
        //按照支付账号查询
        $("#cardAccount").blur(function () {
            batchcartlist(1, List[index].id);
        })

    })
    //点击对应条目的作废
    $("#dataCardBody").on("click", "a.invalid", function () {
        //给密码框置空
        $("#invalidPwd").val("");
        $("#useless").modal('show');
        var index = $(this).parents("tr").index();
        $("#cancel").on("click", function () {
            $("#useless").modal("hide");
        })
        $("#sure").off().on("click", function () {
            var tempPwd=$("#invalidPwd").val()||"";
            invalidOne(List[index].id,tempPwd);
        })
    })

    //



})
var $list = $('.uploader-list');
// 初始化Web Uploader
var uploader = WebUploader.create({
    // 选完文件后，是否自动上传。
    auto: true,
    // swf文件路径
    swf: "/js/Uploader.swf",
    // 文件接收服务端。
    server: "http://120.24.153.102:3000/system/uploadFiles/",
    fileVal: "Filedata",
    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    // pick: '#picker',
    pick: {
        id: '#picker',
        multiple: false //默认为true，就是可以多选
    },
    //限制只能上传一个文件
    fileNumLimit: 1,
    //是否允许重复上传
    duplicate: true,
    // 只允许选择excel表格文件。
    accept: {
        title: 'intoTypes',
        extensions: 'xls,xlsx',
        mimeTypes: '.xls,.xlsx'
    }


});
// 当有文件被添加进队列的时候
uploader.on('fileQueued', function (file) {
    //将file.id赋值给变量tempId 方便点击取消按钮或点击确定按钮充值成功后 将此div删除
    tempId = file.id;
    $list.html('<div id="' + file.id + '" class="item">' +
        '<h4 class="info">' + file.name + '</h4>' +
        '<p class="state">等待上传...</p>' +
        '</div>');
});

// 文件上传过程中创建进度条实时显示。
uploader.on('uploadProgress', function (file, percentage) {
    var $li = $('#' + file.id),
        $percent = $li.find('.progress .progress-bar');

    // 避免重复创建
    if (!$percent.length) {
        $percent = $('<div class="progress progress-striped active">' +
            '<div class="progress-bar" role="progressbar" style="width: 0%">' +
            '</div>' +
            '</div>').appendTo($li).find('.progress-bar');
    }

    $li.find('p.state').text('上传中');

    $percent.css('width', percentage * 100 + '%');
});
uploader.on('uploadSuccess', function (file, response) {
    $('#' + file.id).find('p.state').text('已上传');
    // //将上传的excel的文件路径 赋值给变量
    tempPath = "http://120.24.153.102:3000/system/v1/jfs_image/" + response.title;
});

uploader.on('uploadError', function (file) {
    $('#' + file.id).find('p.state').text('上传出错');
});


// 完成上传完了，成功或者失败，先删除进度条。
uploader.on('uploadComplete', function (file) {
    $('#' + file.id).find('.progress').remove();
});



