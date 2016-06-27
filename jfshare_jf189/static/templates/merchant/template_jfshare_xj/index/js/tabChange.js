jQuery(function(jq){
    function changeTab(lis, divs){
        lis.each(function(i){
            var els = jq(this);
            els.mouseenter(function(){
                lis.removeClass();
                divs.stop().hide().animate({'opacity':0},0);
                jq(this).addClass("libg_A");
                divs.eq(i).show().animate({'opacity':1},0);
            });
        });
    }
    var rrE = jq("#turn_A");
    changeTab(rrE.find(".menu_A li"), rrE.find(".turn_A"));
});