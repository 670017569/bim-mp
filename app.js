//app.js

let Request = require('/utils/request');
let that = this
App({

  // app全局变量
  globalData: {
    accesstoken:{},
    user:"",
    homeIndex:0,
    mycenterRefresh:false,
    isDynRefresh: true,
    isTopRefresh: true,
    checkLogin: false,
    isIphoneX:false,
    cartNum:0,
    goodsBack:false
  },

  // 登陆码
  loginCode: null,

  // 用户信息
  userInfo: null,
  /**
   * 小程序启动时调用
   * 调用userInit方法在有授权时自动登录
   */
  onLaunch: function () {
    that = this;
    // this.userInit(function(){
    //   console.log("aaa");
    // });
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        console.log(modelmes);
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },
  onShow:function(){
  },

  /**
   * 读取用户授权状态
   * 在拥有登陆授权时调取getLoginCode和getUserInfo获取登陆需要的信息
   */
  userInit: function (callback){
    wx.getSetting({
      success: settings => {
        console.log(settings);
        if (settings.authSetting['scope.userInfo']) {
          console.log("已经授权")
          this.getUserInfo(callback);
          this.getLoginCode(callback);
        }
        else{
          console.log("未授权")
          wx.navigateTo({
            url: '/pages/login/login',//授权页面
          })
        }
      },
    })
  },

  /**
   * 获取登陆码
   * 检查用户信息是否就绪
   * 异步调用login方法
   */
  getLoginCode: function (callback){
    wx.login({
      success: res => {
        console.log(res);
        this.loginCode = res;
        if (this.userInfo) {
          this.login(callback);
        }
      },
    })
  },

  /**
   * 获取用户信息
   * 检查登陆码是否就绪
   * 异步调用login方法
   */
  getUserInfo: function (callback){
    wx.getUserInfo({
      success: res => {
        console.log(res);
        this.userInfo = res;
        if(this.loginCode){
          this.login(callback)
        }
      },
    })
  },

  /**
   * 向开发者服务器发送登陆码和用户信息
   * 返回完整的用户资料
   * 将用户资料保存至app.global.userInfo
   */
  login: function (callback){
    Request.postRequest('/oauth/wx',{
      loginCode: this.loginCode.code,
      userInfo: this.userInfo.rawData,
      signature: this.userInfo.signature,
    },function (res) {
      that.globalData.accesstoken = res.data;
      console.log(res.data)
      if (res.data.access_token == null || res.data.access_token == undefined){
        that.userInit(function(){});
      }
      Request.getRequest("/user/me?access_token=" + res.data.access_token, function (res) {
        that.globalData.user = res.data;
        console.log(res.data);
        callback(res);
      })
    });
  },
  
  /**
   * 更新用户信息
   */
  updateUserInfo:function(){
    Request.getRequest("/user/me?access_token=" + that.globalData.accesstoken.access_token, function (res) {
      that.globalData.user = res.data;
      console.log("更新用户信息成功!")
    })
  }
});