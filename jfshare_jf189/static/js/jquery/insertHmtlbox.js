//根据传入参数的对象ID，把对象内容插进弹出层中
var B_WIDTH
var B_HEIGHT
function divboxshow(insertId,width,height)
{
    B_WIDTH = width- 30;
    B_HEIGHT = height-45;
	if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
		jQuery("body","html").css({height: "100%", width: "100%"});
		jQuery("html").css("overflow","hidden");
		if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
			jQuery("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay' style='z-index:9000'></div><div id='TB_window'  style='z-index:9900'></div>");
		}
	}else{//all others
		if(document.getElementById("TB_overlay") === null){
			jQuery("body").append("<div id='TB_overlay'  style='z-index:9000'></div><div id='TB_window' style='z-index:9900'></div>");
		}
	}
	var loaddiv = jQuery("#"+insertId);
	jQuery("body").append("<div id='TB_load'  style='z-index:9999'>" +loaddiv.html()+"</div>");
	position();
	jQuery('#TB_load').show();
}
function divboxhide()
{
	jQuery("#TB_window").fadeOut("fast",function(){jQuery('#TB_window,#TB_overlay,#TB_HideSelect').remove();});
	jQuery("#TB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
		jQuery("body","html").css({height: "auto", width: "auto"});
		jQuery("html").css("overflow","");
	}
}
function position() {
    $("#TB_load").css({marginLeft: '-' + parseInt((B_WIDTH / 2),10) + 'px', width: B_HEIGHT + 'px'});
	if ( !(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
		$("#TB_load").css({marginTop: '-' + parseInt((B_HEIGHT / 2),10) + 'px'});
	}
}