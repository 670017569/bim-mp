let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    software: {},
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
    that.loadInitData();
  },
  //加载初始数据
  loadInitData: async function () {
    //目前为第一页
    var currentPage = 1;
    console.log("load page " + (currentPage));
    try {
      // 请求软件数据
      let msg = await Request.request({
        url: `/bbs/topic/page/software?len=20&page=1&userid=${app.globalData.user.userid}`
      });
      if (msg.data.list.length == 0) {
        wx.showToast({
          title: '暂无软件',
          icon: 'none'
        })
      } else {
        //隐藏加载提示框
        console.log(msg.data)
        that.setData({
          software: msg.data.list,
          currentPage: currentPage
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
  //加载下一页数据
  loadMoreData: async function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page " + (currentPage));
    try {
      // 请求下一页软件数据
      let msg = await Request.request({
        url: `/bbs/topic/page/software?len=5&page=${currentPage}&userid=${app.globalData.user.userid}`
      })
      //拿到新获取到的list
      var resData = msg.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
          icon: 'none'
        })
      } else {
        that.setData({
          //拼接数据
          software: [...that.data.software, ...resData],
          currentPage: currentPage
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
  softwareDetail: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/softwareDetail/softwareDetail?tpid=' + tpid
    })
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