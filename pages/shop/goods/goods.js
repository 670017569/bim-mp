// pages/shop/detail/detail.js

var WxParse = require("../../../wxParse/wxParse.js");
let Request = require('../../../utils/request');
let that;
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    show: false,
    goodsInfo: {
      commentNum: 0,
      credit: 0,
      description: '加载中',
      gid: 0,
      goodsName: '商品',
      params: [],
      picList: null
    },
    buyToCart:false,
    buyButtonText:"立即购买",
    picList:[],
    nodes:'',
    paramGroup:[],
    paramValue:[],
    paramStock:[],
    nowStock:0,
    amount:1,
    gindex:0,
    vindex:0,
    disable:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    Request.getRequest('/goods/'+params.gid, function (res) {
      wx.hideLoading();
      console.log(res.data);
      var picList = [
        res.data.pic1,
        res.data.pic2,
        res.data.pic3
      ];
      WxParse.wxParse('article', 'html', res.data.description, that, 0);
      that.setData({
        goodsInfo: res.data,
        picList:picList,
        nodes: res.data.description
      });
    })
    Request.getRequest('/goods/param/gid?gid=' + params.gid, function (res) {
      console.log(res.data);
      var list = res.data;
      var paramGroup = [];
      var paramValue = [];
      var paramStock = [];
      var nowStock = 0;
      // var emptys = [{
      //   "value":[],
      //   "state":[]
      // }];
      // console.log(emptys);
      for(var i = 0; i < list.length; i ++){
        var index = that.isInclude(paramGroup, list[i].paramGroup);
        // console.log("index" + index)
        if(index >= 0){
          paramValue[index].value = paramValue[index].value.concat(list[i].paramValue);
          paramValue[index].state = paramValue[index].state.concat('#969799');
          paramValue[index].gpid = paramValue[index].gpid.concat(list[i].gpid);
          paramStock.push(list[i].stock);
          // console.log("G" + index + " " + paramGroup);
          // console.log(paramValue);
        }
        else{
          paramGroup = paramGroup.concat([list[i].paramGroup]);
          // console.log(paramGroup)
          paramValue = paramValue.concat([{
            "value": [],
            "state": [],
            "gpid":[]
          }]);
          // console.log(paramValue);
          paramValue[paramValue.length - 1].value = (paramValue[paramValue.length - 1].value).concat(list[i].paramValue);
          paramValue[paramValue.length - 1].state = (paramValue[paramValue.length - 1].state).concat('#5495E6');
          nowStock = list[i].stock;
          if(nowStock == 0) {
            that.setData({
              disable:true
            })
          }
          paramValue[paramValue.length - 1].gpid = (paramValue[paramValue.length - 1].gpid).concat(list[i].gpid);
          paramStock.push(list[i].stock);
          // console.log("G" + index + " " + paramGroup);
          // console.log(paramValue);
        }
      }
      console.log("G" + paramGroup);
      console.log(paramValue);
      that.setData({
        paramGroup:paramGroup,
        paramValue:paramValue,
        paramStock:paramStock,
        nowStock: nowStock
      })
    })
  },
  isInclude(paramGroup,param){
    if(null == paramGroup) return -1;
    for(var i=0;i<paramGroup.length;i++){
      if(param == paramGroup[i]) return i;
    }
    return -1;
  },
  onSubmit(){
    if (that.data.nowStock == 0 || that.data.nowStock < this.data.amount){
      wx.showToast({
        title: '库存不足',
      })
      return;
    }
    var gpid = this.findGpid();
    var amount = this.data.amount;
    // var price = this.data.goodsInfo.price * amount;
    // var credit = this.data.goodsInfo.credit * amount;
    var gid = this.data.goodsInfo.gid;
    if(this.data.buyToCart == true){
      var data = {
        "userid":app.globalData.user.userid,
        "buyNum": amount,
        "gpid": gpid[0],
        "gid": gid,
        // "price": price,
        // "credit": credit
      }
      console.log(data)
      Request.postRequest("/cart",data,function(res){
        wx.showToast({
          title: '加入购物车成功!',
        })
        var num = that.data.num;
        num++;
        app.globalData.cartNum = num;
        that.setData({
          show:false,
          num:num
        })
      })
    }
    else{
      var param = that.getParam(gpid[0],function(param){
        var data = [{
          "buyNum": amount,
          "param": param,
          "goods": that.data.goodsInfo,
        }]
        console.log(data)
        
        wx.navigateTo({
          url: '../buy/buy?data=' + encodeURIComponent(JSON.stringify(data))+"&isCart=false",
        })
      })
    }
  },
  getParam(gpid,callback){
    Request.getRequest("/goods/param?gpid=" + gpid, function (res) {
      callback(res.data)
    })
  },
  findGpid(){
    var arr = this.data.paramValue;
    var gpid = [];
    for(var i = 0; i<arr.length; i++){
      for(var j = 0; j<arr[i].state.length; j++){
        if (arr[i].state[j] == '#5495E6') gpid.push(arr[i].gpid[j])
      }
    }
    return gpid;
  },
  showCartPopup() {
    this.setData({ show: true, buyToCart: true, buyButtonText: "加入购物车" });
  },
  showBuyPopup() {
    this.setData({ show: true, buyToCart:false, buyButtonText:"立即购买" });
  },

  onClose() {
    this.setData({ show: false });
  },
  paramValueClick:function(e){
    let gindex = e.currentTarget.dataset.gindex;
    let vindex = e.currentTarget.dataset.vindex;
    var paramValue = this.data.paramValue;
    var arr = paramValue[gindex].state;
    for(var i=0;i<arr.length;i++){
      arr[i] = i == vindex ? '#5495E6' :'#969799';
    }
    var disable = false;
    // console.log(that.data.paramStock[vindex] == 0)
    if (that.data.paramStock[vindex] == 0) {
      disable = true;
    }
    // console.log(that.data.paramStock[vindex]);
    this.setData({
      paramValue:paramValue,
      gindex:gindex,
      vindex:vindex,
      nowStock:that.data.paramStock[vindex],
      disable: disable
    })
  },
  onChange(e){
    this.setData({
      amount:e.detail
    })
  },

  onShow(){
    this.setData({
      num: app.globalData.cartNum
    })
  }
});
