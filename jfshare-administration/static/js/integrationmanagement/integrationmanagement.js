/**
 * Created by Administrator on 2016/5/7.
 */
    //分页插件
(function($){
    var ms = {
        init:function(obj,args){
            return (function(){
                ms.fillHtml(obj,args);
                ms.bindEvent(obj,args);
            })();
        },
        //填充html
        fillHtml:function(obj,args){
            return (function(){
                obj.empty();
                //上一页
                if(args.current > 1){
                    obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
                }else{
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+1+'</a>');
                }
                if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
                    obj.append('<span>...</span>');
                }
                var start = args.current -2,end = args.current+2;
                if((start > 1 && args.current < 4)||args.current == 1){
                    end++;
                }
                if(args.current > args.pageCount-4 && args.current >= args.pageCount){
                    start--;
                }
                for (;start <= end; start++) {
                    if(start <= args.pageCount && start >= 1){
                        if(start != args.current){
                            obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
                        }else{
                            obj.append('<span class="current">'+ start +'</span>');
                        }
                    }
                }
                if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
                    obj.append('<span>...</span>');
                }
                if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
                    obj.append('<a href="javascript:;" class="tcdNumber">'+args.pageCount+'</a>');
                }
                //下一页
                if(args.current < args.pageCount){
                    obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
                }else{
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                }
            })();
        },
        //绑定事件
        bindEvent:function(obj,args){
            return (function(){
                obj.on("click","a.tcdNumber",function(){
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });
                //上一页
                obj.on("click","a.prevPage",function(){
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current-1);
                    }
                });
                //下一页
                obj.on("click","a.nextPage",function(){
                    var current = parseInt($(this).siblings("span.current").text());
                    ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current+1);
                    }
                });
            })();
        }
    };
    $.fn.createPage = function(options){
        var args = $.extend({
            pageCount : 10,
            current : 1,
            backFn : function(){}
        },options);
        ms.init(this,args);
    }
})($);
    var $cellphone = $("#cellphone");  //手机号
    var $regtime = $("#regtime"); //注册时间
    var $dataTbody = $("#dataTbody");//获取表格
    var $integration = $("#integration");//积分值
    var $search = $("#search");//新增商家按钮

    var $reviewModal=$("#reviewModal");  //积分信息模态窗口
    var $datatime = $("#datatime"); //模态窗口里的交易时间
    var $datatype = $("#datatype");//模态窗口里的交易类型
    var $trade = $("#trade");      //模态窗口里的交易出入
    var $tradeSearch = $("#tradeSearch");//模态窗口按钮
    var $tradedataTbody = $("#tradedataTbody");//获取表格

    var list=null;
    var spinner = new Spinner(opts);
    //window.localStorage.setItem("sellerId",rdata.user.userId);
    userId=window.localStorage.getItem("managerId");
    var beginTime=null;
    var endTime=null;
    var infocurpage=1;
    var listcurPage=1;
var magId=window.localStorage.getItem("managerId");
var domain="http://proxy.jfshare.com"       //域名

