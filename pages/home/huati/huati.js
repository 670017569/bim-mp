// pagesComponents/homeComponents/huati/huati.js
//Component Object
import Request from "../../../utils/request"

let that;

Component({
  properties: {

  },
  options: {
    addGlobalClass: true
  },
  data: {
    topic: [],
    currentPage: 1
  },
  methods: {
    async getData(show) {
      let page = 0;
      console.log("huati components");
      try {
        let msg = await Request.request({
          url: `/bbs/topic/page?len=5&page=${page}`
        }, show);
        if (msg.data.list.length === 0) {
          wx.showToast({
            icon: 'none',
            title: '目前还没有话题哦'
          })
        } else {
          that.setData({
            currentPage: page + 1,
            topic: msg.data.list
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    //获取下一页数据
    async getNextData() {
      let page = this.data.currentPage;
      //没有话题不做处理
      if (this.data.topic.length < 5) {
        return;
      }
      console.log("next huati");
      try {
        let msg = await Request.request({
          url: `/bbs/topic/page?len=5&page=${page}`
        });
        if (msg.data.list.length === 0) {
          wx.showToast({
            icon: 'none',
            title: '已经到底了'
          })
        } else {
          that.setData({
            currentPage: page + 1,
            topic: [...this.data.topic, ...msg.data.list]
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    //跳转话题详情页
    getTopic: function (e) {
      let tpid = e.currentTarget.dataset.tpid;
      wx.navigateTo({
        url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + tpid
      })
    },
    //获取发起者详细信息
    person_index: function (options) {
      var userid = options.currentTarget.dataset.userid;
      wx.navigateTo({
        url: '/pages/mycenter/person_index/person_index?userid=' + userid
      })
    }
  },
  created: async function () {
    that = this;
    console.log("huati creat")
  },
  attached: function () {

  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
});