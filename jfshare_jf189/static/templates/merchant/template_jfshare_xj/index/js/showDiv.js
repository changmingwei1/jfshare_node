$(document).ready(function(){
    //Full Caption Sliding (Hidden to Visible)
    $('.boxgrid.captionfull').hover(function(){
        $(".cover", this).stop().animate({top:'117px'},{queue:false,duration:160});
    }, function() {
        $(".cover", this).stop().animate({top:'147px'},{queue:false,duration:160});
    });
    //Full Caption Sliding (Hidden to Visible)
    $('.boxgrid.captionfull_a').hover(function(){
        $(".cover", this).stop().animate({top:'120px'},{queue:false,duration:160});
    }, function() {
        $(".cover", this).stop().animate({top:'150px'},{queue:false,duration:160});
    });
    //Full Caption Sliding (Hidden to Visible)
    $('.boxgrid.captionfull_b').hover(function(){
        $(".cover", this).stop().animate({top:'271px'},{queue:false,duration:160});
    }, function() {
        $(".cover", this).stop().animate({top:'301px'},{queue:false,duration:160});
    });
    //Full Caption Sliding (Hidden to Visible)
    $('.boxgrid.captionfull_c').hover(function(){
        $(".cover", this).stop().animate({top:'271px'},{queue:false,duration:160});
    }, function() {
        $(".cover", this).stop().animate({top:'301px'},{queue:false,duration:160});
    });
});