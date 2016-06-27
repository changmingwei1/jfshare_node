$(function(){
		//导航菜单中的图片轮播
		jQuery("#mob01").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
		jQuery("#mob02").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
	 //图片轮播插件
        jQuery("#hads").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"fold",  autoPlay:true, autoPage:true, trigger:"click" });
        //鼠标经过显示左右手
        $("#hads").hover(function(){
            $("#hads .preNext").show();
        },function(){
            $("#hads .preNext").hide();
        });

        //猜你喜欢 图片轮播2
        jQuery("#goodsCarousel").slide({ mainCell:".bd ul", effect:"left",delayTime:1000,  autoPlay:true, autoPage:true, trigger:"click" });
         //鼠标经过显示左右手
        $("#goodsCarousel").hover(function(){
            $("#goodsCarousel .preNext").show();
        },function(){
            $("#goodsCarousel .preNext").hide();
        });

        //热卖 图片轮播3
        jQuery("#hotsell").slide({ titCell:".hd ul",mainCell:".bd ul", effect:"left",delayTime:1000,  autoPlay:true, autoPage:true, trigger:"click" });
         //鼠标经过显示左右手
        $("#hotsell").hover(function(){
            $("#hotsell .preNext").show();
        },function(){
            $("#hotsell .preNext").hide();
        });


        //用户退出 点击
        $("#quite").click(function(){
        	$("#quiteWin,#laybg").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#quiteWin input").click(function(){
        	$("#quiteWin,#laybg").hide();
        });
});
