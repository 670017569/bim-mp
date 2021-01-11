// pages/myaddress/myaddress.js
let app = getApp();
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    address: {},
    isIphoneX: false,
    width: {}, //删除按钮的宽度
  },
  changeAddress: function (e) {
    let index = e.currentTarget.dataset.index;
    var address;
    if (index == 'default') address = this.data.defaultAddress;
    else address = this.data.address.list[index];
    let str = encodeURIComponent(JSON.stringify(address));
    wx.navigateTo({
      url: 'changeAddress/changeAddress?str=' + str
    })
  },
  addAddress() {
    wx.navigateTo({
      url: 'addAddress/addAddress'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //iphoneX判断
    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      user: app.globalData.user,
      isIphoneX: isIphoneX,
    })
  },
  /**
   * 生命周期函数--监听页面展示
   */
  async onShow() {
    try {
      let msg = await Request.request({
        url: `/bbs/addr/page?len=20&page=1&userid=${this.data.user.userid}`
      })
      let width = {};
      msg.data.list.map((value) => { //存储每条地址状态及id
        width[value.addrid] = 0;
      });
      that.setData({
        address: msg.data,
        width: width
      })
    } catch (error) {
      console.log(error);
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    that.closeDel();
  },

  //滑动删除效果
  startX: 0,
  startY: 0,
  str: '', //得到滑动对应储存对象
  touchStart(e) {
    //获取初始点击位置
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;
    this.str = `width.${e.currentTarget.dataset.id}`;
  },

  touchEnd(e) {
    //得到左右滑动方向
    let width = this.startX - e.changedTouches[0].pageX;
    let height = this.startY - e.changedTouches[0].pageY;
    if (Math.abs(height) < 40) { //防止斜向滑动
      if (width > 0) {
        that.closeDel();
        this.setData({
          [this.str]: 180
        })
      } else if (width < 0) {
        this.setData({
          [this.str]: 0
        })
      }
    }
  },

  //删除地址
  deleteAddr: async function (e) {
    wx.showModal({
      title: '删除该地址',
      content: '您确定要删除吗？',
      async success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          var addrid = e.currentTarget.dataset.id;
          var path = "/bbs/addr/" + addrid;
          console.log(path);
          try {
            await Request.request({
              url: path,
              method: 'delete'
            }, true);
          } catch (error) {
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            })
          }
          try {
            let msg = await Request.request({
              url: `/bbs/addr/page?len=20&page=1&userid=${that.data.user.userid}`
            }, true)
            let width = {};
            msg.data.list.map((value) => { //存储每条地址状态及id
              width[value.addrid] = 0;
            });
            that.setData({
              address: msg.data,
              width: width
            })
          } catch (error) {
            console.log(error);
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(error) {
        console.log(error);
      }
    })
  },

  //  滑出/滑入  删除按钮
  deleteOut(e) {
    this.str = `width.${e.currentTarget.dataset.id}`;
    //判断按钮状态
    if (this.data.width[e.currentTarget.dataset.id] == 0) {
      that.closeDel();
      this.setData({
        [this.str]: 180
      })
    } else {
      this.setData({
        [this.str]: 0
      })
    }
  },

  //重置所有划出的删除按钮
  closeDel(catchKey = "") {
    let width = this.data.width;
    for (let key in width) {
      if (key !== catchKey) {
        width[key] = 0;
      }
    }
    that.setData({
      width
    });
  }
})