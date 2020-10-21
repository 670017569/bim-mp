// pages/index/allComments/allComments.js
let Request = require("../../../utils/request"); // 封装请求
const util = require('../../../utils/util.js');
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentCurrentPage: 1,
    comment: [],
    user: app.globalData.user,
  },


  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var commentCurrentPage = that.data.commentCurrentPage;
    that.getInfo(commentCurrentPage);
  },
  getInfo(commentCurrentPage) {
    wx.showLoading({
      title: 'Loading...',
    })
    Request.getRequest("/comment/page/me?len=10&page=" + commentCurrentPage + "&userid=" + app.globalData.user.userid, function (res) {
      console.log(res.data);
      wx.hideLoading();
      var resData = res.data;
      console.log(resData.list.length);
      if (resData.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
        })
      }
      else {
        var nowComments = that.data.comment;
        if (commentCurrentPage == 1) {
          nowComments = resData
        }
        else {
          nowComments.list = nowComments.list.concat(resData.list);
        }
        that.setData({
          comment: nowComments,
          user: app.globalData.user,
        })
      }

    })

  },


  getDynamic: function (e) {
    let toid = e.currentTarget.dataset.toid;
    let type = e.currentTarget.dataset.type;
    console.log(toid);
    console.log(type);
    if(type=="dynamic")
    {
      wx.navigateTo({
        url: '/pages/homePage/dynamicDetail/dynamicDetail?dyid=' + toid
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + toid
      })
    }
   
    
  },

  onReachBottom: function () {
    var that = this;
    console.log("下拉刷新");

    var nowCurrentPage = that.data.commentCurrentPage + 1;
    that.getInfo(nowCurrentPage);
    that.setData({
      commentCurrentPage: nowCurrentPage,
    })
    console.log(nowCurrentPage);
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

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})