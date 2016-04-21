var hbs = require("express-hbs");


hbs.registerHelper({
    'menu-tree': function(result, options){
        /*
    console.log('---------->' + result);
    console.log('---------->' + options);
*/

    var str = ''
            +'<li><a class="ajax-link" href="javascript:;"><i class="glyphicon glyphicon-home"></i><span> 欢迎主页</span></a></li>'
            +'<li class="accordion">'
            +'	<a href="javascript:;"><i class="glyphicon glyphicon-plus"></i><span>商品管理</span></a>'
            +'	<ul class="nav nav-pills nav-stacked">'
            +'		<li><a href="/product/reviewList">审核列表</a></li>'
            +'	</ul>'
            +'</li>'

            //+'<li class="accordion">'
            //+'	<a href="#"><i class="glyphicon glyphicon-plus"></i><span>订单管理</span></a>'
            //+'	<ul class="nav nav-pills nav-stacked">'
            //+'		<li><a href="/">订单列表</a></li>'
            //+'		<li><a href="/">批量发货</a></li>'
            //+'		<li><a href="/">超卖处理</a></li>'
            //+'	</ul>'
            //+'</li>'
            +'<li class="accordion">'
            +'	<a href="javascript:;"><i class="glyphicon glyphicon-plus"></i><span>首页广告位管理</span></a>'
            +'	<ul class="nav nav-pills nav-stacked">'
            +'		<li><a href="/slotImage/slotImageList/1">首页轮播广告位</a></li>'
            +'		<li><a href="/slotImage/slotImageList/2">首页静态广告位</a></li>'
            +'	</ul>'
            +'</li>'
           /*
        +'<li><a class="ajax-link" href="index.html"><i class="glyphicon glyphicon-home"></i><span> Dashboard</span></a></li>'
            +'<li class="nav-header hidden-md">Sample Section</li>'
        +'<li><a class="ajax-link" href="ui.html"><i class="glyphicon glyphicon-eye-open"></i><span> UI Features</span></a></li>'
        +'<li><a class="ajax-link" href="form.html"><i class="glyphicon glyphicon-edit"></i><span> Forms</span></a></li>'
        +'<li><a class="ajax-link" href="chart.html"><i class="glyphicon glyphicon-list-alt"></i><span> Charts</span></a></li>'
        +'<li><a class="ajax-link" href="typography.html"><i class="glyphicon glyphicon-font"></i><span> Typography</span></a></li>'
        +'<li><a class="ajax-link" href="gallery.html"><i class="glyphicon glyphicon-picture"></i><span> Gallery</span></a></li>'
        +'<li><a class="ajax-link" href="table.html"><i class="glyphicon glyphicon-align-justify"></i><span> Tables</span></a></li>'
        +'<li><a class="ajax-link" href="calendar.html"><i class="glyphicon glyphicon-calendar"></i><span> Calendar</span></a></li>'
        +'<li><a class="ajax-link" href="grid.html"><iclass="glyphicon glyphicon-th"></i><span> Grid</span></a></li>'
        +'<li><a href="tour.html"><i class="glyphicon glyphicon-globe"></i><span> Tour</span></a></li>'
        +'<li><a class="ajax-link" href="icon.html"><i class="glyphicon glyphicon-star"></i><span> Icons</span></a></li>'
        +'<li><a href="error.html"><i class="glyphicon glyphicon-ban-circle"></i><span> Error Page</span></a></li>'
        +'<li><a href="login.html"><i class="glyphicon glyphicon-lock"></i><span> Login Page</span></a></li>'
        */
        ;

       // console.log('---------->' + str);

        return new hbs.SafeString(str);
    },

    //'formatnumber': function(num, options){
    //    num = num + '';
    //    return num.replace(/(?=(?!^)(?:\d{3})+(?:\.|$))(\d{3}(\.\d+$)?)/g,',$1');
    //}

});


//hbs.registerHelper({
//    'attribute-list': function (data, options) {
//        console.log('data---------->' + data);
//        //console.log('options.fn()---------->' + options.fn(data[0]));
//        var str = '<tr><td>1</td><td>2</td></tr>';
//        for(var i= 0, l=data.length; i<l; i++){
//            str=str+'<tr><td>'+data[i].id+'</td><td>'+data[i].name+'</td></tr>'
//        }
//        //data.forEach(function (e) {
//        //    str+"<tr><td>1</td><td>"+ e.id+"</td></tr>"
//        //    //str = str
//        //    //    + '<tr>'
//        //    //    + '<td>e.name</td>'
//        //    //    + '<td><input type=\'text\' class=\'input-sm form-control\' id=\'attr_\'+e.id placeholder=\'Email\'></td>'
//        //    //    + '</tr>';
//        //});
//
//        console.log('---------->' + str);
//        return new hbs.SafeString(str);
//    }
//
//});

