/**
 * Created by Administrator on 2016/5/7.
 */
$(function(){
    var serverImgUrl = "http://proxy.jfshare.com/system/upload/";
    var imgSrc = "http://proxy.jfshare.com/system/v1/jfs_image/";
    var $brandOne=$("#brandOne"); //获取第一层子项目里的ul
    var $brandTwo=$("#brandTwo"); //获取第二层子项目里的ul
    var $brandThree=$("#brandThree");//获取第三层子项目里的ul
    var $brandfour=$("#brandfour");//获取第三层子项目里的ul
    var $search1=$("#search1"); //获取搜索里第一个input
    var $search2=$("#search2"); //获取搜索里第二个input
    var $search3=$("#search3"); //获取搜索里第三个input
    var $add=$("#add");          //新增的input
    var $SaveModal=$("#SaveModal");
    var $subjectEdit=$("#subjectModal");
    var $conform=$("#conform");     //获取保存按钮
    var $cancel=$("#cancel");       //获取取消按钮
    var $conformModal=$("#conformModal");             //获取应用属性按钮
    var $conformAttr=$("#conformAttr");              //获取属性确认按钮
    var $cancelAttr=$("#cancelAttr");
    var $subjectconform=$("#subjectconform");
    var List1=null;
    var List2=null;
    var List3=null;
    var num1=null;       //点击第一个菜单的索引
    var num2=null;       //点击第一个菜单的索引
    var num3=null;       //点击第一个菜单的索引
    var level=0;          //层级
    var levelLenth = 0;
    var objs ={
        uploadImg_key:"",
        uploadImgFlag:false
    };

    // 获取用户的sellerId
    var userId =window.localStorage.getItem("sellerId");


    var addsubject=false;
    var offbtn1=false;   //判断用于在第三菜单或第四菜单添加
    var offbtn2=false;

    var attsid=0;
    var attpsid=0;
    var attid=0;
    var magId=window.localStorage.getItem("managerId");
    var domain="http://proxy.jfshare.com"       //域名


    /*初始化加载一个菜单*/
    function init(){
        var html="";
        var url=domain+"/manager/subject/query";
        $.ajax({
            url:url,
            type:"post",
            data:{pid:0},
            dataType:"json",
            success:function(data){
                console.log(data)
                List1=data.subjectList;
                $.each(List1,function(i,val){
                    html +="<li id='"+val.id+"' data-src='"+val.imgkey+"'>";
                    html +="<a class='subject-link' href='javascript:void(0)' >";
                    html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                    html +="<span isLeaf='"+val.isLeaf+"'>"+val.name+"</span>";
                    html +="<button class='btn' style='margin-left: 20px' id='editSubject1'index='"+i+"' data-isLeaf='"+val.isLeaf+"' data-type='"+val.type+"'>编辑</button></a></li>";

                });
                html +="<li><button class='btn' id='addSubject1' index='1'>添加</button></li>";
                $brandOne.html(html);
            },

        })

    }


    $subjectconform.on("click",function(){
        if(addsubject){     //添加类目
            var pid=0;
            var ele = "";
            if(level==1){
                ele = "#addSubject1";
            }else if(level==2){
                ele = "#addSubject2";
                pid=List1[num1].id;
            }else if(level==3){
                ele = "#addSubject3";
                pid=List2[num2].id;
            }
            var name= $("#subjectname").val();
            var imgkey=objs.uploadImg_key || "";
            var subjectStatus=$("#subjectStatus").val();
            var subjectLeaf=$("#subjectLeaf").val();
            if(!name){
                alert("品类名称不能为空");
                return false;
            }
            if(subjectStatus == "-1"){
                alert("请选择类目类型");
                return false;
            }
            if(subjectLeaf == "-1"){
                alert("请选择叶子节点");
                return false;
            }
            //必须传图片，否则过不去
            if(imgkey==null||!imgkey){
                //imgkey="9FDF33FC2A764E720E7ECED884980EB2.png";
                alert("请上传图片");
                return false;
            }
            if(!objs.uploadImgFlag){
                alert("请等待图片上传,稍后再试~");
                return false;
            }
            var urlupdate=domain+"/manager/subject/add";
            $.ajax({
                url:urlupdate,
                type:"post",
                data:{name:name,imgkey:imgkey,pid:pid,level:level,commodity:subjectStatus,userId:magId,isLeaf:subjectLeaf},
                dataType:"json",
                success:function(data){
                    console.log(level);
                    if (data.code == 200) {
                        var html = "";
                        html +="<li id='"+data.id+"' data-src='"+imgkey+"'>";
                        html +="<a class='subject-link' href='javascript:void(0)' >";
                        html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                        html +="<span isLeaf='"+subjectLeaf+"'>"+name+"</span>";
                        html +="<button class='btn' style='margin-left: 20px' id='editSubject"+level+"' index='"+levelLenth+"' data-isLeaf='"+subjectLeaf+"' data-type='"+subjectStatus+"'>编辑</button></a></li>";
                        $(ele).parent().before(html);
                        var obj = {
                            id:data.id,
                            name:name || "",
                            imgkey:imgkey || "",
                            isLeaf:subjectLeaf,
                            type:subjectStatus
                        };
                        //var Lists = "List"+level;
                        //Lists.push(obj);
                        if(level == 1){
                            List1.push(obj)
                        }else if(level == 2){
                            List2.push(obj)
                        }else if(level == 3){
                            List3.push(obj)
                        }
                        alert("添加成功");

                    } else {
                        alert(data.desc);
                    }
                }

            });
        }else {       //更新类目
            var id=0;
            if(level==1){
                id=List1[num1].id;
            }else if(level==2){
                id=List2[num2].id;
            }else if(level==3){
                id=List3[num3].id;
            }
            var name= $("#subjectname").val();
            var imgkey=objs.uploadImg_key || "";
            var urlupdate=domain+"/manager/subject/update";
            $.ajax({
                url:urlupdate,
                type:"post",
                data:{id:id,name:name,imgkey:imgkey,userId:magId},
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if (data.code == 200) {
                        $("li[id='"+id+"']").attr("data-src",imgkey)
                        $("li[id='"+id+"']").find("span").text(name);
                        alert("更新成功");

                    } else {
                        alert(data.desc);
                    }
                }

            });
        }

        //关闭模态窗口
        $("#subjectModal").modal("hide");

    });

    $("#subjectcancel").on("click",function(){
        $("#subjectModal").modal("hide");

    });


    /*点击某一列表显示第二层*/
    $brandOne.delegate("li","click",function(){
        if($(this).attr("disabled") == "disabled"){
            return false;
        }
        $(this).css("background-color","#ECF2F7").attr("disabled","disabled").siblings().removeAttr("disabled").css("background-color","#fff");
        $brandThree.add($brandfour).empty();
        var html="";
        var url=domain+"/manager/subject/query";
        var pid=$(this).attr("id");
        num1=$(this).index();       //记录第一个菜单点击的索引
        console.log(pid);                //获取点击对应的id

        $.ajax({
            url:url,
            type:"post",
            data:{pid:pid},
            dataType:"json",
            success:function(data){
                List2=data.subjectList;
                $.each(List2,function(i,val){
                    html +="<li id='"+val.id+"' data-src='"+val.imgkey+"'>";
                    html +="<a class='subject-link' href='javascript:void(0)' >";
                    html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                    html +="<span isLeaf='"+val.isLeaf+"'>"+val.name+"</span>";
                    html +="<button class='btn' style='margin-left: 20px' id='editSubject2' index='"+i+"' data-isLeaf='"+val.isLeaf+"' data-type='"+val.type+"'>编辑</button></a></li>";
                });
                html +="<li><button class='btn' id='addSubject2' index='2'>添加</button></li>";
                $brandTwo.html(html);
            }

        })

    });
    $brandOne.on("click","button#addSubject1",function(){
        level = 1;
        objs.uploadImg_key = "";
        objs.uploadImgFlag = false;
        $("div.subTypes").show();
        $("div.editSubject").hide();
        $("#fileList").html("");
        $("#subjectname").val("");
        $("div.subTypes select").removeAttr('disabled');
        $("#subjectStatus").find("option[value='-1']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='-1']").prop("selected",'selected');
        levelLenth = $(this).parent().parent("ul").find('li').length-2;
        addsubject=true;
        $subjectEdit.modal("show");
        return false;

    });
    $brandOne.on("click","button#editSubject1",function(){
        num1=$(this).attr("index");
        var imgele = imgSrc+$(this).parents("li").attr("data-src");
        var isLeaf = $(this).attr("data-isleaf");
        var dataType = $(this).attr("data-type");
        $("#subjectStatus").find("option[value='"+dataType+"']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='"+isLeaf+"']").prop("selected",'selected');
        $("div.subTypes select").attr('disabled','disabled');
        $("div.editSubject").show();
        $("#fileList").html("");
        objs.uploadImg_key = $(this).parents("li").attr("data-src");
        level = 1;
        addsubject=false;
        var name = $(this).parents("li").find("span").text();
        $("#subjectname").val(name);
        $("#subjectImgSrc").attr("src",imgele);
        //$("#delImg").val(imgele);
        $subjectEdit.modal("show");
        return false;
    });


    /*点击第二级菜单某一列表显示第三层*/
    $brandTwo.delegate("li","click",function(){
        if($(this).attr("disabled") == "disabled"){
            return false;
        }
        $(this).css("background-color","#ECF2F7").attr("disabled","disabled").siblings().removeAttr("disabled").css("background-color","#fff");
        $brandfour.empty();
        $brandThree.empty();
        var html="";
        var url=domain+"/manager/subject/query";
        pid=$(this).attr("id");
        num2=$(this).index();               //记录第一个菜单点击的索引
        //console.log(userId);                //获取点击对应的id
        var $isleaf=$(this).find("span").attr("isleaf"); //判断是否有子叶子
        if($isleaf==1){
            attsid=pid;
            var leafurl=domain+"/manager/subject/get";
            $.ajax({
                url:leafurl,
                type:"post",
                data:{subjectId:pid},
                dataType:"json",
                success:function(data){
                    //console.log(data);
                    var List=data.attributes;
                    attpsid=List1[num1].id;
                    attid=List.id;
                    if(List&&attid>0){
                        var attributesVal=JSON.parse(List.value);
                        $.each(attributesVal,function(i,val){
                            html +="<li id='"+val.id+"' mid="+data.attributes.id+">";
                            html +="<a class='subject-link' href='javascript:void(0)' >";
                            html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                            html +="<span sorted='"+val.sorted+"'>"+val.name+"</span>";
                            html +="<i class='glyphicon glyphicon-remove' style='margin-left: 20px'  id='delBtnAttr'></i></a>";
                            html+="</li>"
                        });
                    }
                    // html +="<li><a class='subject-link' href='javascript:void(0)'><i class='glyphicon glyphicon-chevron-right'></i><span>asdf</span><i class='glyphicon glyphicon-remove' style='cursor: pointer; margin-left: 20px' id='addBtn'></i></a></li>";
                    html +="<li><input type='text' id='add1' class='form-control' style='width: 90%; display: inline-block'><i class='glyphicon glyphicon-plus' style='cursor: pointer' id='addBtnAttr'></i></li>";
                    html +="<li><button class='btn' id='All'>应用全部</button></li>";
                    $brandfour.html(html);
                }

            })
        }else {
            $.ajax({
                url: url,
                type: "post",
                data: {pid: pid},
                dataType: "json",
                success: function (data) {
                    List3 = data.subjectList;
                    $.each(List3, function (i, val) {
                        html += "<li id='" + val.id + "' data-src='"+val.imgkey+"'>";
                        html += "<a class='subject-link' href='javascript:void(0)' >";
                        html += "<i class='glyphicon glyphicon-chevron-right'></i>";
                        html += "<span isLeaf='" + val.isLeaf + "'>" + val.name + "</span>";
                        html +="<button class='btn' style='margin-left: 20px' id='editSubject3' index='"+i+"'  data-isLeaf='"+val.isLeaf+"' data-type='"+val.type+"'>编辑</button></a></li>";
                    });
                    html +="<li><button class='btn' id='addSubject3' index='3'>添加</button></li>";
                    //html += "<input type='text' id='add' class='form-control' style='width: 90%; display: inline-block'><i class='glyphicon glyphicon-plus' style='cursor: pointer' id='addBtn'></i>";
                    $brandThree.html(html);
                }

            })
        }

    });
    $brandTwo.on("click","button#editSubject2",function(){
        num2=$(this).attr("index");
        var imgele = imgSrc+$(this).parents("li").attr("data-src");
        objs.uploadImg_key = $(this).parents("li").attr("data-src");
        var isLeaf = $(this).attr("data-isleaf");
        var dataType = $(this).attr("data-type");
        $("#subjectStatus").find("option[value='"+dataType+"']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='"+isLeaf+"']").prop("selected",'selected');
        $("div.subTypes select").attr('disabled','disabled');
        $("div.editSubject").show();
        $("#fileList").html("");
        level = 2;
        addsubject=false;
        var name = $(this).parents("li").find("span").text();
        $("#subjectname").val(name);
        $("#subjectImgSrc").attr("src",imgele);
        //$("#delImg").val(imgele);
        $subjectEdit.modal("show");

        return false;
    });
    $brandTwo.on("click","button#addSubject2",function(){
        level = 2;
        objs.uploadImg_key = "";
        objs.uploadImgFlag = false;
        $("div.subTypes").show();
        $("div.editSubject").hide();
        $("#fileList").html("");
        $("#subjectname").val("");
        $("div.subTypes select").removeAttr('disabled');
        $("#subjectStatus").find("option[value='-1']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='-1']").prop("selected",'selected');
        levelLenth = $(this).parent().parent("ul").find('li').length-2;
        addsubject=true;
        $subjectEdit.modal("show");
        return false;

    });



    /*点击第三个菜单显示第四个属性菜单*/
    $brandThree.delegate("li","click",function(){
        if($(this).attr("disabled") == "disabled"){
            return false;
        }
        $(this).css("background-color","#ECF2F7").attr("disabled","disabled").siblings().removeAttr("disabled").css("background-color","#fff");
        $brandfour.empty();
        var html="";
        var url=domain+"/manager/subject/get";
        var Id=$(this).attr("id");
        //console.log(userId);               //获取点击对应的id
        num3=$(this).index();               //记录第三个菜单点击的索引
        attsid=Id;
        $.ajax({
            url:url,
            type:"post",
            data:{subjectId:Id},
            dataType:"json",
            success:function(data){
                console.log(data);
                var List=data.attributes;
                attpsid=List2[num2].id;
                attid=List.id;
                if(List&&attid>0){
                    var attributesVal=JSON.parse(List.value);
                    $.each(attributesVal,function(i,val){
                        html +="<li id='"+val.id+"' mid="+data.attributes.id+">";
                        html +="<a class='subject-link' href='javascript:void(0)' >";
                        html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                        html +="<span sorted='"+val.sorted+"'>"+val.name+"</span>";
                        html +="<i class='glyphicon glyphicon-remove' style='margin-left: 20px'  id='delBtnAttr'></i></a>";
                        html+="</li>"
                    });
                }
                // html +="<li><a class='subject-link' href='javascript:void(0)'><i class='glyphicon glyphicon-chevron-right'></i><span>asdf</span><i class='glyphicon glyphicon-remove' style='cursor: pointer; margin-left: 20px' id='addBtn'></i></a></li>";
                html +="<li><input type='text' id='add1' class='form-control' style='width: 90%; display: inline-block'><i class='glyphicon glyphicon-plus' style='cursor: pointer' id='addBtnAttr'></i></li>";
                html +="<li><button class='btn' id='All'>应用全部</button></li>";
                $brandfour.html(html);
            }

        })

    });
    $brandThree.on("click","button#editSubject3",function(){
        num3=$(this).attr("index");
        objs.uploadImg_key = $(this).parents("li").attr("data-src");
        var imgele = imgSrc+$(this).parents("li").attr("data-src");
        $("div.editSubject").show();
        level = 3;
        addsubject=false;
        var isLeaf = $(this).attr("data-isleaf");
        var dataType = $(this).attr("data-type");
        $("#subjectStatus").find("option[value='"+dataType+"']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='"+isLeaf+"']").prop("selected",'selected');
        $("div.subTypes select").attr('disabled','disabled');
        var name = $(this).parents("li").find("span").text();
        $("#subjectname").val(name);
        $("#subjectImgSrc").attr("src",imgele);
        //$("#delImg").val(imgele);
        $subjectEdit.modal("show");
        return false;
    });
    $brandThree.on("click","button#addSubject3",function(){
        level = 3;
        objs.uploadImg_key = "";
        objs.uploadImgFlag = false;
        $("div.subTypes").show();
        $("div.editSubject").hide();
        $("#fileList").html("");
        $("#subjectname").val("");
        $("div.subTypes select").removeAttr('disabled');
        $("#subjectStatus").find("option[value='-1']").prop("selected",'selected');
        $("#subjectLeaf").find("option[value='-1']").prop("selected",'selected');
        levelLenth = $(this).parent().parent("ul").find('li').length-2;
        addsubject=true;
        $subjectEdit.modal("show");
        return false;

    });



    /*点击第四子菜单的添加按钮,显示模态窗口*/
    $brandfour.on("click","i#addBtnAttr",function(){
        var name=$("#add1").val();
        if(name){
            var arr=[];
            var values =$("#brandfour li a span");
            for(var i=0;i<values.size();i++){
                var obj={};
                obj.id=i+1;
                obj.name=$(values[i]).text();
                obj.sorted=i+1;
                arr.push(obj);
            }
            var obj={};
            obj.id=values.size()+1;
            obj.name=name;
            obj.sorted=values.size()+1;
            arr.push(obj);

            var url=domain+"/manager/subject/updateAttributes";

            $.ajax({
                url:url,
                type:"post",
                data:{subjectId:attsid,value:JSON.stringify(arr),userId:magId,id:attid},
                dataType:"json",
                success:function(data){
                    //console.log(data);
                    if (data.code == 200) {
                        alert("添加成功");
                        attid = data.id;
                        var html = "";
                        html +="<li id='"+arr.length+"' mid="+attid+">";
                        html +="<a class='subject-link' href='javascript:void(0)' >";
                        html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                        html +="<span sorted='"+arr.length+1+"'>"+$("#add1").val()+"</span>";
                        html +="<i class='glyphicon glyphicon-remove' style='margin-left: 20px'  id='delBtnAttr'></i></a>";
                        html+="</li>"
                        $("#add1").parent().before(html);
                        $("#add1").val("");

                    } else {
                        alert(data.desc);
                    }
                }

            })
        }else{
            alert("请填写规格")
        }

    });
    /*点击第四子菜单的删除按钮,显示模态窗口*/
    $brandfour.on("click","i#delBtnAttr",function(){
        var removerItem =$(this).closest("li");
        removerItem.remove();
        var arr=[];
        var values =$("#brandfour li a span");
        for(var i=0;i<values.size();i++){
            var obj={};
            obj.id=i+1;
            obj.name=$(values[i]).text();
            obj.sorted=i+1;
            arr.push(obj);
        }

        var url=domain+"/manager/subject/updateAttributes";

        $.ajax({
            url:url,
            type:"post",
            data:{subjectId:attsid,value:JSON.stringify(arr),id:attid,userId:magId},
            dataType:"json",
            success:function(data){
                //console.log(data);
                if (data.code == 200) {
                    alert("更新成功")
                } else {
                    alert(data.desc);
                }
            }

        })

    });
    $cancel.on("click",function(){
        $SaveModal.modal("hide");
        return false;
    });


    $("#close").click(function(){
        $MenuModal.modal("hide");
    });



     /*获得焦点时,清空下一菜单的值*/
    $search1.on("focus",function(){
        $brandTwo.add($brandThree).add($brandfour).empty();
    });

    /*获得焦点时,清空下一菜单的值*/
    $search2.on("focus",function(){
        $brandThree.add($brandfour).empty();
    });

    $search3.on("focus",function(){
        $brandfour.empty();
    });


    /*失去焦点时，搜索input第一个*/
    $search1.on("blur",function(){
        var inputVal=$search1.val();
       if(inputVal){
           SearchMenu(inputVal,$brandOne,List1)
       }else{
           console.log("搜索的信息不存在");
           init();
       }
    });

    /*失去焦点时，搜索input第二个*/
    $search2.on("blur",function(){
        var inputVal=$search2.val();
        if(inputVal){
            SearchMenu(inputVal,$brandTwo,List2)
        }else{
            console.log("搜索的信息不存在");
            $brandOne.find("li").eq(num1).trigger("click");
        }
});

    /*失去焦点时，搜索input第三个*/
    $search3.on("blur",function(){
        var inputVal=$search3.val();
        if(inputVal){
            SearchMenu(inputVal,$brandThree,List3)
        }else{
            console.log("搜索的信息不存在");
            $brandTwo.find("li").eq(num2).trigger("click");
        }
    });


    function SearchMenu(val,parent,list){
        var html="";
        var $li=$(parent).find("li");
        $li.each(function(i){
            if(val==$li.eq(i).find("span").html()){
                html +="<li id='"+list[i].id+"'>";
                html +="<a class='subject-link' href='javascript:void(0)' >";
                html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                html +="<span isLeaf='"+list[i].isLeaf+"'>"+list[i].name+"</span></a></li>";
                parent.empty().html(html)
            }
        })
    }



    /*修改属性节点*/
    $brandfour.on("click","button#All",function(ev){
        $conformModal.modal("show");
    });

    /*点击保存按钮后，修改信息*/
    $conformAttr.on("click",function(){
        if(attid>0){
            var url=domain+"/manager/subject/flushtoAll";
            var subjectId=$brandThree.find("li").eq(num3).attr("id") || $brandTwo.find("li").eq(num3).attr("id");
             console.log(subjectId);

            $.ajax({
                url:url,
                type:"post",
                data:{pid:attpsid,id:attid,updater:magId,subjectId:subjectId},
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if(data.code==200){
                        alert("应用全部成功");
                    }else{
                        alert(alert.desc);
                    }
                    $conformModal.modal("hide");
                }
            })
        }
        else{
            alert("刷新获取类目id")
        }
    });


    $cancelAttr.on("click",function(){
        var a=0;
        var b=1;
        $conformModal.modal("hide");
    });


    init();  //初始化加载第一项目的列表
    var $list = $('.uploader-list');
