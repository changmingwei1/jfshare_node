$(function(){
       //图片轮播插件
        jQuery("#gg870").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"fold",  autoPlay:true, autoPage:true, trigger:"click" });

        $("#dropMore").click(function(){
                //if($(this).next().is(":hidden")){
                       $(this).next().toggle(); 
                //}
        });




        //开关组件
        $(".has-switch").click(function(e){
            e.stopPropagation();
            var ipt = $(this).find("input");
            var ani = $(this).children();
            //触发选中未选中
            if(ipt.prop("checked")){
                ipt.prop("checked",false);
            }else{
                ipt.prop("checked","checked");
            }
            //动画效果
            ani.removeClass("switch-animate");
            if(ani.hasClass("switch-on")){
                ani.removeClass("switch-on").addClass("switch-off switch-animate");
            }else if(ani.hasClass("switch-off")){
                ani.removeClass("switch-off").addClass("switch-on switch-animate");
            }
        });

        //用户 点击开关，只显示一次
        var onlyOne=false;
        $(".has-switch").one('click',function(){
            if(onlyOne)return false;
            onlyOne=true;
            setTimeout(function(){$("#ticketWin,#laybg2").show();},1000);
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#ticketWin input").click(function(){
            $("#ticketWin,#laybg2").hide();
        });
});
