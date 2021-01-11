// pages/release/release.js
const util = require('../../utils/util.js');
let app = getApp();
let Request = require("../../utils/request"); // 封装请求
let that; // 指向本page
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    code: null,
    navbar: ['动态', '话题'],
    currentTab: 0,
    inputValue: null,
    topInputValue: null,
    topInputTitle: null,

    //富文本编辑器

    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  navbarTap: function (e) {
    console.log("1")
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 删除已添加的图片
  close(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          this.setData({
            pics: this.data.pics.filter(v => {
              return v.path != e.currentTarget.dataset.src
            })
          })
        }
      }
    })
  },

  // 添加图片
  choose(res) {
    wx.chooseImage({
      count: 9 - this.data.pics.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          pics: this.data.pics.concat(res.tempFilePaths)
        })
      },
    })
  },
  // 发布事件
  publishDyn(e) {
    var content = e.detail.value.content;
    var pics = this.data.pics;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    var path = '/dynamic';
    for (var i = 0; i < pics.length; i++) {
      //压缩
      wx.compressImage({
        src: pics[i],
        quality: 0,
        success: function (res) {
          pics[i] = res.tempFilePath
        }
      })
      //转换base64
      pics[i] = "data:image/png;base64," + wx.getFileSystemManager().readFileSync(pics[i], "base64");
    }
    var userid = app.globalData.user.userid
    var data = {
      "city": "长沙",
      "content": content,
      "pic1": pics[0],
      "pic2": pics[1],
      "pic3": pics[2],
      "pic4": pics[3],
      "pic5": pics[4],
      "pic6": pics[5],
      "pic7": pics[6],
      "pic8": pics[7],
      "pic9": pics[8],
      "publishTime": util.formatTime,
      "userid": userid
    };
    Request.postRequest(path, data, function () {
      console.log(data)
      app.globalData.homeIndex = 1;
      wx.switchTab({
          url: '/pages/home/home'
        }),
        getApp().updateUserInfo();
      wx.showToast({
        title: '发布成功',
        duration: 3000,
        success: res => {
          app.globalData.mycenterRefresh = true;
          app.globalData.isDynRefresh = true;
          that.setData({
            dynInputValue: '',
            pics: []
          })
        }
      })
    })
  },
  publishTop(e) {
    var title = e.detail.value.title;
    if (!title) {
      console.log(title)
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    } else {
      var path = '/topic';
      this.editorCtx.getContents({
        success: (res) => {
          var content = res.html;
          // console.log(content);
          var data = {
            "city": "长沙",
            "content": content,
            "publishTime": util.formatTime,
            "userid": app.globalData.user.userid,
            "title": title
          };
          Request.postRequest(path, data, function () {
            app.globalData.homeIndex = 2;
            wx.switchTab({
                url: '/pages/home/home'
              }),
              getApp().updateUserInfo();
            wx.showToast({
              title: '发布成功',
              success: res => {
                app.globalData.mycenterRefresh = true;
                app.globalData.isTopRefresh = true;
                that.editorCtx.clear({})
                that.setData({
                  topInputTitle: '',
                  pics: []
                })
              }
            })
          })
        },
        fail: (res) => {
          console.log("fail：" + res.html);
        }
      });
    }
  },
  //富文本编辑器

  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var imgPath = res.tempFilePaths[0];
        //压缩
        wx.compressImage({
          src: imgPath,
          quality: 0,
          success: function (res) {
            imgPath = res.tempFilePath
          }
        })
        that.editorCtx.insertImage({
          src: "data:image/png;base64," + wx.getFileSystemManager().readFileSync(imgPath, "base64"),
          src: imgPath,
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.setData({
      dynInputValue: '',
      topInputValue: '',
      topInputTitle: '',
      pics: []
    })
  },

  bindinput(e) {
    console.log(e.detail.html);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})