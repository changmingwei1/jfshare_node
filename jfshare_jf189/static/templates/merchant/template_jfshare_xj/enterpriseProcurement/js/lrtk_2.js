// JavaScript Document
$(document).ready(function(e) {
	/***不需要自动滚动，去掉即可***/
	time = window.setInterval(function(){
		$('.og_next_2').click();	
	},5000);
	/***不需要自动滚动，去掉即可***/
	linum = $('.mainlist_2 li').length;//图片数量
	w = linum * 190;//ul宽度
	$('.piclist_2').css('width', w + 'px');//ul宽度
	$('.swaplist_2').html($('.mainlist_2').html());//复制内容
	
	$('.og_next_2').click(function(){
		
		if($('.swaplist_2,.mainlist_2').is(':animated')){
			$('.swaplist_2,.mainlist_2').stop(true,true);
		}
		
		if($('.mainlist_2 li').length>5){//多于4张图片
			ml = parseInt($('.mainlist_2').css('left'));//默认图片ul位置
			sl = parseInt($('.swaplist_2').css('left'));//交换图片ul位置
			if(ml<=0 && ml>w*-1){//默认图片显示时
				$('.swaplist_2').css({left: '950px'});//交换图片放在显示区域右侧
				$('.mainlist_2').animate({left: ml - 950 + 'px'},'slow');//默认图片滚动				
				if(ml==(w-950)*-1){//默认图片最后一屏时
					$('.swaplist_2').animate({left: '0px'},'slow');//交换图片滚动
				}
			}else{//交换图片显示时
				$('.mainlist_2').css({left: '950px'})//默认图片放在显示区域右
				$('.swaplist_2').animate({left: sl - 950 + 'px'},'slow');//交换图片滚动
				if(sl==(w-950)*-1){//交换图片最后一屏时
					$('.mainlist_2').animate({left: '0px'},'slow');//默认图片滚动
				}
			}
		}
	})
	$('.og_prev_2').click(function(){
		
		if($('.swaplist_2,.mainlist_2').is(':animated')){
			$('.swaplist_2,.mainlist_2').stop(true,true);
		}
		
		if($('.mainlist_2 li').length>5){
			ml = parseInt($('.mainlist_2').css('left'));
			sl = parseInt($('.swaplist_2').css('left'));
			if(ml<=0 && ml>w*-1){
				$('.swaplist_2').css({left: w * -1 + 'px'});
				$('.mainlist_2').animate({left: ml + 950 + 'px'},'slow');				
				if(ml==0){
					$('.swaplist_2').animate({left: (w - 950) * -1 + 'px'},'slow');
				}
			}else{
				$('.mainlist_2').css({left: (w - 950) * -1 + 'px'});
				$('.swaplist_2').animate({left: sl + 950 + 'px'},'slow');
				if(sl==0){
					$('.mainlist_2').animate({left: '0px'},'slow');
				}
			}
		}
	})    
});

$(document).ready(function(){
	$('.og_prev_2,.og_next_2').hover(function(){
			$(this).fadeTo('fast',1);
		},function(){
			$(this).fadeTo('fast',0.7);
	})

})

