// pages/myfans/myfans.js
let app = getApp()
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: 0,
    touserid:0,
    currentPage: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var touserid = options.touserid;
    this.setData({
      userid: app.globalData.user.userid,
      touserid: touserid
    })
  },
  attentionClick: function (e) {
    let index = e.currentTarget.dataset.index;
    var path = "";
    var thisAttention = this.data.attention.list[index];
    if (thisAttention.userInfo.isFollow == false) {
      path = "/follow/";
      var data = {
        "touserid": thisAttention.userid,
        "userid": thisAttention.touserid
      }
      Request.postRequest(path, data, function () {
        console.log("关注成功！");
        wx.showToast({
          title: '关注成功',
        })
        that.onShow();
      });
    }
    else {
      wx.showModal({
        title: '提示',
        content: '确认取消关注吗',
        success: function (e) {
          if (e.confirm) {
            path = "/follow/cancel?touserid=" + thisAttention.userid + "&userid=" + thisAttention.touserid;
            Request.deleteRequest(path, function () {
              console.log(thisAttention.touserid + "取关" + thisAttention.userid);
              that.onShow();
            })
          }
        }
      })
    }
  },
  person_index: function (options) {
    var userid = options.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../person_index/person_index?userid=' + userid
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
    Request.getRequest("/follow/fans?len=20&page=1&userid=" + this.data.touserid, function (res) {
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
          attention: res.data,
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
    Request.getRequest("/follow/fans?len=10&page=" + currentPage + "&userid=" + this.data.touserid, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        var originAttention = that.data.attention;
        //加上新获取到的list
        originAttention.list = originAttention.list.concat(resData);
        that.setData({
          attention: originAttention,
          currentPage: currentPage
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //离开页面 更新用户信息
    getApp().updateUserInfo();
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
    //上拉触底 加载下一页数据
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})