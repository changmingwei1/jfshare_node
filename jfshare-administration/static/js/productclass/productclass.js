//$(function(){

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



    var $productclass=$("#productclass"); //获取商品的名称
    var $dataTbody=$("#dataTbody");
    var $searchid=$("#searchid"); //根据id查找相应的品牌按钮
    var obj={
        uploadImg_key:""
    }


    var imgurl="http://proxy.jfshare.com/system/v1/jfs_image/";//图片路径；
    var serverImgUrl = "http://proxy.jfshare.com/system/upload/";

    /*模态窗口*/
    var $reviewModal=$("#reviewModal");   //模态窗口里的图片
    var $productName=$("#productName");
    var $confirm=$("#confirm");  //获取新增品牌的确认按钮
    var $cancel=$("#cancel");    //取消按钮
    var $delImg=$("#delImg");    //删除图片按钮
    var $MenuModal=$("#MenuModal");
    var $imgShow_WU_FILE_0=$("#imgShow_WU_FILE_0");

    var $perCount=50; //每页显示多少条
    var curPage=1;    //当前页数;
    var spinner = new Spinner(opts);
    var brandList=null;
    var brandid;
    var isadd=false;
var magId=window.localStorage.getItem("managerId");
var domain="http://proxy.jfshare.com"       //域名

    function init(listcurpage) {
        var html="";
        var url = domain+"/manager/brand/list";
        var $productclassVal = $productclass.val();
        curPage = listcurpage;
        $.ajax({
            url: url,
            type: "post",
            data: {name: $productclassVal, perCount: $perCount, curPage: curPage},
            dataType: "json",
            beforeSend:function() {
                $dataTbody.html("<tr><td height='200px' colspan='5' class='text-center'>数据加载中</td></tr>");
                var target = $dataTbody.find("tr").find("td").get(0);
                spinner.spin(target);
            },
            complete:function() {
                spinner.spin();
            },
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    brandList=data.brandList;
                    $.each(brandList,function(i,val){
                        html +="<tr>";
                        html +="<td style='text-align: center; vertical-align: middle'>"+val.id+"</td>";
                        html +="<td style='text-align: center; vertical-align: middle'><img width='100' src="+imgurl+val.imgKey+"/></td>";
                        html +="<td style='text-align: center; vertical-align: middle'>"+val.name+"</td>";
                        html +="<td style='text-align: center; vertical-align: middle'>"+val.createTime+"</td>";
                        html +="<td style='text-align: center; vertical-align: middle'><a href='javascript:void(0)' class='update' data-src='"+imgurl+val.imgKey+"'>编辑</a><a href='javascript:void(0)' style='margin-left: 20px' class='relateType'>关联品类</a></td>";
                        html +="</tr>";
                    });
                    //doPagination(data.page,curPage);  //添加分页
                    $(".pagination").off().createPage({
                        pageCount: data.page.pageCount,
                        current: curPage,
                        backFn: function (p) {
                            init(p);
                        }
                    });

                    $dataTbody.html(html);
                }else {
                    alert("数据不存在")
                }
            }
        });

    }


    $("#newproductclass").on("click",function(){
        $("div.editSubject").hide();
        $("#fileList").html("");
        $("#reviewModal").modal("show");
        $productName.val("");
        $imgShow_WU_FILE_0.val("");
        isadd=true;
    });

    /*新增品牌操作,获取图片路径和名字，保存到后台中（未）*/
    $confirm.on("click",function(){

        var $productNameVal=$productName.val();
        if($productNameVal.trim().length==0){
            alert("品牌名称不能为空");
            return ;
        }
        if(!$("#fileList").html()){
            alert("请上传品牌图片");
            return false;
        }
        var $imgsrc=$("#uploader-demo").attr('imgsrc');//图片名字
        if(isadd){
            var url=domain+"/manager/brand/add";
            //userid用户idimgSrc
            $.ajax({
                url:url,
                type:"POST",
                data:{"name":$productNameVal,"imgKey":$imgsrc,"userId":magId},
                dataType:"json",
                success:function(data){
                    if(data.code==200){
                        init(curPage);
                        $("#reviewModal").modal("hide"); //关闭模态窗口
                        alert("保存成功");
                    }else{
                        alert(data.desc);
                    }
                }
            });
        }
       else{
            var url=domain+"/manager/brand/update";
            $.ajax({
                url:url,
                type:"post",
                data:{name:$productNameVal,imgKey:$imgsrc,id:brandid,userId:magId},
                dataType:"json",
                success:function(data){
                    console.log(data);
                    if(data.code==200){
                        alert("保存成功");
                        $("#reviewModal").modal("hide");
                        init(curPage);
                    }else{
                        alert(data.desc);
                    }
                }

            })
        }


    });

