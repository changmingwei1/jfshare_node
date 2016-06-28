$(function(){
	//导航菜单中的图片轮播
		jQuery("#mob01").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
		jQuery("#mob02").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
	 


        //用户退出 点击
        $("#quite").click(function(){
        	$("#quiteWin,#laybg").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#quiteWin input").click(function(){
        	$("#quiteWin,#laybg").hide();
        });


        //tab标签函数
        $(".tab").each(function(){
                $(this).find("li").each(function(index){
                        $(this).click(function(){
                                if($(this).hasClass("select"))return;
                                $(this).siblings().removeClass("select");
                                $(this).addClass("select");
                                var vv=$(this).offset().left-$(this).parent().offset().left+$(this).width()/2-30;
                                $(this).parent().next().animate({left:vv+"px"},500);//浮标动画
                                $(this).parent().parent().parent().children(".tabItem").hide().eq(index).fadeIn();//标签内容切换
                        })
                });
        });
	
	$(window).scroll(function(){
		// 有一定高度的屏幕才运行左侧菜单滚动固定
		if(($(window).height()>602)&&($(window).scrollTop()>440)){
			$("#centerNav").addClass("leftFix");
		}else{
			$("#centerNav").removeClass("leftFix");
		}
	})
});