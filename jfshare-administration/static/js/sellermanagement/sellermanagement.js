/**
 * Created by Administrator on 2016/5/5.
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
    var $sellername=$("#sellername");  //登录名称
    var $productnumber=$("#productnumber"); //商家账号
    var $dataTbody=$("#dataTbody");//获取表格
    var $searchBtn=$("#searchBtn");//获取查找按钮
    var $newproductclass=$("#newproductclass");//新增商家按钮

    /*弹出框*/
    var $comeanyname=$("#comeanyname"); //公司名称
    var $storename=$("#storename");     //店铺名城
    var $InfoAdress=$("#InfoAdress");   //详细地址
    var $linkman=$("#linkman");         //联系人
    var $phone=$("#phone");             //手机
    var $tel=$("#tel");                 //座机
    var $mail=$("#mail");               //邮箱
    var $bank=$("#bank");               //开户银行
    var $Accountname=$("#Accountname"); //户名
    var $AccountNumber=$("#AccountNumber");//账号
    var $login=$("#login");             //登录账号
    var $password=$("#password");       //登录密码
    var $qrpassword=$("#qrpassword");   //确认密码
    var $describe=$("#describe");       //备注描述
    var $conform=$("#conform");
    var $cancel=$("#cancel");

    var $provice=$("#provice");         //省
    var $city=$("#city");               //市
    var $county=$("#county");           //县

    /*弹出框隐藏的input*/
    var $AccountHide=$("#AccountHide");
    var $loginHide=$("#loginHide");
    var $passwordHide=$("#passwordHide");
    var $qrpasswordHide=$("#qrpasswordHide");


    var $reviewModal=$("#reviewModal");  //商家信息模态窗口
    var $PasswordModal=$("#PasswordModal"); //密码模态窗口
    var $Passwordconform=$("#Passwordconform");//密码框确认按钮
    var $Passwordcancel=$("#Passwordcancel");//密码框取消按钮

    var $newPassword=$("#newPassword");      //密码框确认新密码
    var $OnenewPassword=$("#OnenewPassword");//密码框再次确认新密码



    var curPage=1; //当前页
    var perCount=10; //每页显示数量
    var list=null;
    var sellerId=0;
    var spinner = new Spinner(opts);
var magId=window.localStorage.getItem("managerId");
var domain="http://proxy.jfshare.com"       //域名



    /*初始化加载商家信息列表和省,市,县列表*/
    init(1);
    provice();

    /*商家信息列表*/

    function init(listcurPage){
        var url=domain+"/manager/seller/list";
        var $sellernameVal=$sellername.val();
        var $productnumberVal=$productnumber.val();
        curPage=listcurPage;
        var html="";
        $.ajax({
            url:url,
            type:"post",
            data:{userName:$sellernameVal,loginName:$productnumberVal,curPage:curPage,perCount:perCount},
            dataType:"json",
            async: false,
            beforeSend:function() {
                $dataTbody.html("<tr><td height='200px' colspan='7' class='text-center'>数据加载中</td></tr>");
                var target = $dataTbody.find("tr").find("td").get(0);
                spinner.spin(target);
            },
            complete:function() {
                spinner.spin();
            },
            success:function(data){
                console.log(data);
                list=data.sellerList;
                $.each(list,function(i,val){
                    html +="<tr>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.sellerId+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle'>"+val.userName+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;'>"+val.loginName+"</td>";
                    if(val.contacts==null){
                        html +="<td style='text-align: center; vertical-align: middle;'></td>";
                    }else{
                        html +="<td style='text-align: center; vertical-align: middle;'>"+val.contacts+"</td>";
                    }
                    html +="<td style='text-align: center; vertical-align: middle;'>"+val.mobile+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;'>"+val.email+"</td>";
                    html +="<td style='text-align: center; vertical-align: middle;'><a href='javascript:void(0)' class='update'>编辑</a><a href='javascript:void(0)' class='ChangePassword' data-useName='"+val.userName+"' style='margin-left: 20px'>修改密码</a></td>";
                    html +="</tr>";
                });
                $dataTbody.html(html);
                $(".pagination").off().createPage({
                    pageCount:data.page[0].pageCount,
                    current:curPage,
                    backFn:function(p){
                        init(p)
                    }
                });
            }
        })

    }

