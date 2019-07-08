Page({
    data: {
        heightStyle: ""
    },
    onLoad: function(){
        var that = this;
        var systemInfo = wx.getSystemInfoSync();
        var heightStyle = 'height:' + systemInfo.windowHeight + 'px';
        that.setData({
            heightStyle: heightStyle
        })
    },
    onShareAppMessage: function(){
        return {
            title: 'Computer',
            desc: 'computer video',
            path: '/about/video/index'
        }
    }
})