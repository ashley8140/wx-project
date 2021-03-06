var Utils = require('./utils.js');

var GetStorage = function(key) {
    var result;
    try {
        result = wx.getStorageSync(key);
    } catch (e) {}

    return result;
};

var SetStorage = function(key, data) {
    try {
        wx.setStorage({ key: key, data: data });
    } catch (e) {}
};

var RemoveStorage = function(key) {
    try {
        wx.removeStorage({ key: key });
    } catch (e) {}
};

var Stack = function(size, initQueue) {
    this.queue = [].concat(initQueue || []);
    this.maxSize = size || 100;
    this.size = this.queue.length;
};

Stack.prototype.push = function(item) {
    this.queue.push(item);

    if (this.size >= this.maxSize) {
        return this.queue.shift();
    } else {
        this.size += 1;
    }
    return true;
};

Stack.prototype.update = function(item) {
    var li = this.check(item, true);

    if (li === this.maxSize - 1) return false;

    if (li > -1) {
        this.queue.splice(li, 1);
    }
    return this.push(item);
};

Stack.prototype.check = function(item, _needIndex) {
    var li = this.queue.indexOf(item);
    return _needIndex ? li : li > -1;
};

Stack.prototype.clear = function() {
    this.size = 0;
    this.queue = [];
};

var Cache = function(group, maxSize, expired) {
    this.key = group;
    this.maxSize = Math.min(100, parseInt(maxSize) || 20);
    this.expired = expired || 0;
};

Cache.prototype.formatKey = function(key) {
    if (Utils.type(key) !== 'string') {
        key = JSON.stringify(key);
    }

    return this.key + '_' + key;
};

Cache.prototype.init = function() {
    var keyStack;

    if (this.isReady) return this;

    keyStack = GetStorage(this.key);

    if (!keyStack || Utils.type(keyStack) !== 'array') {
        keyStack = [];
    }
    this.keyStack = new Stack(this.maxSize, keyStack);

    this.isReady = true;

    return this;
};

Cache.prototype.get = function(key) {
    var realKey = this.formatKey(key);
    var result = GetStorage(realKey);

    if (!result) {
        return null;
    }

    //过期

    if (result.e && result.c + result.e * 1000 < +new Date()) {
        this.del(key);

        return null;
    }

    if (this.init().keyStack.update(realKey)) {
        SetStorage(this.key, this.keyStack.queue);
    }
};
Cache.prototype.set = function(key, value, expired) {
    var realKey = this.formatKey(key);
    var delKey = this.init().keyStack.update(realKey);

    if (delKey) {
        SetStorage(this.key, this.keyStack.queue);

        if (Utils.type(delKey) === 'string') {
            this.del(delKey);
        }
    }

    if (expired === undefined) expired = this.expired;

    SetStorage(realKey, { v: value, e: expired, c: +new Date() });
};

Cache.prototype.del = function(key) {
    var realKey = this.formatKey(key);

    RemoveStorage(realKey);
};

Cache.prototype.clear = function() {
    Utils.each(this.init().keyStack.queue, function(realKey) {
        RemoveStorage(realKey);
    });

    this.init().keyStack.clear();

    SetStorage(this.key, this.keyStack.queue);
};
module.exports = Cache;
