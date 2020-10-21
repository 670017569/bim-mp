// pages/homePage/softwareDetail/softwareDetail.js
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
var WxParse = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic:{},
    nodes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    var tpid = options.tpid;
    wx.showLoading({
      title: 'Loading...',
    })
    Request.getRequest('/topic/' + tpid, function (res) {
      console.log(res.data)
      wx.hideLoading();
      WxParse.wxParse('article', 'html', res.data.topic.content,that,0);
      that.setData({
        topic: res.data.topic,
        nodes: res.data.topic.content
      })
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