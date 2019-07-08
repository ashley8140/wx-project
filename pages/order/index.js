var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;
var city = App.city;
import config from '../../config';

var PageType = {
    enquiry: {
        type: 0,
        title: '询底价',
        pageTitle:
            '请填写准确的联系方式，工作人员会为您查询该款电脑的最低经销商报价，并以电话的方式联系您。',
        buttonText: '询底价'
    }
};

var GetData = function(id) {
    return Store(config.serverIp + 'summary', {
        id: id
    }).then(function(json, isSuccess) {
        return Deferred().resolve(json.data);
    });
};
var GetDearList = function(id, city) {
    return Store(config.serverIp + 'GetDearList', {
        id: id,
        city: city
    }).then(function(json, isSuccess) {
        return Deferred().resolve(json.data);
    });
};

var ProvinceList = [];

Utils.each(city.data.initial, function(v) {
    Utils.each(v[1], function(vv) {
        ProvinceList.push(vv.province);
    });
});

Page({
    data: {
        selectProvinceList: ProvinceList,
        selectCityList: city.getCityListByPro(ProvinceList[0].code),

        activeProvinceIndex: 0,
        activeCityIndex: 0,

        showPickCity: false,

        activeCity: city.getForCode('110000'),

        showSuccessToast: false,

        selectDealStatusList: [],
        iscomputer: true
    },

    onLoad: function(searchObj) {
        var that = this;
        var type = searchObj.action || 'enquiry';
        var img = searchObj.computerImg;
        var title = searchObj.computerName;
        var id = searchObj.computerId;

        var setData = {};

        var setCity = function(cityCode) {
            var currentProvince = city.getProByCityCode(cityCode);
            var selectCityList = city.getCityListByPro(currentProvince.code);

            var acitveProvinceIndex = 0;
            var activeCityIndex = 0;

            Utils.each(ProvinceList, function(pro, i) {
                if (currentProvince.code == pro.code) {
                    acitveProvinceIndex = i;
                    return false;
                }
            });

            Utils.each(selectCityList, function(city, i) {
                if (cityCode == city.code) {
                    activeCityIndex = i;
                    return false;
                }
            });

            return {
                selectCityList: selectCityList,
                activeProvinceIndex: acitveProvinceIndex,
                activeCityIndex: activeCityIndex,
                activeCity: city.getForCode(cityCode)
            };
        };

        setData.user = App.localUser || {};
        if (
            !setData.user.city ||
            setData.user.city != that.data.activeCity.code
        ) {
            Utils.extend(setData, setCity(setData.user.city || '110500'));
        }

        wx.setNavigationBarTitle({
            title: PageType[type].title
        });

        Deferred.when(GetData(id), GetDearList(id, setData.user.city)).then(
            function(data) {
                var summaryData = data[0][0];
                var dealList = data[1][0];

                setData.dealList = dealList.dealList;
                setData.pageData = PageType[type];
                setData.searchObj = searchObj;
                setData.selectDealStatusList = [];
                summaryData.serial.img = img;
                summaryData.serial.title = title;
                setData.serial = summaryData.serial;
                setData.computer = summaryData.computer;
                Utils.each(dealList.dealList, function(item, i) {
                    setData.selectDealStatusList.push(i > 2 ? 0 : 1);
                });
                wx.hideToast();
                that.setData(setData);
            }
        );
    },
    onTabCity: function() {
        this.setData({
            showPickCity: true
        });
    },
    onTapSelectCityMask: function(e) {
        if (e.target.id === 'select-city-mask') {
            this.setData({
                showPickCity: false
            });
        }
    },
    onSelectCityChange: function(e) {
        var selectValue = e.detail.value;
        var setData = {};

        if (selectValue[0] !== this.data.activeProvinceIndex) {
            setData.activeProvinceIndex = selectValue[0];
            setData.selectCityList = city.getCityListByPro(
                ProvinceList[selectValue[0]].code
            );
            setData.activeCityIndex = 0;
        } else if (selectValue[1] !== this.data.activeCityIndex) {
            setData.activeCityIndex = selectValue[1];
        }
        this.setData(setData);
    },
    onTabPickerCancel: function() {
        this.setData({
            showPickCity: false
        });
    },
    renderDearList: function(searchObj) {
        searchObj = searchObj || this.data.searchObj;

        var that = this;
        var id = searchObj.id;
        var setData = {};
        GetDearList(id, this.data.activeCity.code).then(function(data) {
            setData.dealList = data.dealList;
            setData.selectDealStatusList = [];

            Utils.each(data.dealList, function(item, i) {
                setData.selectDealStatusList.push(i > 2 ? 0 : 1);
            });

            that.setData(setData);
        });
    },
    onTabPickerOk: function() {
        var city = this.data.selectCityList[this.data.activeCityIndex];
        var cityHasChange = city.code !== this.data.activeCity.code;
        this.setData({
            showPickCity: false,
            activeCity: city
        });
        if (cityHasChange) {
            this.renderDearList();
        }
    },
    onInputConfirm: function(e) {
        var id = e.target.id;
        var value = e.detail.value;

        this.cheackInputValue(id, value);
    },
    cheackInputValue: function(name, value) {
        var errorTip = '';

        if (name === 'nickname') {
            if (!value) {
                errorTip = '请输入姓名';
            }
            var userPattern = /[\u4E00-\u9FA5\uF900-\uFA2D]{2,5}/;

            if (value && !userPattern.test(value)) {
                errorTip = '这不是真名';
            }
        } else if (name === 'phone') {
            if (!value) {
                errorTip = '请输入您的手机号';
            }
            var telPattern = (telPattern = /^[1][3,4,5,7,8][0-9]{9}$/);
            if (value && !telPattern.test(value)) {
                errorTip = '这不是手机号';
            }
        }

        if (errorTip) {
            wx.showToast({
                title: errorTip,
                icon: 'warning',
                duration: 2000
            });
            return false;
        }

        return true;
    },
    onFormSubmit: function(e) {
        var that = this;
        var formData = e.detail.value;
        var cityCode = this.data.activeCity.code;
        var serialId = this.data.serial.id;
        var computerId = (this.data.computer || {}).id;

        var dealerIdList = [];

        var postData;

        if (
            this.cheackInputValue('nickname', formData.nickname) === false ||
            this.cheackInputValue('phone', formData.phone) === false
        ) {
            return;
        }

        Utils.each(this.data.selectDealStatusList, function(item, i) {
            if (item) dealerIdList.push(that.data.dealList[i].id);
        });

        postData = {
            cityCode: cityCode,
            serialId: serialId,
            computerId: computerId,
            phone: formData.phone,
            name: formData.nickname,
            type: this.data.pageData.type,
            dealerIds: dealerIdList.join(',')
        };

        /*     Store('http://192.168.2.105/public/data/saveUserInfo', postData, 'post').then(function (storeData, isSuccess) { */
        that.setData({
            showSuccessToast: true
        });

        // 保存用户信息
        App.setLocalUser({
            name: formData.nickname,
            phone: formData.phone,
            city: cityCode
        });

        // 提交成返回上个页面
        setTimeout(function() {
            wx.navigateBack();
        }, 2000);
        /* }); */
    },
    onTapDealerItem: function(e) {
        var index = parseInt(e.currentTarget.dataset.i);
        var selectDealStatusList = this.data.selectDealStatusList.slice();

        selectDealStatusList[index] = selectDealStatusList[index] === 0 ? 1 : 0;

        this.setData({
            selectDealStatusList: selectDealStatusList
        });
    }
});
