$(function(){
	$(".note").click(function(){
        $("#addressDefault").removeAttr("id");
        $(this).parent().parent().attr("id","addressDefault");
    });
        
});

function onLoadCity()
{      
    var province=$("#select1").find("option:selected").val();
    if(province!="")
    {  
        $("#HiddenField1").val(province);
        $.getJSON("ajaxManager.aspx?Type=City&province="+province+"&tt="+Math.random(),
        function (json) { 
            var _Obj = document.getElementById("select2"); 
            _Obj.length = 0; 
            _Obj.options.add(new Option("选择市", ""));
            if (json) {
                if(json.length==0)
                {
                    $("#HiddenField2").val("");
                    $("#HiddenField3").val("");
                    $("#HidLevel").val("1");
                    _Obj.style.display="none";
                    var _Obj3=document.getElementById("select3");
                    _Obj3.length = 0; 
                    _Obj3.style.display="none";
                    
                }
                else{
                    $("#HidLevel").val("2");
                    _Obj.style.display="";
                    $.each(json, function (i) { 
                        var pro_name = json[i].name;
                        _Obj.options.add(new Option(pro_name, pro_name));
                    });
                    $("#HiddenField2").val(json[0].name);
                    var _Obj3=document.getElementById("select3");
                    _Obj3.length = 0; 
                    _Obj3.style.display="none";
                }
            } 
        });
    }
}

function onLoadArea()
{
    var province=$("#select1").find("option:selected").val();
    var city=$("#select2").find("option:selected").val();
    if(province!="" && city!="")
    { 
        $("#HiddenField2").val(city); 
        $.getJSON("ajaxManager.aspx?Type=Area&province="+province+"&city="+city+"&tt="+Math.random(),
        function (json) { 
            var _Obj = document.getElementById("select3"); 
            _Obj.length = 0; 
            _Obj.options.add(new Option("选择区", ""));
            if (json) {
                if(json.length==0)
                {
                    $("#HiddenField3").val("");
                    $("#HidLevel").val("2");
                    _Obj.style.display="none"; 
                }
                else{
                    $("#HidLevel").val("3");
                    _Obj.style.display=""; 
                    $.each(json, function (i) { 
                        var pro_name = json[i].name;
                        _Obj.options.add(new Option(pro_name, pro_name));
                    });
                    $("#HiddenField3").val(json[0].name);
                }
            } 
        });
        
    }
}
function onSelectArea()
{
    var area=$("#select3").find("option:selected").val();
    $("#HiddenField3").val(area);
}
