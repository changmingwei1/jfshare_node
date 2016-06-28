$(function(){
		//导航菜单中的图片轮播
		jQuery("#mob01").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
		jQuery("#mob02").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
	 


        //用户退出 点击
        $("#quite").click(function(){
        	$("#quiteWin,#laybg").show();
        });
        //退出弹窗点击“确认”或“取消”,弹窗关闭
        $("#quiteWin input").click(function(){
        	$("#quiteWin,#laybg").hide();
        });


        //饼图数据之一
        var chartDate=[
                //月份，新增计分，消费，奖励，其他，网龄
                {
                        "mm":8,
                        "addv":88,
                        "a": 123,
                        "b": 456,
                        "c": 123,
                        "d": 456
                },
                 {
                        "mm":7,
                        "addv":188,
                        "a": 1203,
                        "b": 56,
                        "c": 13,
                        "d": 6
                },
                {
                        "mm":6,
                        "addv":38,
                        "a": 123,
                        "b": 46,
                        "c": 23,
                        "d": 4
                },
                 {
                        "mm":5,
                        "addv":88,
                        "a": 123,
                        "b": 46,
                        "c": 13,
                        "d": 46
                }
        ];
        //饼图
        $('#chart01').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                colors:['#ffcc33','#996699','#666699','#cccccc'],//颜色顺序，黄，紫，蓝，灰
                series: [{
                    type: 'pie',
                    name: '积分使用情况',
                    data: [
                        {name: '消费积分',
                            y: 57.8,
                            sliced: true,
                            selected: true},
                        ['奖励积分',       26.8],
                        ['其他积分',    14.7],
                        ['网龄积分',   0.7]
                    ]
                }]
            });
        
        $('#chart02').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                colors:['#ffcc33','#996699','#666699','#cccccc'],//颜色顺序，黄，紫，蓝，灰
                series: [{
                    type: 'pie',
                    name: '积分使用情况',
                    data: [
                        {name: '消费积分',
                            y: 57.8,
                            sliced: true,
                            selected: true},
                        ['奖励积分',       26.8],
                        ['其他积分',    14.7],
                        ['网龄积分',   0.7]
                    ]
                }]
            });

$('#chart03').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                colors:['#ffcc33','#996699','#666699','#cccccc'],//颜色顺序，黄，紫，蓝，灰
                series: [{
                    type: 'pie',
                    name: '积分使用情况',
                    data: [
                        {name: '消费积分',
                            y: 57.8,
                            sliced: true,
                            selected: true},
                        ['奖励积分',       26.8],
                        ['其他积分',    14.7],
                        ['网龄积分',   0.7]
                    ]
                }]
            });

$('#chart04').highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                        }
                    }
                },
                colors:['#ffcc33','#996699','#666699','#cccccc'],//颜色顺序，黄，紫，蓝，灰
                series: [{
                    type: 'pie',
                    name: '积分使用情况',
                    data: [
                        {name: '消费积分',
                            y: 57.8,
                            sliced: true,
                            selected: true},
                        ['奖励积分',       26.8],
                        ['其他积分',    14.7],
                        ['网龄积分',   0.7]
                    ]
                }]
            });
        jQuery("#chartCarousel").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",  autoPlay:true, autoPage:true, trigger:"click" });
        jQuery("#chartCarousel2").slide({ titCell:".hd ul", mainCell:".bd ul", effect:"left",interTime:5000, autoPlay:true, autoPage:true, trigger:"click" ,
                endFun:function(i,c){//其中i为当前分页，c为总页数
                        //console.log("当前第"+i);
                        $("#chartMon").text(chartDate[i].mm);
                        $("#chartAdd").text(chartDate[i].addv);
                        $("#num1").removeAttr("style").addClass("fadeIn").delay(100).animate({left: 0, opacity: 1},500).find("b").text(chartDate[i].a);
                        $("#num2").removeAttr("style").addClass("fadeIn").delay(200).animate({left: 0, opacity: 1},500).find("b").text(chartDate[i].b);
                        $("#num3").removeAttr("style").addClass("fadeIn").delay(300).animate({left: 0, opacity: 1},500).find("b").text(chartDate[i].d);
                        $("#num4").removeAttr("style").addClass("fadeIn").delay(400).animate({left: 0, opacity: 1},500).find("b").text(chartDate[i].d);
                }
        });

        //表格鼠标经过样式
        $(".tableChart").each(function(){
                $(this).find("tr").hover(function(){
                        $(this).addClass("trhover");
                },function(){
                        $(this).removeClass("trhover");
                });
                $(this).find("tr:even").addClass("even");
        });
});
