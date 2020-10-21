// pages/shop/shop.js

let Request = require("../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    thumb:[],
    imgUrls: [
      
    ],
    num:0,
    goodsList: [],
    currentPage:0
  },

  /**
   * 页面启动时调用
   */
  onLoad: function () {

    that = this; // 让that变量指向当前page, 方便再离开页面对象时的操作
    //获取购物车数量
    Request.getRequest("/cart/num?userid=" + app.globalData.user.userid,function(res){
      app.globalData.cartNum = res.data.num;
      that.setData({
        num: res.data.num
      })
    })
    //获取轮播图
    Request.getRequest("/goods/brief?len=3&page=1", function (res) {
      var list = res.data.list;
      var thumb = [];
      for(var i=0;i<list.length;i++){
        thumb.push(
          {
            "img": list[i].thumb,
            "gid":list[i].gid
          }
        )
      }
      that.setData({
        thumb:thumb
      })
    })
    //加载初始数据
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
    // 请封装自己的网络请求接口
    Request.getRequest("/goods/brief?len=8&page=1", function (res) {
      if (res.data.list.length == 0) {
        wx.showToast({
          title: '暂无商品',
        })
      }
      else {
        //隐藏加载提示框
        wx.hideLoading();
        wx.stopPullDownRefresh() //停止下拉刷新
        console.log(res.data);
        that.setData({
          goodsList: res.data,
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
  /*
  * 页面下拉刷新事件
  */
  onPullDownRefresh: function () {
      that.loadInitData();

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
    Request.getRequest("/goods/brief?len=8&page=" + currentPage, function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        //拿到当前的goodsList
        var originGoodList = that.data.goodsList;
        //加上新获取到的list
        originGoodList.list = originGoodList.list.concat(resData);
        that.setData({
          goodsList: originGoodList,
          currentPage: currentPage
        })
      }
    })
  },
  onShow() {
    this.setData({
      num: app.globalData.cartNum
    })
  }
});