$(function(){
		 


        //用户退出 点击
        $("#quite").click(function(){
        	$("#quiteWin,#laybg").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#quiteWin input").click(function(){
        	$("#quiteWin,#laybg").hide();
        });

        //广告轮播
        jQuery("#gg870").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });


        //初始物流只显示最后两条
        var totalLi = $("#J_listtext2 li");
        var hideLi = totalLi.slice(2,totalLi.length);
        hideLi.hide();
       
        //显示更多物流信息
        $("#J_tipinfo").click(function(){
            if(!$(this).hasClass('tog')){
                hideLi.show();
                $(this).attr('title','收起状态').html('收起状态<b></b>').addClass('tog');
            }else{
                hideLi.hide();
                $(this).attr('title','全部状态').html('全部状态<b></b>').removeClass('tog');
            }

        });



        //卡密下载链接  点击
        $("#downLoadCard").click(function(){
            $("#downLoadCardWin,#laybg2").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#downLoadCardWin input").click(function(){
            $("#downLoadCardWin,#laybg2").hide();
        });
});
