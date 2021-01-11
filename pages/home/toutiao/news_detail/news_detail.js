// pages/home/toutiao/news_detail/news_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = options.url;
    this.setData({
      url: url
    })
    let pages = getCurrentPages();
    console.log(pages);
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
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