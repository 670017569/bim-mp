// pages/details/details.js
let Request = require('../../../../utils/request');
let that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: [
      "已完成",
      "未付款",
      "已取消"
    ],
    order:{},
    addr:{},
    // //评价
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    current: 0,
    attitude: true,
    time: true,
    efficiency: true,
    environment: true,
    professional: true,
    code: 1,
    code1: 2,
    wjxScore: 5,
    pics:[],
    // textarea
    min: 5,//最少字数
    max: 300 //最多字数 (根据自己需求改变) 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var orderid = options.orderid;
    var addrid = options.addrid;

    var path1 = "/item?orderid=" + orderid
    var path2 = "/addr/addrid/" + addrid
    Request.getRequest(path1,function(res){
      that.setData({
        order:res.data
      })
    })
    Request.getRequest(path2, function (res) {
      that.setData({
        addr: res.data
      })
    })
  },
  goodsComment:function(){
    this.showModal();
  },
  //评价
  // 显示遮罩层 
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画 
    }, 200)
  },

  // 隐藏遮罩层 
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
      timingFunction: 'ease', //动画的效果 默认值是linear 
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画 
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块 
  },

  //动画集 
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性 
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max)
      return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        console.log(pics);
        // console.log(imgsrc);
        that.setData({
          pics: pics,
          // console.log(pics),
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  handleBtn() {
    wx: if (this.data.code == 1) {
      wx.showToast({
        title: '评价成功',
        icon: 'succes',
        duration: 1500,
        mask: true,
        success: function () {
          that.onShow()
        }
      });
    } else if (this.data.code1 == 2) {
      console.log("111")
      wx.showToast({
        title: '评价失败',
        image: '../img/fail.png',
        duration: 1500,
        mask: true
      })
    }
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
    this.setData({
      hideModal:true
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