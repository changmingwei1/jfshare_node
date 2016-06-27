
var currMid=0;
var currPid=0;
var imgPath=_param.frontPath+"/ykfood/templets/"+_param.webIndex+"/Default/images/loadingfavourite.gif";
var categoryLink=_param.frontPath+"/cn/member/isfavoriteAdd.jsp";
var h="285";
var w="386";
function addFavor(mid,pid,height,width){
  currMid=mid;
  currPid=pid;
  var evt=getEvent();
  var element=evt.target||evt.srcElement;
  var objH=height==null||height==""?h:height;
  var objW=width==null||width==""?w:width;
var layer=document.getElementById("tb_layer");
//var layer1=layer.parentNode;
  if(layer!=null){
 document.body.removeChild(layer);
    //layer1.removeChild(layer);
 createLayerfav(objH,objW,element);
 }else{
  createLayerfav(objH,objW,element);
   //layer.parentNode.removeChild(layer);
 }
 return true;
}

function createLayerfav(height,width,element){
  var top=0;
  var left=0;
  var el=element;
  var elWidth=element.offsetWidth;
  while(el){
    top+=el.offsetTop;
    left+=el.offsetLeft;
    el=el.offsetParent;
  }
  var obj=document.createElement("div");
  obj.id="tb_layer";
  obj.style.cssText="position:absolute; z-index:999";
  obj.style.height=height+"px";
  obj.style.width=width+"px";
  obj.style.top=top-height-5+"px";
  if((width-elWidth)/2>document.body.offsetWidth-elWidth-left){
    obj.style.left=left-(width-elWidth)+"px";
  }else if((width-elWidth)/2>left-document.body.offsetLeft){
    obj.style.left=left+"px";
  }else{
    obj.style.left=left-((width-elWidth)/2)+"px";
  }
  var html="<div id='imgDiv' style='padding:100px 0 0 180px;'><img src='"+imgPath+"'/></div>";
  html+="<iframe id='tb_frame' allowTransparency='true'  name='tb_frame' width='100%' frameborder='0' height='100%' scrolling='no' src='' style='display:none; ' onload='loadAfter();'></iframe>";
  obj.innerHTML=html;
  document.body.appendChild(obj);
 document.getElementById("tb_frame").src=categoryLink+"?type=product&objId=" + currPid;
}
function loadAfter(){
  document.getElementById("imgDiv").style.display="none";
  document.getElementById("tb_frame").style.display="block";
}
function closeLayer(){
  document.getElementById("tb_layer").style.display="none";
}
function getEvent(){
  if(document.all){
    return window.event;//如果是ie
  }
  func=getEvent.caller;
  while(func!=null){
    var arg0=func.arguments[0];
    if(arg0){
      if((arg0.constructor==Event||arg0.constructor==MouseEvent)
       ||(typeof(arg0)=="object"&&arg0.preventDefault&&arg0.stopPropagation)){
          return arg0;
       }
    }
    func=func.caller;
  }
  return null;
}
