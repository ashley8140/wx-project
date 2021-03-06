var LOCAL_USER_KEY = 'local_user_key';

var city = require('./public/core/city.js');
var core = require('./public/core/main.js');
var SystemInfo = wx.getSystemInfoSync();
//console.log(SystemInfo);
App({
    onLaunch: function() {
        var that = this;
        try {
            //同步获取当前storage的相关信息,获取本地存储的用户信息 姓名/电话/城市,首次为空
            that.localUser = wx.getStorageSync(LOCAL_USER_KEY);
        } catch (e) {}
        if (!that.localUser || !that.localUser.city) {
            that.postLocationCity();
        }
    },
    core: core,
    city: city,
    SystemInfo: SystemInfo,
    localUser: {},
    setLocalUser: function(user) {
        var that = this;
        var User = core.Utils.choose(
            core.Utils.extend({}, that.localUser, user),
            ['city', 'name', 'phone']
        );
        try {
            that.localUser = User;
            wx.setStorageSync(LOCAL_USER_KEY, User);
        } catch (e) {}
    },
    //发起定位
    postLocationCity: function() {
        var that = this;
        wx.getLocation({
            type: 'wgs84', //默认值
            success: function(res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                wx.request({
                    url: 'https://api.map.baidu.com/geocoder/v2/',
                    data: {
                        pois: 0, //不显示周边
                        output: 'json',
                        location: latitude + ',' + longitude,
                        ak: 'fXlXeVy8zYBwIn6hUm1LLa3I0WpqWbKA'
                    },
                    method: 'GET',
                    success: function(data) {
                        var code;
                        try {
                            code = data.data.result.addressComponent.adcode;
                            code = '420100';
                        } catch (e) {}

                        if (code && city.getForCode(code)) {
                            that.setLocalUser({ city: code });
                        }
                    }
                });
            }
        });
    },
    getPageCity: function() {
        var cityCode = '110000';
        if (this.localUser) {
            cityCode = this.localUser.city;
        }
        return city.getForCode(cityCode);
    },
    rpxTpPx: function() {
        return (SystemInfo.windowWidth / 750) * rpx;
    }
});
