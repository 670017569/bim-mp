const app = getApp()
let Request = require('../../../utils/request');
let that = this
Page({
  data: {
    acList:{},
    user:{},
    currentPage:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this;
    that.setData({
      user:app.globalData.user
    })
  },
  onShow:function(){
    this.loadInitData();
  },
  activityDetail: function (e) {
    var acid = e.currentTarget.dataset.acid;
    wx.navigateTo({
      url: '/pages/homePage/activityDetail/activityDetail?acid=' + acid
    })
  },
  loadInitData: function () {
    //目前为第一页
    var currentPage = 1;
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: "Loading...",
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/activity/user?len=5&page=1&userid=" + app.globalData.user.userid, function (res) {
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
          acList: res.data.list,
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
    Request.getRequest("/activity/user?len=5&page=" + currentPage + "&acid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        var originActivity = that.data.acList;
        //加上新获取到的list
        originActivity = originActivity.concat(resData);
        that.setData({
          acList: originActivity,
          currentPage: currentPage
        })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //上拉触底 加载下一页数据
    this.loadMoreData();
  },
})