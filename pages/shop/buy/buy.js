// pages/buy/buy.js
let Request = require('../../../utils/request');
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: app.globalData.user,
    address:null,
    orderInfo:[],
    price:0,
    credit:0,
    isCart:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var datas = decodeURIComponent(options.data)
    var data = JSON.parse(datas);
    console.log(data)
    // var isCart = options.isCart;
    // if(isCart == true) that.buyToCart(data)
    // else that.buy(data);
    Request.getRequest("/addr/default/" + app.globalData.user.userid, function (res) {
      that.setData({
        address: res.data,
        user: app.globalData.user,
        orderInfo:data,
        isCart:options.isCart
      })
    })
    that.getPriceAndCredit(data);
    // this.getData(data);
    this.setData({
      user: app.globalData.user
    })
  },
  getPriceAndCredit(data){
    var price = 0;
    var credit = 0;
    for (var i = 0; i < data.length; i++) {
      price += data[i].buyNum * data[i].goods.price;
      credit += data[i].buyNum * data[i].goods.credit;
      if(i == (data.length-1)){
        that.setData({
          price:price,
          credit:credit
        })
      }
    }
  },
  pay:function(){
    console.log("支付:" + this.data.isCart);
    if (this.data.user.credit <= this.data.credit){
      wx.showToast({
        title: '积分不足',
        icon:'none'
      })
    }
    else if (this.data.address == null || this.data.address == ''){
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
    }
    else{
      //购物车批量下单
      if (this.data.isCart == true) {
        console.log("批量下单")
        that.getOrderid(function(orderids){
          console.log(orderids)
          Request.postRequest("/order/batch?addrid=" + that.data.address.addrid+"&userid="+app.globalData.user.userid,orderids,function(res){
            console.log(res)
            app.globalData.goodsBack = true;
            wx.navigateTo({
              url: '/pages/mycenter/myorder/myorder',
            })
          })
        })
      }
      //单个商品结算
      else {
        console.log("单个商品结算")
        var orderInfo = this.data.orderInfo[0];
        console.log(orderInfo);
        var data = {
          "buyNum":orderInfo.buyNum,
          "gid":orderInfo.goods.gid,
          "gpid":orderInfo.param.gpid,
        }
        Request.postRequest("/order?userid="+app.globalData.user.userid+"&addrid="+this.data.address.addrid,data,function(res){
          console.log(res.data.message)
          app.globalData.goodsBack = true;
          wx.navigateTo({
            url: '/pages/mycenter/myorder/myorder',
          })
        })
      }
    }
  },
  getOrderid(callback){
    var orderInfo = this.data.orderInfo;
    var orderids = {
      "orderids":[]
    };
    for(var i=0;i<orderInfo.length;i++){
      orderids.orderids.push(orderInfo[i].orderid)
    }
    callback(orderids)
  },
  // getData(data){
  //   var good = {
  //     "goodInfo": {},
  //     "goodParams": '',
  //     "amount": 0,
  //     "credit": 0,
  //     "price": 0
  //   };
  //   wx.showLoading({
  //     title: 'Loading...',
  //   });
  //   //获取地址
  //   var path = "/addr/default/" + app.globalData.user.userid;
  //   Request.getRequest(path, function (res) {
  //     that.setData({
  //       address: res.data
  //     })
  //   })
  //   /*
  //   * 获取下单的商品信息列表（下单的可能不止一件商品）
  //   * data数组遍历
  //   * 先为buyGoodsInfo扩展size
  //   * 然后分别拿到amount、goodInfo、以及gpid
  //   * 由于gpid是数组形式，利用递归拿到参数字符串存入buyGoodsInfo
  //   */
  //   for(var i=0;i<data.length;i++){
  //     var j = i;
  //     var buyGoodsInfo = that.data.buyGoodsInfo;
  //     buyGoodsInfo.push(good);
  //     that.setData({
  //       buyGoodsInfo: buyGoodsInfo
  //     },function(){
  //       console.log(j)
  //       Request.getRequest('/goods/' + data[j].gid, function (res) {
  //         var buyGoodsInfo = that.data.buyGoodsInfo;
  //         buyGoodsInfo[j].goodInfo = res.data;
  //         console.log(buyGoodsInfo);
  //         that.setData({
  //           buyGoodsInfo: buyGoodsInfo
  //         })
  //       })
  //       var gpidLen = data[j].gpid.length;
  //       console.log(data[j].gpid)
  //       that.getGoodParams(0, gpidLen, data[j].gpid, '', j);

  //       var buyGoodsInfo = that.data.buyGoodsInfo;
  //       buyGoodsInfo[j].amount=data[j].amount;
  //       buyGoodsInfo[j].credit=data[j].credit;
  //       buyGoodsInfo[j].price=data[j].price;
  //       var price = that.data.price + data[j].price;
  //       var credit = that.data.credit + data[j].credit;
  //       that.setData({
  //         buyGoodsInfo: buyGoodsInfo,
  //         price:price,
  //         credit:credit
  //       })
  //     })
  //   }
  // },
  // getGoodParams(index,gpidLen,gpid,goodParam,i){
  //   if(index != gpidLen){
  //     Request.getRequest('/goods/param/?gpid=' + gpid[index], function (res) {
  //       goodParam += res.data.paramGroup + ":" + res.data.paramValue + ";";
  //       console.log(goodParam);
  //       index ++ ;
  //       that.getGoodParams(index, gpidLen, gpid, goodParam,i)
  //     })
  //   } 
  //   else {
  //     wx.hideLoading();
  //     var buyGoodsInfo = that.data.buyGoodsInfo;
  //     buyGoodsInfo[i].goodParams=goodParam;
  //     that.setData({
  //       buyGoodsInfo: buyGoodsInfo
  //     })
  //   };
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.address);
    if (app.globalData.goodsBack == true){
      wx.navigateBack({
        delta: 1,
      })
    }
    app.globalData.goodsBack = false;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})