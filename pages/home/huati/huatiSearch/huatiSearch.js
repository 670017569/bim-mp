// pages/home/huati/huatiSearch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huati_key:null,
    history:[],
    bqlist:[
      { key: 0, value: "标签1" }, { key: 1, value: "标签2" }, { key: 2, value: "标签3" }, { key: 3, value: "标签4" }, { key: 4, value: "标签5" }, { key: 5, value: "标签6" }, { key: 6, value: "标签7" }, { key: 7, value: "标签8" }, { key: 8, value: "标签9" }, { key: 9, value: "标签10" }, { key: 10, value: "标签11" }, { key: 11, value: "标签12" }, { key: 12, value: "标签13" }, { key: 13, value: "标签14" }, { key: 14, value: "标签15" }, { key: 15, value: "标签16" }, { key: 16, value: "标签17" }, { key: 17, value: "标签18" }, { key: 18, value: "标签19" }, { key: 19, value: "标签20" },
    ],
    biaoqian:[]
  },
  //获取话题输入框内容
  getHuati: function (e) {
    var huati_key = e.detail.value.replace(/\s+/g, '');
    this.setData({
      huati_key: huati_key
    })
  },
  //话题搜索事件绑定
  huatiClick: function (e) {
    var key=this.data.huati_key;
    var history=this.data.history
    var stats=1;
    if(key===null||key===undefined||key===""){
      wx.showToast({
        title: '未输入关键字！',
        icon: 'loading',
        duration: 2000
      })
    }else{
      for(var i=0;i<history.length;i++){
        if(key===history[i]){
          console.log(i);
          stats--;
          break;
        }
      }
      if(stats===1&&history.length < 5){
        history.unshift({
          value:key,
          id:history.length
        })
      }else if(stats===1&&history.length >= 5){
        history.pop()
        history.unshift({
          value:key,
          id:history.length
        })
      }
      wx.setStorageSync('history', history);
      console.log(this.data.huati_key);
      wx.navigateTo({
        url: '../huatiList/huatiList?huati_key='+key,
      })
    }
  },
  getHistory:function(){
    var that=this;
    that.setData({
      history: wx.getStorageSync('history') || [],
    })
    console.log(this.data.history);
  },
  getBQList:function(){
    var that=this;
    that.setData({
      biaoqian:this.data.bqlist,
    })
  },
  keyClick:function(e){
    console.log(e.currentTarget.dataset.item);
    var key = e.currentTarget.dataset.item;
    var that=this;
    wx.navigateTo({
      url: '../huatiList/huatiList?huati_key=' + key,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistory();
    this.getBQList();
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