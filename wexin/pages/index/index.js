var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;

var GetComputerData = function(){
    return Store('http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/data/brandData.json', null, {
        cache: {},
        detaFilter: null,
    }).then(function(json, isSuccess){

        return Deferred().resolve(json.data);
    })
};
var computerHotData = [{"id": "1", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/apple.jpg", "name": "Apple"},{"id": "2", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/de.jpg", "name": "戴尔"},{"id": "3", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/hp.jpg", "name": "惠普"},{"id": "4", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/hs.jpg", "name": "华硕"},{"id": "5", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/sz.jpg", "name": "神舟"},{"id": "6", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/lx.jpg", "name": "联想"},{"id": "7", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/sx.jpg", "name": "三星"},{"id": "8", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/thinkpad.jpg", "name": "thankpad"},{"id": "9", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/wr.jpg", "name": "微软"},{"id": "10", "logo": "http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/xm.jpg", "name": "小米"},]
Page({
    data: {
        enableScroll: true,
        heightStyle: ''
    },
    onLoad: function(){
        var that = this;
        var systemInfo = wx.getSystemInfoSync();
       // console.log(systemInfo)
        //设置heightStyle后才能滚动
        var heightStyle = 'height:' + systemInfo.windowHeight + 'px';
        wx.showToast({title: '', icon: 'loading', duration: 20000, mask: true});

        GetComputerData().then(function(computerData){
            //所有字母的高度
            var singleHeight = 36 * systemInfo.windowWidth / 750;
            var letterHeight = (computerData.letter.length + 1) * singleHeight;

            that.data.singleHeight = singleHeight;
            that.data.letterToTop = (systemInfo.windowHeight - letterHeight) / 2;

            that.setData({
                computerData: computerData,
                computerHot: computerHotData,
                heightStyle: heightStyle
            });
            wx.hideToast();
        })
    },
    onTapBrand: function(e){
        var id = e.currentTarget.dataset.id;
        wx.showToast({title:'', icon: 'loading', duration: 20000, mask: true});
        wx.navigateTo({url: '/pages/brand/index?id=' + id});
    },
    // 点击右侧字母
    onTapSelectLetter: function(e){
        console.log("ontapselectletter")
        var letter = e.currentTarget.dataset.letter
        this.setData({
            activeId: letter
        })
    },
    // 移动快速字母
    onTouchMoveLetter: function(e){
        console.log("onTouchmoveletter")
        var touchY = e.changedTouches[0].clientY;
        var letterList = this.data.computerData.letter;
        var activeLetterIndex = Math.ceil((touchY - this.data.letterToTop) / this.data.singleHeight ) - 1;
        activeLetterIndex = Math.min( Math.max(0, activeLetterIndex), letterList.length);
        this.data.activeLetterIndex = activeLetterIndex;
        this.setData({
            activeId: (activeLetterIndex == 0 ? 're' : letterList[activeLetterIndex - 1]),
        })
    },
    onTouchStart: function(){
        console.log("ontouchstart")
        this.setData({enableScroll: false});
    },
    onTouchEnd: function(){
        console.log("ontouchend")
        this.setData({
            enableScroll: true,
        });
    },
    onShareAppMessage: function(){
        return {
            title: 'computer',
            desc: '查询',
            path: '/computer/index/index'
        }
    }
});
//每一个小程序页面也可以使用.json文件来对本页面的窗口表现进行配置。
// 页面的配置比app.json全局配置简单得多，只是设置 app.json 中的 window 配置项的内容，页面中配置项会覆盖 app.json 的 window 中相同的配置项。
//disableScroll true 则页面整体不能上下滚动；只在 page.json 中有效，无法在 app.json 中设置该项