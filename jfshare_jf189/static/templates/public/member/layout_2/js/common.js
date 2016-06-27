function divClose(i){
    $(i).hide();
}
function center(i) {
    var _scrollHeight = $(document).scrollTop(), //获取当前窗口距离页面顶部高度
        _windowHeight = $(window).height(), //获取当前窗口高度
        _windowWidth = $(window).width(), //获取当前窗口宽度
        _popupHeight = $(i).height(), //获取弹出层高度
        _popupWeight = $(i).width();//获取弹出层宽度
    _posiTop = (_windowHeight - _popupHeight) / 2;
    _posiTop2 = (_windowHeight - _popupHeight) / 2 - _scrollHeight;
    _posiLeft = (_windowWidth - _popupWeight) / 2;
    $(i).css({"left":_posiLeft + "px", "top":_posiTop + "px", "display":"block", "position":"fixed", "z-index":"30003"});
    var isIE = !!window.ActiveXObject;
    var isIE6 = isIE && !window.XMLHttpRequest;
    if (isIE) {
        if (isIE6) {
            $(i).css({"left":_posiLeft + "px", "display":"block", "position":"absolute", "bottom":"0"});
            $("html, body").animate({ scrollTop:0 }, 120);
        }
    }
}



