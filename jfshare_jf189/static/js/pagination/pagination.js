/**
 * Created by lenovo on 2015/11/10.
 */
/**
 * 公共分页组件
 * 依赖jquery、isNumber()、empty()、pager-go.jpg
 * 引用<script type="text/javascript" src="/js/pagination/pagination.js"></script>
        .pagernext{ font-family:"KaiTi_GB2312";font-size:15px;text-align:center; padding-top:10px}
        #pagerred {color: #CC3300;text-decoration: none;}
 */

/**
 * 分页器
 * @param url 待请求url
 * @param curPage 当前页
 * @param pageSize 每页大小
 * @param callback 回调函数，处理数据显示
 */
function pager(url, curPage,pageSize,callback){
    callback(url + '&curPage='+curPage+'&pageSize='+pageSize);
}

/**
 * 跳转至第N页
 * @param url 待请求url
 * @param pageSize 每页大小
 * @param totalPages 总页数
 * @param callback 回调函数，处理数据显示
 */
function jumpPager(url, pageSize,totalPages,callback){
    var curPage=$("#textfield2").val(); //当前页
    if(!isNumber(curPage)){
        //alert("页数必须是正整数！");
        $("#textfield2").val("");
        $("#textfield2").focus();
        return;
    }
    if(curPage>totalPages)
        curPage=totalPages;
    else if(curPage<1)
        curPage=1;
    pager(url, curPage, pageSize, callback);
}

/**
 * 渲染分页组件
 * @param pagination 分页对象
 * @param pagePanel 分页容器
 * DEMO
 *var pagination = {};
 pagination.curPage = orderData.curPage; //当前页码
 pagination.pageSize = orderData.count; //每页大小
 pagination.pageCount = orderData.pageCount; //总页数
 pagination.total = orderData.total; //总记录数
 pagination.pageUrl = "list?tabState=0"; //列表url
 pagination.callback = queryOrderList; //回调函数，展示数据
 */
function renderPageHtml(pagination, pagePanel) {
    if (empty(pagination)) {
        pagination = "";
    }

    var pageDiv = new StringBuffer();
    pageDiv.append(" <!-- ajax pager -->");
    //region 分页方式1
    pageDiv.append("<DIV class='pagernext'>当前第" + pagination.curPage + "页 | 共<span id='pagerred'>" + pagination.pageCount + "</span>页 共<span id='pagerred'>" + pagination.total + "</span>条记录&nbsp;");
    if (pagination.curPage > 1) {
        pageDiv.append("<a href=\"javascript:pager('" + pagination.pageUrl + "', 1," + pagination.pageSize + "," + pagination.callback + ")\">[首页] </a>");
    }

    if(pagination.curPage > 1){
        pageDiv.append("<a href=\"javascript:pager('"+ pagination.pageUrl + "'," + (pagination.curPage-1) + "," + pagination.pageSize + "," + pagination.callback + ")\">[上一页]&nbsp;</a>");
    }
    //else out.print("上一页");

    var minShow = pagination.curPage <= 11 ? 1 : pagination.curPage-10;
    var  maxShow = pagination.pageCount < pagination.curPage+10 ? pagination.pageCount : pagination.curPage+9;
    for(var i=minShow;i<=maxShow;i++){
        if(i==pagination.curPage){
            pageDiv.append(i + "&nbsp;");
        } else{
            pageDiv.append("<a href=\"javascript:pager('"+ pagination.pageUrl + "'," + i + "," + pagination.pageSize + "," + pagination.callback + ")\">[" + i + "]&nbsp;</a>");
        }
    }

    if(pagination.curPage < pagination.pageCount){
        pageDiv.append("<a href=\"javascript:pager('"+ pagination.pageUrl + "'," + (pagination.curPage+1) + "," + pagination.pageSize + "," + pagination.callback + ")\">[下一页]</a>");
    }
    //else out.print("下一页");

    if(pagination.curPage < pagination.pageCount) {
        pageDiv.append("    <a href=\"javascript:pager('" + pagination.pageUrl + "', " + pagination.pageCount + "," + pagination.pageSize + "," + pagination.callback + ")\">[末页] </a>");
    }
    pageDiv.append("    跳转至 <input name='textfield' type='text' id='textfield2' size='2' value=''/>");
    pageDiv.append("   <input name='button' type='image' id='button' value='提交' src='/img/pager-go.jpg' onClick=\"jumpPager('"+ pagination.pageUrl + "'," + pagination.pageSize + "," + pagination.pageCount + "," + pagination.callback + ")\" align='absmiddle'/>");
    pageDiv.append("</DIV>");
    //endregion

    //region 分页方式2
    //pageDiv.append("<!--according baidu number pager -->");
    //pageDiv.append("<DIV class='pagernext'>");
    //
    //
    //pageDiv.append("<font color='gray'>找到相关结果" + pagination.total + "个</font>");
    //pageDiv.append("</DIV>");
    //pageDiv.append("<!--according baidu number pager end-->");
    //endregion 分页方式2

    pageDiv.append("<!-- ajax pager end-->");

    $("#" + pagePanel).html(pageDiv.toString());
    //console.log("-----------------------------"+  $("#" + pagePanel).html()); //输出到浏览器控制台
}