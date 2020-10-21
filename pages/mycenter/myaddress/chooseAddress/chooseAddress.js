// pages/myaddress/myaddress.js
let app = getApp();
let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    address: {},
    defaultAddress: {},
    isIphoneX: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //iphoneX判断
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      user: app.globalData.user,
      isIphoneX: isIphoneX
    })
  },
  chooseAddress:function(e){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    let index = e.currentTarget.dataset.index;
    if (index == 'default'){
      prevPage.setData({
        address: that.data.defaultAddress
      },function(){
        wx.navigateBack({//返回
          delta: 1
        })
      })
    }
    else{
      prevPage.setData({
        address: that.data.address.list[index]
      },function(){
        wx.navigateBack({//返回
          delta: 1
        })
      })
    }
  },
  addAddress() {
    wx.navigateTo({
      url: '../addAddress/addAddress'
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
    wx.showLoading({
      title: 'Loading...',
    })
    Request.getRequest("/addr/page?len=20&page=1&userid=" + this.data.user.userid, function (res) {
      wx.hideLoading();
      that.setData({
        address: res.data
      })
    })

    var path = "/addr/default/" + this.data.user.userid;
    Request.getRequest(path, function (res) {
      console.log(res.data)
      that.setData({
        defaultAddress: res.data
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