$('.date-picker').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    language: "zh-CN",
    todayHighlight: true,
    orientation: "bottom auto",
    autoclose: true
});


    /*初始化加载积分信息  时间问题和按钮问题(未)*/
    init(1);
    function init(currage){
        var $cellphoneVal=$cellphone.val();
        var amount=$integration.val();
        var startTime = $("#startTime").val();
        if(startTime&&startTime.length>0){
            startTime=startTime+" 00:00:00"
        }
        var endTime =  $("#endTime").val();
        if(endTime&&endTime.length>0){
            endTime=endTime+" 23:59:59"
        }
        listcurPage=currage;

        var percount=50;
        var url=domain+"/manager/score/socrelist";
        var html="";


        $.ajax({
            url:url,
            type:"post",
            data:{mobile:$cellphoneVal,startTime:startTime,endTime:endTime,amount:amount,
                curpage:currage, percount: percount
            },
            dataType:"json",
            async: false,
            beforeSend:function() {
                $dataTbody.html("<tr><td height='200px' colspan='4' class='text-center'>数据加载中</td></tr>");
                var target = $dataTbody.find("tr").find("td").get(0);
                spinner.spin(target);
            },
            complete:function() {
                spinner.spin();
            },

            success:function(data){
                console.log(data);
                list=data.scoreList;
                $dataTbody.empty();
                if(!list){
                    $(".pagination").hide();
                    html += "<td style='height:200px;width:100%;font-size:14px;text-align: center' colspan='4'>"
                    html += "暂无数据"
                    html += "</td>"
                    $dataTbody.html(html);
                    return false;
                }
                $(".pagination").show()
                $.each(list,function(i,val){
                    html +="<tr>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.mobile+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.createTime+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;'>"+val.amount+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;'><a href='javascript:void(0)' class='integrationChange'>积分变化明细</a></a></td>";
                    html +="</tr>";
                });
                $dataTbody.html(html);
                $(".pagination").off().createPage({
                    pageCount:data.page.pageCount,
                    current:listcurPage,
                    backFn:function(p){
                        init(p)
                    }
                });
            }


        });
    }


    /*点击积分变化明细*/
    $dataTbody.on("click","a.integrationChange",function(){
        var index = $(this).parents("tr").index();
         userId = list[index].userId;
         sendintegration(1);
    });


        function sendintegration(pagenum) {
            infocurpage=pagenum;
            var scoretype=$("#datatype").val();
            var inorout=$("#trade").val();
            var startTime = $("#infostartTime").val();
            if(startTime&&startTime.length>0){
                beginTime=startTime+" 00:00:00"
            }
            var endTime =  $("#infostartTime").val();
            if(endTime&&endTime.length>0){
                endTime=endTime+" 23:59:59"
            }
            var percount = 50;
            var data = {};
            var html = "";
            var url = domain+"/manager/score/scoreinfolist";
            data = {
                beginTime:beginTime,endtime:endTime,inOrOut:inorout,
                userId: userId, curpage: infocurpage, percount: percount,scoreType:scoretype
            };
            $reviewModal.modal("show");
            $.ajax({
                url: url,
                type: "post",
                data: data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    var scoreList = data.scoreList;
                    if(!scoreList || scoreList.length==0){
                        $(".pagination").hide();
                        html += "<tr>";
                        html += "<td style='text-align: center; vertical-align: middle' colspan='6'>暂无数据</td>";
                        html += "</tr>";
                        $tradedataTbody.html(html);
                        return false;
                    }
                    $.each(scoreList, function (i, val) {
                        $(".pagination").show();
                        html += "<tr>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.id + "</td>";
                        html += "<td style='text-align: center; vertical-align: middle'>" + val.createtime + "</td>";
                        if (val.type == 1) {
                            html += "<td style='text-align: center; vertical-align: middle;'>收入</td>";
                        } else {
                            html += "<td style='text-align: center; vertical-align: middle;'>支出</td>";
                        }
                        if (val.scoretype == 1) {
                            html += "<td style='text-align: center; vertical-align: middle;'>电信积分兑入</td>";
                        } else if (val.scoretype == 2) {
                            html += "<td style='text-align: center; vertical-align: middle;'>兑换电信积分</td>";
                        } else if (val.scoretype == 3 || val.scoretype == 4) {
                            html += "<td style='text-align: center; vertical-align: middle;'>消费抵扣</td>";
                        } else if (val.scoretype == 5) {
                            html += "<td style='text-align: center; vertical-align: middle;'>消费赠送</td>";
                        } else if (val.scoretype == 6) {
                            html += "<td style='text-align: center; vertical-align: middle;'>活动赠送</td>";
                        }else if (val.scoretype == 7) {
                            html += "<td style='text-align: center; vertical-align: middle;'>返还支付积分</td>";
                        }else if (val.scoretype == 8) {
                            html += "<td style='text-align: center; vertical-align: middle;'>扣减赠送积分</td>";
                        }
                        html += "<td style='text-align: center; vertical-align: middle;'>" + val.value + "</td>";
                        if (val.remark == 1) {
                            html += "<td style='text-align: center; vertical-align: middle;'>中国电信</td>";
                        } else if (val.remark == 2) {
                            html += "<td style='text-align: center; vertical-align: middle;'>老树咖啡</td>";
                        } else if (val.remark == 3) {
                            html += "<td style='text-align: center; vertical-align: middle;'>聚分享商城</td>";
                        } else if (val.remark == 3) {
                            html += "<td style='text-align: center; vertical-align: middle;'>聚分享手机商城</td>";
                        }
                        html += "</tr>";
                        //$trade.val(val.type);
                        //$datatype.val(val.scoretype)
                    });
                    $tradedataTbody.html(html);
                    doInfoPagination(data.page,infocurpage);
                }
            })
        }

function doInfoPagination(paginationData,infocurPage){
    if($("#tradepagination")){

        counts = paginationData.pageCount;
        var currentpage = infocurPage;
        var pagehtml="";
        if(counts==1){
            pagehtml+="<li><a href='javascript:sendintegration(1)'>1</a></li>";
            pagehtml+="<li><a href='javascript:sendintegration(1)'>共1页</a></li>";
        }
        //大于一页内容
        if(counts>1){
            if(currentpage>1){
                pagehtml+= '<li><a href="javascript:sendintegration('+(currentpage-1)+');">上一页</a></li>';
            }
            for(var i=0;i<counts;i++){
                if(i>=(currentpage-counts) && i<(currentpage+counts)){
                    if(i==currentpage-1){
                        pagehtml+= '<li class="active"><a href="javascript:sendintegration('+(i+1)+');">'+(i+1)+'</a></li>';
                    }else{
                        pagehtml+= '<li><a href="javascript:sendintegration('+(i+1)+');">'+(i+1)+'</a></li>';
                    }

                }
            }
            if(currentpage<counts){
                pagehtml+= '<li><a href="javascript:sendintegration('+(currentpage+1)+');">下一页</a></li>';
            }
        }
        $("#tradepagination").html(pagehtml);
    }
}





$tradeSearch.on("click",function(){
        sendintegration(1);
    });


    function getTime(time){
        time=parseInt(time);
        var now = new Date();
        var year = now.getFullYear();
        var month =now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var Minutes =now.getMinutes();
        var second = now.getSeconds();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }

        beginTime = year +""+month+""+day +""+ hour +""+ Minutes +""+second;


        if(time>0&&time<=2){
            time=time%2==0 ? 3 : 1;
            day=day+(time);
            console.log(day)
        }else if(time>2&&time<=4){
            time=time%2==0 ? 3 : 1;
            day=day+time*7;
            console.log(day);
            if(day>=30){
                month=month+1;
                day=day-30;
                day=day<10?("0"+day):day
            }
            console.log(day)
        }else if(time>4&&time<=6){
            time=time%2==0 ? 3 : 1;
            month=month+time;
        }

        endTime = year +""+month+""+day +""+ hour+""+ Minutes+""+second;
        console.log(beginTime);
        console.log(endTime)

    }


   $("#search").on("click",function(){
       init(1);
})

