/***
 *  公共资源工具包
 ***/

//图片服务路径
var img_bath = "http://101.201.39.61:3000/system/v1/jfs_image/";
//var img_bath = "http://10.46.172.190:3000/system/v1/jfs_image/";
var jf189_bath = "http://ct100.jfshare.com/jf189/index";

var tools ={
	fAddFavorite:function(sTitle, sURL) {
		if (document.all)
			window.external.AddFavorite(sURL, sTitle);
		else
			window.sidebar.addPanel(sTitle, sURL, '');
	},
	setasHome:function(homeurl){
		if(window.netscape){
			try {  
			  netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			  prefs.setCharPref('browser.startup.homepage',homeurl);  
			}  
			catch (e)  
			{  
			  alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");  
			}
			
		}else{
			document.body.style.behavior='url(#default#homepage)';
			document.body.setHomePage(homeurl);
		}
	},
	getObj:function(id){
		return document.getElementById(id);
	},
	addEvent:function(el, name, fn) {
    el = document.getElementById(el);
		if (!el) return;
		if (el.addEventListener) {
			return el.addEventListener(name, fn, false)
		} else {
			return el.attachEvent('on' + name, fn)
		}
	},
	GoTop:function(){
    window.scrollTo(0,0);
	}
}
function StringBuffer() {
    this._strings_ = new Array();
}

StringBuffer.prototype.append = function(str) {
    this._strings_.push(str);
};

StringBuffer.prototype.toString = function() {
    return this._strings_.join("");
};

String.prototype.startWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
		return false;
	if(this.substr(0,str.length)==str)
		return true;
	else
		return false;
	return true;
}

//region 工具类
function getZoomImg(imgsrc, size) {
	return getFileNameNoExt(imgsrc) + "_" + size + getFileExt(imgsrc);
}
//取文件后缀名
function getFileExt(filepath) {
	if (filepath != "") {
		var pos = "." + filepath.replace(/.+\./, "");
		return pos;
	}
}
//取文件全名名称
function getFileName(filepath) {
	if (filepath != "") {
		var names = filepath.split("\\");
		return names[names.length - 1];
	}
}
//字符串逆转
function strturn(str) {
	if (str != "") {
		var str1 = "";
		for (var i = str.length - 1; i >= 0; i--) {
			str1 += str.charAt(i);
		}
		return (str1);
	}
}
//取文件名不带后缀
function getFileNameNoExt(filepath) {
	var pos = strturn(getFileExt(filepath));
	var file = strturn(filepath);
	var pos1 =strturn( file.replace(pos, ""));
	var pos2 = getFileName(pos1);
	return pos2;
}

/**
 * 判断变量是否空值
 * undefined, null, '', false, 0, [], {} 均返回true，否则返回false
 */
function empty(v) {
	switch (typeof v) {
		case 'undefined' :
			return true;
		case 'string'    :
			if ($.trim(v).length == 0) return true;
			break;
		case 'boolean'   :
			if (!v) return true;
			break;
		case 'number'    :
			if (0 === v) return true;
			break;
		case 'object'    :
			if (null === v) return true;
			if (undefined !== v.length && v.length == 0) return true;
			for (var k in v) {
				return false;
			}
			return true;
			break;
	}
	return false;
}

/**
 * 获取非空字符串
 * @param v
 * @returns {*}
 */
function getString(v) {
	return empty(v) ? "" : v;
}

/**
 * 获取待前缀的字符串
 * 如为空则不加前缀
 * @param v 字符串
 * @param prefix 前缀
 * @returns {*}
 */
function getStringWithPrefix(v, prefix) {
	return empty(v) ? "" : prefix + v;
}
/**
 * 获取带后缀的字符串
 * 如为空则不加后缀
 * @param v 字符串
 * @param suffix 后缀
 * @returns {*}
 */
function getStringWithSuffix(v, suffix) {
	return empty(v) ? "" : v + suffix;
}

/**
 * 获取带前后缀的字符串
 * 如为空则不加前后缀
 * @param v
 * @param prefix
 * @param suffix
 * @returns {*}
 */
function getStringWithffix(v, prefix, suffix) {
	return empty(v) ? "" : prefix + v + suffix;
}

/**
 * 是否为数字
 * @param strs 字符串
 * @returns {boolean}
 */
function isNumber(strs) {
	var Letters = "1234567890";
	var i;
	var c;
	for (i = 0; i < strs.length; i ++) {
		c = strs.charAt(i);
		if (Letters.indexOf(c) == -1) {
			return false;
		}
	}
	return true;
}

/**
 * 追加图标是否变灰背景样式
 * @param curObj 当前对象
 * @param isGary 是否变灰色
 */
function appendColorStyle(curObj, isGary) {
	//var colorStyle = isGary==1 ? "opacity: .3;cursor:no-drop;" : "opacity: 1;cursor:pointer;";
	//curObj.attr("style",empty(curObj.attr("style")) ? colorStyle : (colorStyle + curObj.attr("style").toString()
	//		.replace("opacity: 1;", "").replace("opacity: .3;", "").replace("cursor:pointer;", "").replace("cursor:no-drop;", "")));

	isGary == 1 ? curObj.addClass("opacity_transparent") : curObj.removeClass("opacity_transparent");
}

/**
 * 设置iframe自适应
 * @param frame iframeId
 * @constructor
 */
function setCwinHeight(frame) {
	var ciframe = document.getElementById(frame); //iframe id
	var bHeight = ciframe.contentWindow.document.body.scrollHeight;
	var dHeight = ciframe.contentWindow.document.documentElement.scrollHeight;
	var height = Math.max(bHeight, dHeight);
	ciframe.height = height;

	ciframe.contentWindow.document.documentElement.scrollTop= 0; //滚动条默认在顶端
}

/**
 * 克隆对象
 * @param obj 待克隆对象
 * @returns {{}}
 */
function clone(obj) {
	if(obj==null){
		return {};
	}
	var s = JSON.stringify(obj);
	return JSON.parse(s);
}

//将字符串转换为时间格式,适用各种浏览器,格式如2011-08-03 09:15:11
function GetTimeByTimeStr(dateString) {
	var timeArr=dateString.split(" ");
	var d=timeArr[0].split("-");
	var t=timeArr[1].split(":");
	return new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
}

//将时间转换为字符串格式,适用各种浏览器
function GetTimeStrByTime(time, stringType) {
	var y = time.getFullYear();
	var M = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var m = date.getMinutes();
	if(stringType==1)
	return  y + '-' + (M < 10 ? ('0' + M) : M) + '-' + (d < 10 ? ('0' + d) : d) + " " + (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m);
	return  y + '/' + (M < 10 ? ('0' + M) : M) + '/' + (d < 10 ? ('0' + d) : d) + " " + (h < 10 ? ('0' + h) : h) + ":" + (m < 10 ? ('0' + m) : m);
}
//endregion 工具类

//net 工具类
/**
 * 获取客户端ip地址
 */
function getIPv4(callback) {
	var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random();
	$.getJSON(url, function(data){
		callback(data.Ip);
	});
}