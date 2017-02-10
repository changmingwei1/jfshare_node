/**
 * Created by Administrator on 2016/5/4.
 */
$(function(){
    var $confirm=$("#confirm");
    var $cancel=$("#cancel");
    var $dataTbody=$("#dataTbody");
    var $messagetitle=$("#messagetitle");//获取消息id
    var $orderStatus=$("#orderStatus option:selected");//获取select下拉框id
    var $search=$("#search");
    var $messagetitleModal=$("#messagetitleModal");
    var $messagecontent=$("#messagecontent");
    var $begintime=$("#begintime");
    var $endtime=$("#endtime");
    var $add=$("#add");
    var arr=null;
    var $reviewModal=$("#reviewModal");
    var spinner = new Spinner(opts);
    var id=0;
    var List;
    var isadd=false;
    var issee=false;
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

    /*初始化加载信息*/
    initmessage();
    $update=$(".update");

    /*初始化加载系统信息*/
    function initmessage(){
        var url=domain+"/manager/message/list";
        var curPage=1;//当前页
        var perCount=10;//每页显示数量
        var $messagetitleVal=$messagetitle.val();//消息标题
        var $orderStatusVal=$orderStatus.text();//下拉框选中的文本
        $.ajax({
            url:url,
            type:"POST",
            data:{title:$messagetitleVal,state:$orderStatusVal,curPage:curPage,perCount:perCount},
            dataType:"json",
            beforeSend:function() {
                $dataTbody.html("<tr><td height='200px' colspan='4' class='text-center'>数据加载中</td></tr>");
                var target = $dataTbody.find("tr").find("td").get(0);
                spinner.spin(target);
            },
            complete:function() {
                spinner.spin();
            },
            success:function(data){
                if(data.code==200){
                    showdata(data);
                }else{
                    alert("请求失败")
                }

            }

        });

        function showdata(data){
            var html="";
            console.log(data);
            if(data.code==200){
                var messagearr=data.messageList;
                List=data.messageList;
                $.each(messagearr,function(i,val){
                    html +="<tr>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.id+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.title+"</td>";
                    if(val.status==1){
                        html +="<td style='text-align: center; vertical-align: middle'>未开始</td>";
                        //html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='see'>查看</a>" +
                        html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='update'>编辑</a>" +
                        "<a href='javascript:void(0)' style='margin-left: 20px' class='del'>删除</a></td>";
                    }
                    else if(val.status==2){
                        html +="<td style='text-align: center; vertical-align: middle'>进行中</td>";
                        html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='update'>编辑</a>" +
                        "<a href='javascript:void(0)' style='margin-left: 20px' class='del'>删除</a></td>";
                    }else if(val.status==3){
                        html +="<td style='text-align: center; vertical-align: middle'>已过期</td>";
                        html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='see'>查看</a>"+
                        "<a href='javascript:void(0)' style='margin-left: 20px' class='del'>删除</a></td>";
                    }
                    html +="<td style='text-align: center; vertical-align: middle; display: none'>"+val.beginDate+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;display: none'>"+val.endDate+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;display: none'>"+val.content+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;display: none'>"+val.pushTarget+"</td>";
                    html +="</tr>";
                });

                $dataTbody.html(html);
            }

        }


    }


        ///*查找系统消息,需要messageId 实现有问题*/
        //$search.on("click",function(){
        //    var $messageId=null;
        //    var html="";
        //    var url="http://101.201.39.61:18004/manager/message/get";
        //    var $messagetitleVal=$messagetitle.val();
        //    console.log($messagetitleVal);
        //    var $td1=$("#dataTbody tr td:nth-child(2)");
        //    $.each($td1,function(i,val){
        //        console.log($td1[i].innerHTML);
        //        if($td1[i].innerHTML==$messagetitleVal){
        //            $messageId=$($td1[i]).prev().text();
        //        }
        //    });
        //    $.ajax({
        //        url:url,
        //        type:"post",
        //        data:{messageId:$messageId},
        //        dataType:"json",
        //        success:function(data){
        //            console.log(data);   /*得到返回值添加到table中*/
        //            $dataTbody.empty();  //先清空表格里的所有信息
        //            html +="<tr>";
        //            html +="<td style='text-align: center; vertical-align: middle'>"+data.message.id+"</td>";
        //            html +="<td style='text-align: center; vertical-align: middle'>"+data.message.title+"</td>";
        //            if(data.message.status==1){
        //                html +="<td style='text-align: center; vertical-align: middle'>已过期</td>";
        //                html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='see'>查看</a>" +
        //                "<a href='javascript:void(0)' style='margin-left: 20px' class='del'>删除</a></td>";
        //            }
        //            else if(data.message.status==2){
        //                html +="<td style='text-align: center; vertical-align: middle'>进行中</td>";
        //                html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='update'>编辑</a>" +
        //                "<a href='javascript:void(0)' style='margin-left: 20px' class='del'>删除</a></td>";
        //            }else if(data.message.status==3){
        //                html +="<td style='text-align: center; vertical-align: middle'>未开始</td>";
        //                html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='update'>编辑</a></td>";
        //            }
        //            html +="<td style='text-align: center; vertical-align: middle; display: none'>"+data.message.beginDate+"</td>";
        //            html +="<td style='text-align: center; vertical-align: middle;display: none'>"+data.message.endDate+"</td>";
        //            html +="<td style='text-align: center; vertical-align: middle;display: none'>"+data.message.content+"</td>";
        //            html +="</tr>";
        //           $dataTbody.html(html);
        //        }
        //    });
        //
        //
        //    if(!$messagetitleVal){
        //        initmessage();
        //    }
        //
        //});

         /*新增时打开模态，清空里面的所有信息*/
       $add.on("click",function(){
           $messagetitleModal.val('');
           $messagecontent.val("");
           $begintime.val('');
           $("#status").val('0');
           $endtime.val('');
           id=0;
           isadd=true;
           $reviewModal.modal("show");
       });


        /*新增系统消息*/
        $confirm.on("click",function(){
            var $messagetitleModalVal=$messagetitleModal.val();
            var $messagecontentVal=$messagecontent.val();
            var startTime=$begintime.val();
            var endTime=$endtime.val();

            if (startTime && startTime.length > 0) {
                startTime = startTime + " 00:00:00"
            } else {
                var time = getNowFormatDate();
                $("#startTime").val(time);
                startTime = time + " 00:00:00"
            }
            if (endTime && endTime.length > 0) {
                endTime = endTime + " 23:59:59"
            } else {
                var time = getNowFormatDate();
                $("#endTime").val(time);
                endTime = time + " 23:59:59"
            }
            var $status=$("#status").val();
            var pushTarget=$("#pushTarget input:checked").val();
            //arr=$("input[name='item']:checked").val();
            //console.log(arr)
            if($messagetitleModalVal!=""&&$messagecontentVal!=""&startTime!=""&&endTime!=""&&pushTarget!=""){
                if(isadd){
                    var data={title:$messagetitleModalVal,content:$messagecontentVal,beginDate:startTime,
                        endDate:endTime,pushTarget:pushTarget};
                    console.log(data);
                    add(data);
                }else{
                    if(issee){

                    }else{
                        var data={title:$messagetitleModalVal,content:$messagecontentVal,beginDate:startTime,
                            endDate:endTime,type:arr,id:id,pushTarget:pushTarget};
                        update(data);
                    }
                }
                $reviewModal.modal("hide");
                //sendDate(data);
            }else{
                alert("填写的信息都不能为空")
            }

        });

        /*编辑系统信息*/
        $dataTbody.on("click","a.update",function(){
            isadd=false;
            issee=false;
            $reviewModal.modal("show");
            var index=$(this).parents("tr").index();
            id=List[index].id;

            $messagetitleModal.val(List[index].title);
            $messagecontent.val(List[index].content);
            $begintime.val(List[index].beginDate);
            $endtime.val(List[index].endDate);
            $("input[value='"+List[index].pushTarget+"']").attr("checked",true);
            //if(List[index].pushTarget==0){
            //    $("input[name='item']:eq(0)").attr("checked",true);
            //}else{
            //    $("input[name='item']:eq(1)").attr("checked",true);
            //}
            $("#status").find("option[value="+List[index].status+"]").attr("selected",true)
        });

    /*查看系统信息*/
    $dataTbody.on("click","a.see",function(){
        isadd=false;
        issee=true;
        $reviewModal.modal("show");
        var index=$(this).parents("tr").index();
        id=List[index].id;

        $messagetitleModal.val(List[index].title);
        $messagecontent.val(List[index].content);
        $begintime.val(List[index].beginDate);
        $endtime.val(List[index].endDate);
        $("input[value='"+List[index].pushTarget+"']").attr("checked",true);
        //if(List[index].pushTarget==0){
        //    $("input[name='item']:eq(0)").attr("checked",true);
        //}else{
        //    $("input[name='item']:eq(1)").attr("checked",true);
        //}
        $("#status").find("option[value="+List[index].status+"]").attr("selected",true)
    });


        /*删除系统信息*/

        $dataTbody.on("click","a.del",function(){
            var url=domain+"/manager/message/delete";
            var messageId=$(this).parent().siblings().first().text();
            $.ajax({
                url:url,
                type:"post",
                data:{id:messageId},
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if(data.code==200){
                        alert("删除成功")
                    }else{
                        alert(data.desc)
                    }
                    initmessage();
                }

            });

        });


        /*关闭系统消息弹窗*/
        $cancel.on("click",function(){
            $("#reviewModal").modal("hide");
        });

    function add(data){
        var url=domain+"/manager/message/add";
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.code==200&&data){
                    alert("新增成功");
                    $reviewModal.modal("hide");
                    initmessage();
                    return false;
                }else{
                    alert(data.desc)
                }
            },
            error:function(){
                alert("请求失败")
            }

        })

    }

    function update(data){
        var url=domain+"/manager/message/update";
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.code==200&&data){
                    alert("更改成功");
                    $reviewModal.modal("hide");
                    initmessage();
                    return false;
                }else{
                    alert(data.desc)
                }
            },
            error:function(){
                alert("请求失败")
            }

        })

    }
        /*编辑和增加弹出模态窗口后,点击确定发送新增加的数据到后台*/
        function sendDate(data){
            var url=domain+"/manager/message/add";
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if(data.code==200&&data){
                        alert("新增成功");
                        $reviewModal.modal("hide");
                        return false;
                    }else{
                        alert(data.desc)
                    }
                },
                error:function(){
                    alert("请求失败")
                }

            })

        }

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        //var currentdate = year + seperator1 + month + seperator1 + strDate
        //    + " " + date.getHours() + seperator2 + date.getMinutes()
        //    + seperator2 + date.getSeconds();
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }






});
