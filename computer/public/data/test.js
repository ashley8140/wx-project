/* {
    "id": 2,
    "title": "戴尔",
    "logo": "http://192.168.2.100/public/images/logo/de.jpg",
    "brand": [{
        "id": 21,
        "title": "戴尔 XX系列",
        "lists": [{
            "level": "xx寸",
            "price": "XXX",
            "img": "http://192.168.2.100/public/images/computer/apple.jpg"
        }, {
            "level": "xx寸",
            "price": "XXX",
            "img": "http://192.168.2.100/public/images/computer/apple.jpg"
        }]
    }, {
        "id": 22,
        "title": "戴尔 XX系列",
        "lists": [{
            "level": "xx寸",
            "price": "XXX",
            "img": "http://192.168.2.100/public/images/computer/apple.jpg"
        }, {
            "level": "xx寸",
            "price": "XXX",
            "img": "http://192.168.2.100/public/images/computer/apple.jpg"
        }]

    }]
} */

var re = '';
var ch = ["Apple", "戴尔", "惠普", "华硕", "联想", "三星", "thinkpad", "微软", "小米", "神舟", "炫龙", "麦本本", "雷神", "机械师", "微星", "外星人", "火影", "宏基", "机械革命", "aierxuan", "未来人类", "摩天酷", "技嘉", "中柏", "戴睿", "雷蛇", "清华同方", "海尔", "台电", "华为"]
var en = ["apple", "daier", "huipu", "huashuo", "lianxiang", "sanxing", "thinkpad", "weiruan", "xiaomi", "shenzhou", "xuanlong", "maibenben", "leishen", "jixieshi", "weixing", "waixingren", "huoying", "hongji", "jixiegeming", "aierxuan", "weilairenlei", "motianku", "jijia", "zhongbai", "dairui", "leishe", "qinghuatongfang", "haier", "taidian", "huawei"]
var logo = ['apple', 'de', 'hp', 'hs', 'lx', 'sx', 'thinkpad', 'wr', 'xm', 'sz', 'xl', 'mbb', 'ls', 'jxs', 'wx', 'wxr', 'hy', 'hj', 'jxgm', 'aierxuan', 'wlrl', 'mtk', 'jj', 'zb', 'dr', 'leishe', 'qhtf', 'haier', 'td', 'hw']
var tpl = '';
for (var i = 0; i < 30; i++) {
    var n = parseInt(2 + 5 * Math.random());
    var arr = '';
    for (var j = 0; j < n; j++) {
        var n1 = parseInt(2 + 4 * Math.random());
        var arr1 = '';
        for (var k = 0; k < n1; k++) {
            if (k == n1 - 1) {
                arr1 += '{"id":'+`${i+1}`+(j+1)+(k+1)+',"title":"'+ch[i] + ' XX-XXX-XXX"'+',"level":"xx寸","price":"XXX","img":"http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/computer/' + en[i] + '.jpg"}';

            } else {
                arr1 += '{"id":'+`${i+1}`+(j+1)+(k+1)+',"title":"'+ch[i] + ' XX-XXX-XXX"'+',"level":"xx寸","price":"XXX","img":"http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/computer/' + en[i] + '.jpg"},';

            }

        }
        if (j == n - 1) {
            arr += '{"id":' + `${i+1}` + (j + 1) + ',"title":"' + ch[i] + ' XX系列",' + '"lists":[' + arr1 + ']}';

        } else {
            arr += '{"id":' + `${i+1}` + (j + 1) + ',"title":"' + ch[i] + ' XX系列",' + '"lists":[' + arr1 + ']},';

        }
    }
    if (i == 29) {
        tpl += '{"id":' + (i + 1) + ',"title":"' + ch[i] + '","logo":"http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/' + logo[i] + '.jpg",' + '"brand":[' + arr + ']' + '}';

    } else {
        tpl += '{"id":' + (i + 1) + ',"title":"' + ch[i] + '","logo":"http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/images/logo/' + logo[i] + '.jpg",' + '"brand":[' + arr + ']' + '},';

    }
}
console.log(tpl)