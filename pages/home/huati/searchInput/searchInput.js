let Request = require("../../../../utils/request"); // 封装请求
const util = require('../../../../utils/util.js');
let that; // 指向本page
// pages/home/huati/searchInput/searchInput.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInfo: {},
    searchInputValue: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  //搜索关键词
  async SearchKey(e) {
    var content = e.detail.value.content;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return;
    }
    try {
      var msg = await Request.request({
        url: `/bbs/topic/keyword?key=${content}&len=15&page=1`
      });
      if (msg.data.list.length === 0) {
        wx.showToast({
          title: '抱歉，未查询到结果',
          icon: 'none'
        })
        that.setData({
          searchInputValue: '',
        })
      }
      that.setData({
        searchInfo: msg.data,
      })
    } catch (error) {
      console.log(error);
    }
  },
  //话题跳转详情页
  getTopic: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + tpid
    })
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