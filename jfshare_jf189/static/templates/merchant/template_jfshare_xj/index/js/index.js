var timeout;

function display(columnId,event) {
    if (fixedMouse(event, document.getElementById("sortli_" + columnId))) {
        timeout = window.setTimeout(function () {
            var sortLay= jQuery("#sortLay_" + columnId),sortLi=jQuery('#sortli_' + columnId);
            var h= sortLay.height()-40,top=sortLi.offset().top,layTop= 0,wTop=$(window).scrollTop(),headH=522,scrollHeadH=32;
            if(h<(top-headH)) layTop=top-h-headH;
            if(wTop+scrollHeadH>headH){
                layTop=wTop+scrollHeadH-headH;
                if(top>(wTop+scrollHeadH+h)){
                    layTop=top-headH-h;
                }else if(top<wTop+scrollHeadH){
                    layTop=top-headH;
                }
            }
            sortLay.css("top",(layTop)+"px").show();
            sortLi.addClass("hover");
        }, 100);
    }
}
function noDisplay(columnId, event) {
    if (fixedMouse(event, document.getElementById("sortli_" + columnId))) {
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function () {
            jQuery("#sortLay_" + columnId).hide();
            jQuery('#sortli_' + columnId).removeClass("hover");
        }, 100);
    }
}
function removedisplay() {
    window.clearTimeout(timeout);
}
function contains(p, c) {
    return p.contains ? p != c && p.contains(c) : !!(p.compareDocumentPosition(c) & 16);
}
function displayItem(event){
    if (fixedMouse(event, document.getElementById("sort_layer"))){
        var len=jQuery("#sort_layer div.item").length;
        if(len>11){
            var $sort_layer=jQuery("#sort_layer");
            if($sort_layer.css("position")=="relative"){
                $sort_layer.css({"height":"auto","position":"absolute"});
                jQuery("#sort_layer div.item:gt(10)").show();
            }
        }
    }
}
function noDisplayItem(event){
    if (fixedMouse(event, document.getElementById("sort_layer"))){
        var len=jQuery("#sort_layer div.item").length;
        if(len>11){
            var $sort_layer=jQuery("#sort_layer");
            if($sort_layer.css("position")=="absolute"){
                $sort_layer.css({"height":"400px","position":"relative"});
                jQuery("#sort_layer div.item:gt(10)").hide();
            }
        }
    }
}
function fixedMouse(e, target) {
    if (e == null || e == 'undefind') return false;
    var related, type = e.type.toLowerCase();//这里获取事件名字
    if (type == 'mouseover') {
        related = e.relatedTarget || e.fromElement
    } else if (type = 'mouseout') {
        related = e.relatedTarget || e.toElement
    } else return true;
    return related && related.prefix != 'xul' && !contains(target, related) && related !== target;

}