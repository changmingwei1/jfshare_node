var _imgServ = "http://120.24.153.102:3000/system/v1/jfs_image/";
var _indexURL = "http://120.24.153.102:13001";
var _productDetailServerURL = 'http://120.24.153.102:13003/product/';
//var _uploadServ = 'http://192.168.1.105:3000/system/upload';
var _uploadServ = 'http://120.24.153.102:3000/system/upload';

var opts = {
    lines: 10, // 花瓣数目
    length: 7, // 花瓣长度
    width: 5, // 花瓣宽度
    radius: 10, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#5882FA', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: '100px', // spinner 相对父容器Top定位 单位 px
    left: '50%'// spinner 相对父容器Left定位 单位 px
};

var opts_center = {
    lines: 10, // 花瓣数目
    length: 7, // 花瓣长度
    width: 5, // 花瓣宽度
    radius: 10, // 花瓣距中心半径
    corners: 1, // 花瓣圆滑度 (0-1)
    rotate: 0, // 花瓣旋转角度
    direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
    color: '#5882FA', // 花瓣颜色
    speed: 1, // 花瓣旋转速度
    trail: 60, // 花瓣旋转时的拖影(百分比)
    shadow: false, // 花瓣是否显示阴影
    hwaccel: false, //spinner 是否启用硬件加速及高速旋转
    className: 'spinner', // spinner css 样式名称
    zIndex: 2e9, // spinner的z轴 (默认是2000000000)
    top: '50%', // spinner 相对父容器Top定位 单位 px
    left: '50%'// spinner 相对父容器Left定位 单位 px
};