/*获取商家信息---根据商家名称查询*/
$searchBtn.on("click",function(){
    init(1);
});


    /*增加商家按钮,弹出商家信息模态,打开时默认清空里面的所有值*/
    $newproductclass.on("click",function(){
        sellerId=0;
        $reviewModal.modal("show");
        $AccountHide.show();
        $passwordHide.show();   //显示密码框区域
        $loginHide.show();
        $qrpasswordHide.show();

        $comeanyname.val("");
        $storename.val("");
        $InfoAdress.val("");
        $linkman.val("");
        $phone.val("");
        $tel.val("");
        $mail.val("");
        $bank.val("");
        $Accountname.val("");
        $AccountNumber.val("");
        $login.val("");
        $password.val("");
        $qrpassword.val("");
        $describe.val("");


        /*把选中的省市都清空*/
        ToCityorCounty();

        provice();
    });


    /*点击商家信息确定按钮，保存信息*/
    $conform.on("click",function(){
        var url="";
        var $comeanynameVal=$comeanyname.val();
        var $storenameVal=$storename.val();
        var $InfoAdressVal=$InfoAdress.val();
        var $linkmanVal=$linkman.val();
        var $phoneVal=$phone.val();
        var $telVal=$tel.val();
        var $mailVal=$mail.val();
        var $bankVal=$bank.val();
        var $AccountnameVal=$Accountname.val();
        var $AccountNumberVal=$AccountNumber.val();
        var $loginVal=$login.val();
        var $passwordVal=$password.val();
        var $qrpasswordVal=$qrpassword.val();
        var $describeText=$describe.val();


        //省,市，县id和名字
        var $provinceIdVal=$provice.val();
        var $cityVal=$city.val();
        var $countyVal=$county.val();
        var $provinceName=$provice.find("option:selected").text();
        var $cityName=$city.find("option:selected").text();
        var $countyName=$county.find("option:selected").text();

        if($cityName==""&&$countyName==""){
            alert("请把省市城镇信息填写完成");
            return;
        }

        var data={
            pwdEnc:$passwordVal,              //登录密码
            companyName:$comeanynameVal,   //公司名称
            loginName:$loginVal,        //登陆名称
            openBank:$bankVal,
            accountHolder:$AccountnameVal, //账号名
            accountNumber:$AccountNumberVal,//账号
            provinceId:$provinceIdVal,               //省
            provinceName:$provinceName,          //省名称
            cityId:$cityVal,                   //市
            cityName:$cityName,              //市名称
            countyId:$countyVal,                 //县
            countyName:$countyName,            //县名称
            address:$InfoAdressVal,        //地址
            mobile:$phoneVal,              //手机
            tel:$telVal,                   //座机
            email:$mailVal,                //邮箱
            remark:$describeText,          //备注
            contactName:$linkmanVal,         //联系人
            sellerName:$storenameVal
        };

        if(sellerId){
            data.sellerId=sellerId;
            url=domain+"/manager/seller/update";
            console.log(data)
        }else{
            url=domain+"/manager/seller/add";
            console.log(data)
        }

        $.ajax({
            url:url,
            type:"post",
            data:data,
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data.code==200){
                    alert("成功");
                    window.location.reload();

                }else{
                    alert(data.desc)
                }
            }
        });

        $reviewModal.modal("hide");
        ToCityorCounty();//还原选中的值
        //init();//更新表格中的信息
    });

    /*关闭商家取消按钮*/
    $cancel.on("click",function(){
        $reviewModal.modal("hide");
        ToCityorCounty();//还原选中的值
    });


    /*商家编辑信息列表*/
    $dataTbody.on("click","a.update",function(){
        $reviewModal.modal("show");
        $AccountHide.show();
        $passwordHide.show();   //显示密码框区域
        $loginHide.show();
        $qrpasswordHide.show();
        $comeanyname.val("");
        $storename.val("");
        $InfoAdress.val("");
        $linkman.val("");
        $phone.val("");
        $tel.val("");
        $mail.val("");
        $bank.val("");
        $Accountname.val("");
        $AccountNumber.val("");
        $login.val("");
        $password.val("");
        $qrpassword.val("");
        $describe.val("");

        offBtn=true;
        var index=$(this).parents("tr").index();
        $AccountHide.hide();
        $passwordHide.hide();   //隐藏密码框区域
        $loginHide.hide();
        $qrpasswordHide.hide();

        /*默认第一次编辑时部分信息为空*/
        sellerId = list[index].sellerId;
        $.ajax({
            url:domain+"/manager/seller/get",
            type:"post",
            data:{sellerId:sellerId},
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data.code==200){
                    var Value=data.seller;
                    $comeanyname.val(Value.companyName);
                    $storename.val(Value.sellerName);
                    $InfoAdress.val(Value.address);
                    $linkman.val(Value.contactName);
                    $phone.val(Value.mobile);
                    $tel.val(Value.tel);
                    $mail.val(Value.email);
                    $bank.val(Value.bank);
                    $Accountname.val(Value.accountHolder);
                    $AccountNumber.val(Value.accountNumber);
                    $describe.val(Value.remark);
                    $provice.val(Value.provinceId);
                    $provice.trigger("change");
                    $city.find("option").each(function(){
                        if($(this).text()==Value.cityName){
                            $(this).attr("selected",true);
                        }
                    });
                    $city.trigger("change");
                    $county.find("option").each(function(){
                        if($(this).text()==Value.countyName){
                            $(this).attr("selected",true);
                        }
                    });
                }else{
                    alert(data.desc);
                }
            }
        });

    });


    /*密码框修改密码信息列表*/
    $dataTbody.on("click","a.ChangePassword",function(){
        var index=$(this).parents("tr").index();
        sellerId = list[index].sellerId;
        $PasswordModal.modal("show");
        $("span.selleNames").text($(this).attr("data-useName") || "")
        $newPassword.val("");
        $OnenewPassword.val("");
    });


    /*密码框点击确认按钮,新密码发送后台*/
    $Passwordconform.on("click",function(){
        var url=domain+"/manager/seller/editpwd";

        var $newPasswordVal=$newPassword.val();
        var $OnenewPasswordVal=$OnenewPassword.val();
        if($newPasswordVal!=$OnenewPasswordVal){
            alert("您输入的确认密码不一致");
            return;
        }
        $.ajax({
            url:url,
            type:"post",
            data:{sellerId:sellerId,pwdEnc:$newPasswordVal},
            dataType:"json",
            success:function(data){
                if(data.code==200){
                    alert("保存成功");
                    $PasswordModal.modal("hide");
                }else{
                    alert(data.desc)
                }
           }
        })

    });

    /*密码框点击取消按钮,关闭模态窗口*/
    $Passwordcancel.on("click",function(){
        $PasswordModal.modal("hide");
    });




    /*增加省市县列表*/
   function provice() {
       var url = domain+"/manager/address/getprovinces";
       var html = "";
       $.ajax({
           url: url,
           type: "post",
           async: false,
           dataType: "json",
           success: function (data) {
               console.log(data);
               if (data.code == 200) {
                   var provicnceList = data.provicnceList;
                   html += "<option>--请选择--</option>";
                   $.each(provicnceList, function (i, val) {
                       html += "<option value='" + val.id + "'>" + val.shortName + "</option>"
                   });
                   $provice.html(html);
               }
           }
       });
   }


    /*市*/
    $provice.on("change",function(){
        var url=domain+"/manager/address/getcitys";
        var data=$provice.val();
        var html="";
        $.ajax({
            url:url,
            type:"post",
            async: false,
            data:{provinceId:data},
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data.code==200){
                    var cityListList=data.cityList;
                    $.each(cityListList,function(i,val){
                        html+="<option value='"+val.id+"'id='"+val.id+"'>"+val.shortName+"</option>"
                    });
                    $city.html(html);
                    $city.trigger("change");   //触发城市选项
                }
            }
        })
    });

    /*城市*/
    $city.on("change",function(){
        var url=domain+"/manager/address/getcountys";
        var data=$city.find("option:selected").attr("id");
        console.log(data);
        var html="";
        $.ajax({
            url:url,
            type:"post",
            async: false,
            data:{cityId:data},
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data.code==200){
                    var countyList=data.countyList;
                 /*  var countyList=[
                        {shortName:"回民区"},{shortName:"新城区"},{shortName:"玉泉区"},
                        {shortName:"赛罕区"},{shortName:"托克托县"},{shortName:"武川县"},
                        {shortName:"和林格尔县"},{shortName:"清水河县"},{shortName:"土默特左旗"}
                    ];*/
                    $.each(countyList,function(i,val){
                        html+="<option value='"+val.id+"'id='"+val.id+"'>"+val.shortName+"</option>"
                    });
                    $county.html(html);
                }
            }
        })
    });


    /*把市和城镇选中的还原*/

    function ToCityorCounty(){
        $city.empty().html("<option>--请选择--</option>");   //省市列表还原
        $county.empty().html("<option>--请选择--</option>"); //城镇
    }



    $("#pagination").on("click","li",function(){
       console.log($(this));
        $(this).addClass("active").siblings().removeClass("active")
    });


