/**
 对JavaScript 扩张，类似Java中this.jsonString.startsWith(prefix)
 判断字符串是否是以str为开头的
 */
String.prototype.startWith=function(str){
    if(str==null||str==""||this.length==0||str.length>this.length)
        return false;
    if(this.substr(0,str.length)==str)
        return true;
    else
        return false;
    return true;
}