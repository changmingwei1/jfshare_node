// JavaScript Document
$(document).ready(function(e) {
	/***不需要自动滚动，去掉即可***/
	time = window.setInterval(function(){
		$('.og_next_1').click();	
	},5000);
	/***不需要自动滚动，去掉即可***/
	linum = $('.mainlist_1 li').length;//图片数量
	w = linum * 231;//ul宽度
	$('.piclist_1').css('width', w + 'px');//ul宽度
	$('.swaplist_1').html($('.mainlist_1').html());//复制内容
	
	$('.og_next_1').click(function(){
		
		if($('.swaplist_1,.mainlist_1').is(':animated')){
			$('.swaplist_1,.mainlist_1').stop(true,true);
		}
		
		if($('.mainlist_1 li').length>4){//多于4张图片
			ml = parseInt($('.mainlist_1').css('left'));//默认图片ul位置
			sl = parseInt($('.swaplist_1').css('left'));//交换图片ul位置
			if(ml<=0 && ml>w*-1){//默认图片显示时
				$('.swaplist_1').css({left: '924px'});//交换图片放在显示区域右侧
				$('.mainlist_1').animate({left: ml - 924 + 'px'},'slow');//默认图片滚动				
				if(ml==(w-924)*-1){//默认图片最后一屏时
					$('.swaplist_1').animate({left: '0px'},'slow');//交换图片滚动
				}
			}else{//交换图片显示时
				$('.mainlist_1').css({left: '924px'})//默认图片放在显示区域右
				$('.swaplist_1').animate({left: sl - 924 + 'px'},'slow');//交换图片滚动
				if(sl==(w-924)*-1){//交换图片最后一屏时
					$('.mainlist_1').animate({left: '0px'},'slow');//默认图片滚动
				}
			}
		}
	})
	$('.og_prev_1').click(function(){
		
		if($('.swaplist_1,.mainlist_1').is(':animated')){
			$('.swaplist_1,.mainlist_1').stop(true,true);
		}
		
		if($('.mainlist_1 li').length>4){
			ml = parseInt($('.mainlist_1').css('left'));
			sl = parseInt($('.swaplist_1').css('left'));
			if(ml<=0 && ml>w*-1){
				$('.swaplist_1').css({left: w * -1 + 'px'});
				$('.mainlist_1').animate({left: ml + 924 + 'px'},'slow');				
				if(ml==0){
					$('.swaplist_1').animate({left: (w - 924) * -1 + 'px'},'slow');
				}
			}else{
				$('.mainlist_1').css({left: (w - 924) * -1 + 'px'});
				$('.swaplist_1').animate({left: sl + 924 + 'px'},'slow');
				if(sl==0){
					$('.mainlist_1').animate({left: '0px'},'slow');
				}
			}
		}
	})    
});

$(document).ready(function(){
	$('.og_prev_1,.og_next_1').hover(function(){
			$(this).fadeTo('fast',1);
		},function(){
			$(this).fadeTo('fast',0.7);
	})

})

