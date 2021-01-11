// pages/changeAddress/changeAddress.js
let app = getApp();
let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    //存储当前三级级联列表
    regions: [],
    checked: false,
    //省级列表数组
    provinces: [],
    //市级列表数组
    cities: [],
    //区县级列表数组
    hsiens: [],
    //对应regions三个子数组的索引
    multiIndex: [0, 0, 0],
    hsienId: 0,
    currentRegions: {},
    userid: 0

  },

  // //删除地址
  // deleteAddr() {
  //   var addrid = this.data.address.addrid;
  //   var path = "/addr/" + addrid;
  //   console.log(path);
  //   Request.deleteRequest(path, function () {
  //     wx.navigateBack({

  //     })
  //   });
  // },
  changeAddr(e) {
    var value = e.detail.value;
    var nickName = (value.nickName == null || value.nickName == '') ? this.data.address.nickName : value.nickName;
    var phone = (value.phone == null || value.phone == '') ? this.data.address.phone : value.phone;
    var detailAddr = value.detailAddr;
    var hsienId = this.data.hsienId;
    var checked = this.data.checked;
    var addrid = this.data.address.addrid;
    var userid = this.data.address.userid;
    var data = {
      //具体地址
      "address": detailAddr,
      //区县id
      "hsienId": hsienId,
      //是否设为默认
      "isDefault": checked,
      //昵称
      "nickName": nickName,
      //电话号码
      "phone": phone,
      "addrid": addrid,
      "userid": userid
    }
    console.log(data)
    var path = '/addr?addrid=' + addrid
    Request.putRequest(path, data, res => {
      console.log(res.data)
      wx.navigateBack();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var str = decodeURIComponent(options.str);
    console.log(str)
    var address = JSON.parse(str);
    var checked = false;
    if (address.isDefault == 1) {
      checked = true;
    }
    //Promise方式调用，保证函数按顺序执行
    this.getAllProvince().then(function (id) {
      that.getAllCities(id).then(function (id) {
        that.getAllHisen(id)
      })
    })

    this.setData({
      address: address,
      checked: checked,
      hsienId: address.hsienId,
      currentRegions: address.regions,
      userid: app.globalData.user.userid
    })
    console.log(this.data.address)
  },


  /**
   * 监听地区信息更改事件，即监听确定按钮
   */
  bindRegionChange: function (e) {
    var that = this;
    var currentHsienId = this.data.hsienList[this.data.multiIndex[2]].id
    var currentRegions = {
      "province": this.data.regions[0][that.data.multiIndex[0]],
      "city": this.data.regions[1][that.data.multiIndex[1]],
      "hsien": this.data.regions[2][that.data.multiIndex[2]]
    }
    console.log(that.data.multiIndex);
    console.log(that.data.regions[0][that.data.multiIndex[0]])
    this.setData({
      hsienId: currentHsienId,
      currentRegions: currentRegions
    })
  },
  /**
   * 获取所有省级单位
   */
  getAllProvince: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      Request.getAreaRequest('/provinces', {}, res => {
        var provinceList = res.data;
        // var provinceArr = provinceList.map((item) => { return item.name })
        var provinceArr = [];
        for (let i in provinceList) {
          provinceArr[i] = provinceList[i].name
        }
        that.setData({
          regions: [provinceArr, [],
            []
          ], // 更新三维数组 
          provinces: provinceArr,
          provinceList: provinceList
        })
        resolve(res.data[0].id);
      })
    })


  },

  /**
   * 根据已选择的省份id获取该省下所有市级单位
   */
  getAllCities: function (id) {
    var that = this;
    return new Promise(function (resolve, reject) {
      Request.getAreaRequest('/areas', {
        id: id
      }, res => {
        var cityList = res.data;

        // var cityArr = cityList.map((item) => {return item.name});
        var cityArr = [];
        for (let i in cityList) {
          cityArr[i] = cityList[i].name
        }
        that.setData({
          regions: [that.data.provinces, cityArr, []],
          cities: cityArr,
          cityList: cityList
        })
        resolve(res.data[0].id)
      })
    })

  },
  /**
   * 根据已选择的市的id获取该市下所有县级单位
   * @param {*} id 
   */
  getAllHisen: function (id) {
    var that = this;
    Request.getAreaRequest('/areas', {
      id: id
    }, res => {
      var hsienList = res.data;
      // var hsienArr = hsienList.map((item) => {return item.name});
      var hsienArr = [];
      for (var i in hsienList) {
        hsienArr[i] = hsienList[i].name
      }
      that.setData({
        regions: [this.data.provinces, this.data.cities, hsienArr],
        hsiens: hsienArr,
        hsienList: hsienList
      })
    })
  },
  /**
   * 单列切换事件监听
   * @param {*} e 
   */
  changeRegionColumn: function (e) {
    var that = this;
    var index = this.data.multiIndex;
    //主要是注意地址文件中的字段关系，省、市、区关联的字段有 sheng、di、level
    switch (e.detail.column) {
      //省一级切换，更新市县两级数据，默认选中第一条数据
      case 0:
        index = [e.detail.value, 0, 0];
        that.setData({
          //保证复合索引同步
          multiIndex: index
        })
        var selectedProvinceId = that.data.provinceList[e.detail.value].id;
        // var defaultCityId = that.data.cityList[0].id;
        this.getAllCities(selectedProvinceId).then(function (id) {
          that.getAllHisen(id)
        })
        break;
        //切换市一级数据，省一级数据保持不变，更新区县一级的数据
      case 1:
        index[1] = e.detail.value;
        index[2] = 0;
        that.setData({
          multiIndex: index
        })
        var selectedCityId = that.data.cityList[e.detail.value].id;
        this.getAllHisen(selectedCityId);
        break;
        //切换区县级，仅需保持符合索引同步
      case 2:
        index[2] = e.detail.value;
        that.setData({
          multiIndex: index
        })
        break;
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

  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},


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