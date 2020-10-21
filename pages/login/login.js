// pages/login/login.js
let app = getApp()
let Request = require('../../utils/request');
let that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    submitBtn:true
  },
  bindGetUserInfo: function (e) {
    var that = this;
    //判断是否勾选用户协议
    if(that.data.submitBtn == true){
      //此处授权得到userInfo 
      console.log("授权得到userInfo ：" + e.detail.userInfo)
      var authUser = e.detail.userInfo;
      if (authUser == undefined) {
        //判断 
        console.log("用户点击 拒绝 按钮")
        wx.showToast({
          title: '不登陆无法使用！',
          image: '/images/worning.png'
        })
        return;
      }
      app.userInit(function () { });
      //最后，返回返回刚才的界面 
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: '请勾选用户协议',
        icon: 'none'
      })
    }
  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      show:false
    })

  },
  showAgreement: function () {
    that.setData({
      show: true
    })
  },

  // 同意用户协议
  agreeMent: function (event) {
    if (event.detail.value == "true") {
      that.setData({
        submitBtn: true
      });
    } else {
      this.setData({
        submitBtn: false
      });
    }
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