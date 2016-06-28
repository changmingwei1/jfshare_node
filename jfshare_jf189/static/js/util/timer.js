/*
 * Created by lilx on 2015/11/8.
 * 时间工具类
*/

//region 时间倒计时控件
/**
 * 时间倒计时控件
 * 依赖jquery
 * <div id="sec_left_1" class="time_left_1" style="display: none;">1446706873000,1446706873962</div>
 <div id="sec_tip_o_common_2351929" style="color:#04ab00;">距离订单取消还有<br><i id="dday1">0</i>天<i id="dhour1">0</i>小时<i id="dminite1">0</i>分钟<i id="dsecond1">0</i>秒</div>
 <span class="s3" id="orderListTime_1" val="o_common_2351929"></span>

 使用说明： initCountDownTime1();
            页面参数  [sec_left_i]第i个计时控件项  [time_left_1]计时class标识
                      [1446706873000,1446706873962] 计时起止long时间点，前面总是小于后面时间  [dayi ... secondi] 第i个计时时间项
            业务参数 [orderListTime_i] 第i个主键id 用于计时结束时获取业务组件的处理工作
 */

var secd = new Array(); //每个需要计时控件的总秒数
/**
 * 初始化页面倒计时器
 */
function initCountDownTime1() {
    //循环所有需要计时控件
    jQuery('.time_left_1').each(function() {
        var jobj = $(this);
        var SysSecond = (jobj.text());
        var splitTime=SysSecond.split(",");
        var time0 = parseInt(splitTime[0]);//计时开始时间点(long)
        var time1= parseInt(splitTime[1]); //计时结束时间点（long）
        var time = (time1 - time0) / 1000; //需要计时秒数
        var theid = parseInt((jobj.attr('id')).replace(/sec_left_/, '')); //需要计时控件序号
        if(time>0){
            secd[theid] = time;
        }else if(time<=0){
            $("#orderListTime_"+theid).hide(); //埋下的待计时订单id
        }
    });
}

function setRemainCountDownTime1() {
    for (var i in secd) {
        setRemainCountDownTimeSite1(i);
    }
}
function setRemainCountDownTimeSite1(theid) {
    var SysSecond = secd[theid];
    //计时进行中
    if(SysSecond>0){
        var second = Math.floor(SysSecond % 60).toString();
        var minite = Math.floor((SysSecond / 60) % 60).toString();
        var hour = $("#dday"+theid) == null ? Math.floor(SysSecond / 3600).toString() : Math.floor((SysSecond / 3600) % 24).toString();
        var day = Math.floor((SysSecond / 3600) / 24).toString();
        if (day > 0 && day < 10) day = '0' + day;
        if (minite >= 0 && minite < 10) minite = '0' + minite;
        if (hour >= 0 && hour < 10) hour = '0' + hour;
        if (second >= 0 && second < 10) second = '0' + second;

        $("#dday"+theid).html(day);
        $("#dhour"+theid).html(hour);
        $("#dminite"+theid).html(minite);
        $("#dsecond"+theid).html(second);
        secd[theid]--;
    } else if(SysSecond<=0){   //计时结束
        afterTimeCountDown(theid); //钩子程序，计时结束事件
    }
}
var remainCountDown1 = window.setInterval(setRemainCountDownTime1, 1000); //按每秒执行

/**
 * 倒计时结束后事件
 * @param theid 计时组件序号， 同sec_left_i中的i
 */
function afterTimeCountDown(theid) {
    //特殊业务，隐藏相关控件
    var orderId=$("#orderListTime_"+theid).attr("val"); //获取埋下的订单id
    $("#orderListTime_"+theid).remove(); //移除订单标记
    $("#sec_tip_"+orderId).remove(); //移除计时标记
    $(".ele_"+orderId).remove(); //移除我要付款
    $("#cancel_"+orderId).remove(); //移除取消订单
    $("#proState_"+orderId).html("已取消"); //修改订单状态文字
}
//endregion 时间倒计时控件

