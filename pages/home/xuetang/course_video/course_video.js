Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',//video组件可用的url链接,
    url2:"cloud://bim.6269-bim-1302628079/video/vue.js视频教程(无废话版)_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili.mp4",
    url3:"cloud://bim.6269-bim-1302628079/video/OpenRoads 土木单元_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili.mp4",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var videoContext = wx.createVideoContext('myvideo', this);
　　videoContext.requestFullScreen();
    console.log(options.url1);
    this.setData({
      url: options.url1,
    });
  },




  // 自动全屏
	onShow: function () {
		this.videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
		this.videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
			direction: 90						// 屏幕逆时针90度
		});
	},





})