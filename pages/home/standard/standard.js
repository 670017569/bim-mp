// homeComponents/standard/standard.js
//Component Object
import Request from '../../../utils/request'

var that;

Component({
  properties: {

  },
  data: {
    activeNames: ['1'],
    biaozhunLeft: '',
    biaozhunRight: '',
    page: 1,
    biaozhunCurrentIndex: 0, //列表对应索引
    biaozhunCurrentId: 1, //城市id
    biaozhunCurrentProvince: '北京市' //默认列表名
  },
  methods: {
    async getData(show) {
      //try {
        console.log("standard component");
        //获取标准左侧列表数据
        let msg = await Request.request({
          url: "/area/provinces"
        }, show);
        //默认请求第一个城市的数据
        let firstProvince = await Request.request({
          url: `/area/areas?id=${msg.data[0].id}`
        })
        console.log(firstProvince.data);
        //缓存数据
        wx.setStorageSync("standard_biaozun", msg.data);
        that.setData({
          page: this.data.page + 1,
          biaozhunLeft: msg.data,
          biaozhunRight: firstProvince.data
        })
      //} catch (error) {
        //console.log(error);
      //}
    },
    //获取下一页数据
    async getNextData() {
      let page = this.data.page;
      if (this.data.biaozhunRight < 20) {
        wx.showToast({
          icon: 'none',
          title: '已经到底了'
        })
        return;
      }
      try {
        console.log("next standard");
        //获取标准的数据
        var msg = await Request.request({
          url: `/bbs/link?len=20&page=${page}&type=standard`
        });
        if (msg.data.list.length === 0) {
          wx.showToast({
            icon: 'none',
            title: '已经到底了'
          })
          return;
        }
        //缓存数据
        wx.setStorageSync("standard_biaozun", [...this.data.biaozhunLeft, ...msg.data.list]);
        /*var provinceList = [...this.data.biaozhunLeft, ...msg.data.list].map((obj) => {
          return obj.province;
        })*/
        /*that.setData({
          page: this.data.page + 1,
          biaozhunLeft: [...this.data.biaozhunLeft, ...msg.data.list],
        })*/
      } catch (error) {
        console.log(error);
      }
    },
    //右侧列表展开，合并
    onChange(event) {
      this.setData({
        activeNames: event.detail,
      });
    },
    //右侧省份切换
    handleBiaozhunItem: function (e) {
      var province = e.currentTarget.dataset.province;
      console.log(province);
      this.setData({
        biaozhunCurrentProvince: province,
      })
    },
    /**
     * 下载文件并预览
     */
    downloadFile: function (e) {
      console.log(e);
      let url = e.currentTarget.dataset.url;
      wx.downloadFile({
        url: url,
        header: {},
        success: function (res) {
          var filePath = res.tempFilePath;
          console.log(filePath);
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          })
        },
        fail: function (res) {
          console.log('文件下载失败');
        },
        complete: function (res) {},


        onProgressUpdate: function (res) {
          console.log('下载进度', res.progress)
          console.log('已经下载的数据长度', res.totalBytesWritten)
          console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
        },
      })
    }
  },
  created: async function () {
    console.log("standard created");
    that = this;
    //读取缓存
    try {
      // var biaozhunLeft = await wx.getStorageSync("standard_biaozun");
      // if (biaozhunLeft) {
      //   var provinceList = biaozhunLeft.map((obj) => {
      //     return obj.province;
      //   })
      //   that.setData({
      //     biaozhunLeft: biaozhunLeft,
      //     province_list: provinceList
      //   })
      // }
    } catch (error) {
      console.log(error);
    }
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