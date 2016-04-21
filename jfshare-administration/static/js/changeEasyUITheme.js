/**
 * Created by Lenovo on 2015/9/18.
 */
function changeThemeFun(themeName) {/* ¸ü»»Ö÷Ìâ */
    var $easyuiTheme = $('#easyuiTheme');
    var url = $easyuiTheme.attr('href');

    var href = url.substring(0, url.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
    $easyuiTheme.attr('href', href);

    console.log('--------------->' + href);

    $.cookie('easyuiThemeName', themeName, {
        expires : 7
    });
};

if ($.cookie('easyuiThemeName')) {
    console.log('-------->cookie exists theme setting');
    changeThemeFun($.cookie('easyuiThemeName'));
}
