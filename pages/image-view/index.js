var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;
import config from '../../config';

var GetImage = function(id) {
    return Store(config.serverIp + 'imageViewData', { computerId: id }).then(
        function(json, isSuccess) {
            return Deferred().resolve(json.data);
        }
    );
};

Page({
    data: {
        mainHeight: '',
        swiperCurrentIndex: 0,
        swiperDuration: 0,
        showSwiper: false
    },

    totalCount: 0,

    onLoad: function(searchObj) {
        var that = this;
        var computerId = searchObj.computerId;
        var img = searchObj.computerImg;
        var systemInfo = wx.getSystemInfoSync();
        var mainHeight = systemInfo.windowHeight + 'px';

        that.searchObj = searchObj;

        GetImage(computerId).then(function(data) {
            // 伪造图片
            var n = parseInt(3 + 5 * Math.random());
            that.totalCount = n;

            var imageList = [];
            for (var i = 0; i < n; i++) {
                imageList.push(img);
            }
            // 设置页面标题

            wx.setNavigationBarTitle({ title: '1/' + that.totalCount });

            that.setData({
                pageTitle: searchObj.computerName,

                mainHeight: mainHeight,

                imageList: imageList,

                showSwiper: true,

                swiperCurrentIndex: 0
            });
            wx.hideToast();
        });
    },
    onSlideChange: function(e) {
        var that = this;
        var currentIndex = e.detail.current;
        wx.setNavigationBarTitle({
            title: currentIndex + 1 + '/' + that.totalCount
        });
    },
    onShareAppMessage: function() {
        return {
            title: 'xxxx',
            desc: '【' + this.data.pageTitle + '】图片',
            path:
                '/computer/serial/index?id=' +
                Utils.objToParams(this.searchObj, true)
        };
    }
});
