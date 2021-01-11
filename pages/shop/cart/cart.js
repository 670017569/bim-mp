let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart:{},
    num:0,
    price:0,
    disabled:true,
    loading:false,
    checked:[false]
  },
  changeState(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var checked = this.data.checked;
    console.log(checked)
    if (index == "all") {
      checked[0] = (checked[0] == true ? false : true);
      for (var i = 0; i < checked.length; i++) {
        checked[i] = (checked[0] == true?true:false);
      }
      that.computePrice();
    }
    else {
      checked[index + 1] = (checked[index + 1] == true ? false : true);
      that.isAll(checked,function(data){
        if (data == true) checked[0] = (checked[0] == true ? false : true);
        else checked[0] = false;
      })
      that.computePrice();
    }
    this.setData({
      checked:checked
    })
  },
  isAll(checked,callback){
    var flag = true;
    for(var i=1;i<checked.length;i++){
      if (checked[i] == false) flag = false;
      if(i == checked.length-1){
        callback(flag);
      }
    }
  },
  deleteCart(e){
    var orderid = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '提示',
      content: '确认移除购物车吗',
      success: function (e) {
        if (e.confirm) {
          Request.deleteRequest("/cart/cancel?orderids=" + orderid,function () {
            wx.showToast({
              title: '移除成功',
            })
            app.globalData.cartNum -- ;
            that.onShow();
          })
        }
      }
    })
  },
  onSubmit(){
    that.hasChoose(function(flag){
      if(flag == false){
        wx.showToast({
          title: '请选择商品结算',
          icon:'none'
        })
      }
      else{
        var checked = that.data.checked;
        var cart = that.data.cart;
        var orderList = [];
        for (var i = 0; i < cart.list.length; i++) {
          if (checked[i+1] == true) orderList.push(cart.list[i]);
          if (i == (cart.list.length - 1)) {
            console.log(orderList);
            wx.navigateTo({
              url: '../buy/buy?data=' + encodeURIComponent(JSON.stringify(orderList)) + "&isCart=true",
            })
          }
        }
      }
    })
  },
  computePrice(){
    var checked = that.data.checked;
    console.log(checked);
    var cart = that.data.cart;
    var price = 0;
    for (var i = 0; i < cart.list.length; i++) {
      var prices = (cart.list[i].goods.price) * (cart.list[i].buyNum);
      if (checked[i+1] == true) price += prices;
      if (i == (cart.list.length - 1)) {
        console.log(price)
        that.setData({
          price:price
        })
      }
    }
  },
  hasChoose(callback){
    var flag = false;
    var checked = that.data.checked;
    for (var i = 0; i < checked.length; i++) {
      if (checked[i] == true) flag = true;
      if (i == (checked.length - 1)) callback(flag);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: 'Loading...',
    })
    //更新购物车数量
    Request.getRequest("/cart/num?userid=" + app.globalData.user.userid, function (res) {
      app.globalData.cartNum = res.data.num;
    })
    Request.getRequest("/cart?len=10&page=1&userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      console.log(res.data)
      var length = res.data.list.length;
      var checked = [false];
      for (var i = 0; i < length; i++) {
        checked.push(false);
      }
      var disabled = false;
      if (res.data.list.length == 0) {
        disabled = true;
      }
      that.setData({
        cart: res.data,
        num: res.data.list.length,
        disabled: disabled,
        checked: checked
      })
    })
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