//region 时钟计时控件
/**
 * 时钟控件
 * 依赖jquery
 * <div id="sec_gone_1" class="time_gone_1" style="display: none;">1446706873000,1446706873962</div>
 <div id="sec_gone_tip_o_common_2351929" style="color:#04ab00;">当前时间<br><i id="ayear1">0</i>年<i id="amonth1">0</i>月<i id="aday1">0</i>日
 <i id="ahour1">0</i>时<i id="aminite1">0</i>分<i id="asecond1">0</i>秒</div>
 <span class="s3" id="orderListTime_1" val="o_common_2351929"></span>

 使用说明： initTiming1();
 页面参数  [sec_gone_i]第i个计时控件项  [time_gone_1]计时class标识
 [1446706873000,1446706873962] 计时起止long时间点，前面总是小于后面时间  [dayi ... secondi] 第i个计时时间项
 业务参数 [orderListTime_i] 第i个主键id 用于计时结束时获取业务组件的处理工作
 */

var seca0 = new Array(); //每个需要计时控件的开始时间
var seca1 = new Array(); //每个需要计时控件的结束时间
/**
 * 初始化页面时钟
 */
function initTiming1() {
    //循环所有需要计时控件
    jQuery('.time_gone_1').each(function() {
        var jobj = $(this);
        var SysSecond = (jobj.text());
        var splitTime=SysSecond.split(",");
        var time0 = parseInt(splitTime[0]);//计时开始时间点(long)
        var time1= parseInt(splitTime[1]); //计时结束时间点（long）
        var time = (time1 - time0) / 1000; //需要计时秒数
        var theid = parseInt((jobj.attr('id')).replace(/sec_gone_/, '')); //需要计时控件序号
        if(time>0){
            seca0[theid] = time0;
            seca1[theid] = time1;
        }else if(time<=0){
            $("#orderListTime_"+theid).hide(); //埋下的待计时订单id
        }
    });
}

function setRemainTimingTime1() {
    for (var i in seca0) {
        setRemainTimingTimeSite1(i);
    }
}

function setRemainTimingTimeSite1(theid) {
    var SysSecond = seca0[theid];
    //计时进行中
    if(SysSecond < seca1[theid]){
        var sysDate = new Date(SysSecond);
        var second = sysDate.getSeconds().toString();
        var minite = sysDate.getMinutes().toString();
        var hour = sysDate.getHours().toString();
        var day = sysDate.getDate().toString();
        var month = (sysDate.getMonth() + 1).toString();
        var year = sysDate.getFullYear().toString();
        if (month >0 && month < 10) month = '0' + month;
        if (day > 0 && day < 10) day = '0' + day;
        if (minite >= 0 && minite < 10) minite = '0' + minite;
        if (hour >= 0 && hour < 10) hour = '0' + hour;
        if (second >= 0 && second < 10) second = '0' + second;

        $("#ayear"+theid).html(year);
        $("#amonth"+theid).html(month);
        $("#aday"+theid).html(day);
        $("#ahour"+theid).html(hour);
        $("#aminite"+theid).html(minite);
        $("#asecond"+theid).html(second);
        seca0[theid] = seca0[theid] + 1000;
    } else if(SysSecond>=seca1[theid]){   //计时结束
        afterTimeTiming(theid); //钩子程序，计时结束事件
    }
}
var remainTiming1 = window.setInterval(setRemainTimingTime1, 1000); //按每秒执行

/**
 * 计时结束后事件
 * @param theid 计时组件序号， 同sec_left_i中的i
 */
function afterTimeTiming(theid) {
    //特殊业务，隐藏相关控件
    var orderId=$("#orderListTime_"+theid).attr("val"); //获取埋下的订单id
    $("#orderListTime_"+theid).remove(); //移除订单标记
    $("#sec_gone_tip_"+orderId).remove(); //移除计时标记
    $(".ele_"+orderId).remove(); //移除我要付款
    $("#cancel_"+orderId).remove(); //移除取消订单
    $("#proState_"+orderId).html("已取消"); //修改订单状态文字
}
//endregion 时钟计时控件

