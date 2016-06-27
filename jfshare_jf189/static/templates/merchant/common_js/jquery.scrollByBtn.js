//简单滚动效果(非自动)
//version 20100609，兼容jQuery~jQuery1.3，其他未去测试
//滚动方式静态结构组成：一个position:relative相对位置静态大容器,里面的position:absolute,width设超大的滚动大容器，以及里面的每个相同结构的元素，我一般切这种效果的结构都已经是这个结构最好不要改动。
(function ($) {
	$.fn.extend({
		scrollByBtn:function(options) {
			options = $.extend({
			    i:4,//开始时可见滚动元素个数(数值保持不变，用于计算停止左按钮的滚动)
			    m:4,//开始时可见滚动元素个数(数值递增，用于计算停止右按钮的滚动)
			    l:0,//滚动大容器初始位移
			    scrollWidth:74,//滚动位移(包含间距，一次滚2个则是两个容器间距总和，不一定每个都相同间距，如广购)
			    numPerScroll:1,//每个小滚动元素一次滚多少个
			    btnL:"btnL",//左按钮id,默认按钮id要设img标签上。
			    btnR:"btnR",//右按钮id
			    scrollEach:"div",//滚动大容器中每一个相同的元素(根据结构套上jQuery的css选择器 .each或li.abc之类的，不用改结构)
			    timer:600, //滚动延迟时间
			    btnLImgPath:{able:"",disable:""},//左按钮图片路径(可按/不可按，不需按钮效果是两值设成一样)
			    btnRImgPath:{able:"",disable:""}//右按钮图片路径(可按/不可按，不需按钮效果是两值设成一样)
			}, options);

			var scrollBox = this;//滚动大容器对象
			var count=this.find(options.scrollEach).length;//取滚动元素总个数,
			var btnLObj=jQuery("#" + options.btnL);//取按钮图片对象，如果按钮Id不是设在img标签，则修改这里和下行
			var btnRObj=jQuery("#" + options.btnR);

			jQuery("#" + options.btnR).click(function(){//右按钮

				if(!scrollBox.is(":animated")){
					if(options.m<count){
						options.m=options.m+options.numPerScroll;
						scrollBox.animate({left:options.l-options.scrollWidth},options.timer);
						options.l=options.l-options.scrollWidth;
						btnLObj.attr("src",options.btnLImgPath.able);//恢复左按钮可按状态
					}
					if(options.m>=count){//控制右按钮不可按状态图片
						btnRObj.attr("src",options.btnRImgPath.disable);
					}

				}
			});

			jQuery("#" + options.btnL).click(function(){//左按钮
				if(!scrollBox.is(":animated")){
					if(options.m>options.i){
						options.m=options.m-options.numPerScroll;
						scrollBox.animate({left:options.l+options.scrollWidth},options.timer);
						options.l=options.l+options.scrollWidth;
					    btnRObj.attr("src",options.btnRImgPath.able);//恢复右按钮可按状态
					}
					if(options.m==options.i){//控制左按钮不可按状态图片
						btnLObj.attr("src",options.btnLImgPath.disable);
					}
					
				}
			});
			
		}
	});	
})(jQuery); 