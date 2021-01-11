//app.js

let Request = require('/utils/request');
let that = this;
App({

  // app全局变量
  globalData: {
    accesstoken: {},
    user: "",
    homeIndex: 0,
    mycenterRefresh: false,
    isDynRefresh: true,
    isTopRefresh: true,
    checkLogin: false,
    isIphoneX: false,
    cartNum: 0,
    goodsBack: false
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
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        //console.log(modelmes);
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone 11') != -1) {
          that.globalData.isIphoneX = true
        }
      }
    })
  },

  /**
   * 读取用户授权状态
   * 在拥有登陆授权时调取getLoginCode和getUserInfo获取登陆需要的信息
   */
  userInit: function () {
    return new Promise((resole, reject) => {
      wx.getSetting({
        success: async (settings) => {
          //判断是否授权
          if (settings.authSetting['scope.userInfo']) {
            try {
              //得到userInfo
              this.userInfo = await this.getUserInfo();
              //得到loginCode
              this.loginCode = await this.getLoginCode();
              console.log(this.loginCode)
              //登录
              this.login();
            } catch (error) {
              console.log(error);
              wx.showToast({
                title: '小程序出错',
                icon: 'none'
              })
            }
          } else {
            wx.navigateTo({
              url: '/pages/login/login', //授权页面
            })
          }
        },
      })
    })
  },

  /**
   * 获取登陆码
   */
  getLoginCode: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res);
        },
        fail(error) {
          reject(error);
        }
      })
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function () {
    return new Promise((resole, reject) => {
      wx.getUserInfo({
        success: res => {
          resole(res);
        },
        fail(error) {
          reject(error);
        }
      })
    })
  },

  /**
   * 向开发者服务器发送登陆码和用户信息
   * 返回完整的用户资料
   * 将用户资料保存至app.global.userInfo
   */
  login: async function () {
    try {
      let token = await wx.getStorageSync('token');
      token = await that.getToken();
      if (!token) {
        token = await that.getToken();
      }
      let msg = await Request.request({
        url: `/user/me`
      });
      console.log(msg);
      // 判断token是否有效，无效重新获取token
      // if (msg) {
      //   token = await this.getToken();
      //   msg = await Request.BBSRequest({
      //     url: `/user/me?access_token=${token.access_token}`
      //   });
      // }
      that.globalData.user = msg.data;
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  /*
   * 请求 access_token
   */
  getToken() {
    return new Promise(async (resolve, reject) => {
      try {
        let msg = await Request.request({
          url: '/auth/oauth/token',
          method: 'post',
          data: {
            loginCode: this.loginCode.code,
            userInfo: this.userInfo.rawData,
            signature: this.userInfo.signature
          }
        }, true);
        that.globalData.accesstoken = msg.data;
        console.log(msg.data)
        await wx.setStorage({
          data: msg.data.data.access_token,
          key: 'access_token',
        });
        resolve(msg.data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: async function () {
    try {
      let msg = await Request.request({
        url: `/user/me`
      });
      that.globalData.user = msg.data;
      console.log("更新用户信息成功!");
    } catch (error) {
      console.log(error);
      console.log("更新用户信息失败!");
    }
  }
});


// {
//   "pagePath": "pages/shop/shop",
//   "iconPath": "images/tabBar/goods.png",
//   "selectedIconPath": "images/tabBar/goods_click.png",
//   "text": "精品"
// },