// 初始化Web Uploader
    var uploader = WebUploader.create({
        // 选完文件后，是否自动上传。
        auto: true,
        // swf文件路径
        swf: "/js/Uploader.swf",
        // 文件接收服务端。
        server: serverImgUrl,
        paste:document.body,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',
        fileVal:"Filedata",
        duplicate:true,
        // 只允许选择图片文件。
        accept: {
            title: 'duplicate',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        thumb:{
            width: 80,
            height: 80,
            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 70,
            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: true,
            // 是否允许裁剪。
            crop: true,
            // 为空的话则保留原有图片格式。
            // 否则强制转换成指定的类型。
            type: 'image/jpeg'
        },
        compress:{
            width: 500,
            height: 500,

            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 90,

            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: false,

            // 是否允许裁剪。
            crop: false,

            // 是否保留头部meta信息。
            preserveHeaders: true,

            // 如果发现压缩后文件大小比原来还大，则使用原来图片
            // 此属性可能会影响图片自动纠正功能
            noCompressIfLarger: false,

            // 单位字节，如果图片大小小于此值，不会采用压缩。
            compressSize: 0
        }
    });
// 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var ranom = Math.floor(Math.random()*10)
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img style="border-radius: 50%">' +
                '<div class="info">' + file.name+ranom + '</div>' +
                '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html( $li );
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $('.defaultImg').hide();
            $img.attr( 'src', src );
        }, 100, 100 );
    });
    uploader.on( 'uploadProgress', function( file, percentage ) {
        console.log(file)
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo( $li )
                .find('span');
        }
        $percent.css( 'width', percentage * 100 + '%' );
    });
// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ,response) {
        $( '#'+file.id ).addClass('upload-state-done');
        objs.uploadImg_key = response.title;
        objs.uploadImgFlag = true;
        $("#uploader-demo").attr("imgSrc",response.title)
    });
// 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });
// 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });

});


