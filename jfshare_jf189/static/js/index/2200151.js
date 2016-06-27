//设置iframe的大小
function sethash() {
    var hashH = document.documentElement.scrollHeight;
    var urlC = "http://jf.189.cn/CommonPage/fixHeight.html";
    var resizeFrame = document.createElement("iframe");
    resizeFrame.src=urlC + "#" + hashH;
    resizeFrame.id="iframeA";
    resizeFrame.name="iframeA";
    resizeFrame.style.display="none";
    document.body.appendChild(resizeFrame);
}
window.onload = sethash;  