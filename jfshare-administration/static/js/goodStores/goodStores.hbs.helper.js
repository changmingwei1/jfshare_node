
Handlebars.registerHelper("showImage",function(imgUrl,options){
    var img=imgUrl.split(",");
    console.log(_imgServ + img[0]);
    return new Handlebars.SafeString(_imgServ + img[0]);
});


