// pages/home/toutiao/more_activity/more_activity.js
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.loadInitData();
  },
  //加载初始数据
  loadInitData: function () {
    //目前为第一页
    var currentPage = 1;
    var tips = "Loading";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/activity/page?len=5&page=1", function (res) {
      if (res.data.list.length == 0) {
        wx.showToast({
          title: '暂无活动',
        })
      }
      else {
        //隐藏加载提示框
        wx.hideLoading();
        that.setData({
          activityList: res.data.list,
          currentPage: currentPage
        })
      }
    })
  },
  //加载下一页数据
  loadMoreData: function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "Loading";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/activity/page?len=5&page=" + currentPage, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        //拿到当前的activityList
        var activityList = that.data.activityList;
        //加上新获取到的list
        activityList = activityList.concat(resData);
        that.setData({
          activityList: activityList,
          currentPage: currentPage
        })
      }
    })
  },
  activityDetail(e){
    let acid = e.currentTarget.dataset.acid;
    wx.navigateTo({
      url: '/pages/homePage/activityDetail/activityDetail?back=true&acid=' + acid,
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
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})