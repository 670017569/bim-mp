// pages/myorder/myorder.js
const app = getApp()
let Request = require('../../../utils/request');
let that = this

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    order:{},
    currentPage:0
  },
  details:function(options){
    var index = options.currentTarget.dataset.index;
    console.log(index);
    var order = this.data.order;
    console.log(order);
    var orderid = this.data.order.list[index].orderid;
    var addrid = this.data.order.list[index].addrid;
    console.log(orderid)
    wx.navigateTo({
      url: 'details/details?orderid=' + orderid + '&addrid=' + addrid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      user: app.globalData.user
    })
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
    // Request.getRequest("/order/page?len=6&page=1&userid="+this.data.user.userid,function(res){
    //   console.log("获取订单信息成功！")
    //   console.log(res.data)
    //   that.setData({
    //     order:res.data
    //   })
    // })
    that.loadInitData();
  },
  loadInitData: function () {
    //目前为第一页
    var currentPage = 1;
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: "Loading...",
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/order/page?len=5&page=1&userid=" + this.data.user.userid, function (res) {
      if (res.data.list.length == 0) {
        wx.showToast({
          icon: 'none',
          title: '暂无数据',
        })
      }
      else {
        //隐藏加载提示框
        wx.hideLoading();
        that.setData({
          order: res.data,
          currentPage: currentPage
        })
      }
    })
  },
  //加载下一页数据
  loadMoreData: function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: "Loading...",
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/order/page?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        var originOrder = that.data.order;
        //加上新获取到的list
        originOrder.list = originOrder.list.concat(resData);
        that.setData({
          order: originOrder,
          currentPage: currentPage
        })
      }
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
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})