$dataTbody.on("click","a.update",function(){
    $("#fileList").html("");
    $("div.editSubject").show();
    $("#fileList").html("");
    var index=$(this).parents("tr").index();
    var imgele = $(this).attr("data-src");
    $("#subjectImgSrc").attr("src",imgele);
    brandid=brandList[index].id;
    $("#reviewModal").modal("show");
    $productName.val(brandList[index].name);
    $imgShow_WU_FILE_0.val("");
    isadd=false;

});

      //点击取消关闭模态
    $cancel.on("click",function(){
        $("#reviewModal").modal("hide");
    });


/*根据品牌名称查找对应的品牌,然后显示在表格上*/
$searchid.on("click",function(){
    init(1);
});

    $delImg.on("click",function(){
        $imgShow_WU_FILE_0.attr("src","");
    });

    /*商品品牌关联品类列表*/
    $dataTbody.on("click","a.relateType",function(){
        $MenuModal.modal("show");
           var index=$(this).parents("tr").index();  //获取点击的下标
            brandid=brandList[index].id;
           var menu=(function(){
               var $brandOne=$("#brandOne"); //获取第一层子项目里的ul
               var $brandTwo=$("#brandTwo"); //获取第二层子项目里的ul
               var $brandThree=$("#brandThree");//获取第三层子项目里的ul
               var $subjectconform=$("#subjectconform");     //获取保存按钮
               var $subjectcancel=$("#subjectcancel");       //获取取消按钮
               var List1=null;
               var List2=null;
               var List3=null;
               var num1=null;       //点击第一个菜单的索引
               var num2=null;       //点击第一个菜单的索引
               var num3=null;       //点击第一个菜单的索引
               var dataAttr=[];
               var checkboxlist=null;
               var nowList=null;
               /*初始化加载一个菜单*/
               function init(){
                   console.log(111)
                   var html="";
                   var url=domain+"/manager/subject/query";
                   $.ajax({
                       url:url,
                       type:"post",
                       data:{pid:0},
                       async:false,
                       dataType:"json",
                       success:function(data){
                           console.log(data);
                           List1=data.subjectList;
                           $.each(List1,function(i,val){
                               html +="<li id='"+val.id+"'>";
                               html +="<a class='subject-link' href='javascript:void(0)' >";
                               html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                               html +="<span isLeaf='"+val.isLeaf+"'>"+val.name+"</span></a></li>";
                           });
                           $brandOne.html(html);
                       }
                   });


                   getListforBrand(index);

               }

               /*点击某一列表显示第二层*/
               $brandOne.undelegate("li","click").delegate("li","click",function(){
                   $brandThree.empty();
                   var html="";
                   var url=domain+"/manager/subject/query";
                   var pid1=$(this).attr("id");
                   num1=$(this).index();       //记录第一个菜单点击的索引
                   //console.log(userId);                //获取点击对应的id

                   $.ajax({
                       url:url,
                       type:"post",
                       data:{pid:pid1},
                       async:false,
                       dataType:"json",
                       success:function(data){
                           List2=data.subjectList;
                           nowList = List2;
                           $.each(List2,function(i,val){
                               if(val.isLeaf==1){
                                   html += "<li id='" + val.id + "'>";
                                   html += "<a class='subject-link' href='javascript:void(0)' >";
                                   html += "<input type='checkbox' class='item itemIpt' name='"+val.id+"'>";
                                   html += "<i class='glyphicon glyphicon-chevron-right'></i>";
                                   html += "<span isLeaf='" + val.isLeaf + "'>" + val.name + "</span></a></li>";
                               }else{
                                   html +="<li id='"+val.id+"'>";
                                   html +="<a class='subject-link' href='javascript:void(0)' >";
                                   html +="<i class='glyphicon glyphicon-chevron-right'></i>";
                                   html +="<span isLeaf='"+val.isLeaf+"'>"+val.name+"</span></a></li>";
                               }
                           });
                           $brandTwo.html(html);

                           $(".itemIpt").off('click').on('click',function(){
                               var temp =[];
                               $.each($(".itemIpt"),function(i,e){
                                   if($(e).prop("checked")){
                                       //console.log($(e).attr('name'))
                                       temp.push(parseInt($(e).attr('name')));
                                   }
                               })
                               addCheckId(temp);
                           })

                           for(var x=0;x<List2.length;x++){
                               for(var y=0;y<dataAttr.length;y++){
                                   if(dataAttr[y]==List2[x].id&&List2[x].isLeaf==1){
                                       //console.log(  $("input:checkbox[name='"+List3[x].id+"']"));
                                       $("input:checkbox[name='"+List2[x].id+"']").attr("checked",true)
                                   }
                               }
                           }
                       }

                   })

               });


               /*点击第二级菜单某一列表显示第三层*/
               $brandTwo.undelegate("li","click").delegate("li","click",function(){
                   var html="";
                   var url=domain+"/manager/subject/query";
                   var pid2=$(this).attr("id");
                   num2=$(this).index();               //记录第一个菜单点击的索引
                   //console.log(userId);                //获取点击对应的id
                   var $isleaf=$(this).find("span").attr("isleaf"); //判断是否有子叶子
                   if($isleaf==1){
                       //调用第四个查看属性的方法
                   }else {
                       $.ajax({
                           url: url,
                           type: "post",
                           data: {pid: pid2},
                           async:false,
                           dataType: "json",
                           success: function (data) {
                               List3 = data.subjectList;
                               nowList = List3;
                             $.each(List3, function (i, val) {
                                   html += "<li id='" + val.id + "'>";
                                   html += "<a class='subject-link' href='javascript:void(0)' >";
                                   html += "<input type='checkbox' class='item itemIpt' name='"+val.id+"'>";
                                   html += "<i class='glyphicon glyphicon-chevron-right'></i>";
                                   html += "<span isLeaf='" + val.isLeaf + "'>" + val.name + "</span></a></li>";
                             });

                               $brandThree.html(html);

                               $(".itemIpt").off('click').on('click',function(){
                                   var temp =[];
                                   $.each($(".itemIpt"),function(i,e){
                                       if($(e).prop("checked")){
                                           //console.log($(e).attr('name'))
                                           temp.push(parseInt($(e).attr('name')));
                                       }
                                   })
                                   addCheckId(temp);
                               })


                               for(var x=0;x<List3.length;x++){
                                   for(var y=0;y<dataAttr.length;y++){
                                       if(dataAttr[y]==List3[x].id){
                                           //console.log(  $("input:checkbox[name='"+List3[x].id+"']"));
                                           $("input:checkbox[name='"+List3[x].id+"']").attr("checked",true)
                                       }
                                   }
                               }

                           }

                       })
                   }

               });

               function addCheckId(ids){
                   var has = false;
                   for(var i=0;i<ids.length;i++){
                       var id = ids[i];
                       for(var j=0;j<dataAttr.length;j++){
                           var data = dataAttr[j];
                           if(data==id){
                               has=true;
                               break;
                           }
                       }
                       if(has){
                           has=false;
                       }else{
                           dataAttr.push(id);
                       }
                   }

                   var have = false;
                   var needdel=[];
                   for(var x=0;x<nowList.length;x++){
                       var data=nowList[x].id;
                       for(var y=0;y<ids.length;y++){
                           var id=ids[y];
                           if(data==id){
                               have=true;
                               break;
                           }
                       }
                       if(have){
                           have=false;
                       }else{
                           needdel.push(data);
                       }
                   }

                   for(var j=0;j<dataAttr.length;j++){
                       var data = dataAttr[j];
                       for(var x=0;x<needdel.length;x++){
                           var id=needdel[x];
                           if(data==id){
                               dataAttr[j]=0;
                               break;
                           }
                       }
                   }
               }

               function getListforBrand(num){
                   var url=domain+"/manager/subject/getListforBrand";
                   var id=brandList[num].id;
                   $.ajax({
                       url:url,
                       type:"post",
                       data:{id:id},
                       dataType:"json",
                       success:function(data){
                           console.log(data);
                           if(data.code==200){
                               var temp=data.ids;
                               $.each(temp, function (i, val) {
                                   dataAttr.push(val.id);
                               });
                           }
                       }
                   })
               }



               $("#subjectconfirm").off('click').click(function(){
                   var url=domain+"/manager/subject/updateBrandSubject";

                   $.ajax({
                       url:url,
                       type:"post",
                       data:{brandId:brandid,subjectIds:JSON.stringify(dataAttr)},
                       //data:{brandId:brandid,subjectIds:dataAttr},
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
                   $MenuModal.modal("hide");
                   $brandOne.add($brandTwo).add($brandThree).empty();
               });

               $("#subjectcancel").click(function(){
                   $MenuModal.modal("hide");
                   $brandOne.add($brandTwo).add($brandThree).empty();
               });

               $("#close").click(function(){
                   $MenuModal.modal("hide");
                   $brandOne.add($brandTwo).add($brandThree).empty();
               });





               //init();  //初始化加载第一项目的列表
               return {init:init}
           })();
        menu.init();
    });

    //制作分页标签
    function doPagination(paginationData,pagenum) {
        if ($("#pagination")) {
            //总记录数
            //var totalCount = paginationData.total;
            ////每页数量
            //var pagesize = paginationData.pageCount;
            ////当前页码
            // currentpage = 1;
            //
            //$("#totalCount").html(totalCount);
            //
            //var counts, pagehtml = "";
            //if (totalCount % pagesize == 0) {
            //    counts = parseInt(totalCount / pagesize);
            //} else {
            //    counts = parseInt(totalCount / pagesize) + 1;
            //}
            counts = paginationData.pageCount;
            var currentpage = curPage;
            var pagehtml="";
            //只有一页内容
            if (counts==1) {
                pagehtml+="<li><a href='javascript:init(1)'>1</a></li>";
                pagehtml+="<li><a href='javascript:init(1)'>共1页</a></li>";
            }
            //大于一页内容
            if (counts>1) {
                if (currentpage > 1) {
                    pagehtml += '<li><a href="javascript:void(0)" onclick="init(' + (currentpage - 1) + ');">上一页</a></li>';
                }
                for (var i = 0; i < counts; i++) {
                    if (i >= (currentpage - 3) && i < (currentpage + 3)) {
                        if (i == currentpage - 1) {
                            pagehtml += '<li class="active"><a href="javascript:void(0)" onclick="init(' + (i + 1) + ');">' + (i + 1) + '</a></li>';
                        } else {
                            pagehtml += '<li><a href="javascript:void(0)" onclick="init(' + (i + 1) + ');">' + (i + 1) + '</a></li>';
                        }

                    }
                }
                if (currentpage < counts) {
                    pagehtml += '<li><a href="javascript:void(0)" onclick="init(' + (currentpage + 1) + ');">下一页</a></li>';
                }
                pagehtml+= '<li><a >共'+(counts)+'页</a></li>';
            }
            $("#pagination").html(pagehtml);

        }
    }

    init(1);  /*页面初始化加载的数据*/

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
    obj.uploadImg_key = response.title;
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


//});
