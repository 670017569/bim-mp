// pages/mycenter/myaddress/addAddress/addAddress.js
/**
 * 2020.10.18 更新
 * 舍弃picker（mode=region），启用mode=multiSelector
 * 向后端的area微服务请求地址数据
 * 数据库的用户的地址信息中仅保存区县级的id
 * 
 * 待处理bug：
 *      选择器选好地址后不按确定按钮，直接取消会使regions的显示信息已经改变，
 * 但最终选取结果hsienId的值却未更新，导致显示的与最终结果不匹配
 * 
 */
let app = getApp();
let Request = require("../../../../utils/request"); // 封装请求
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //储存显示地区
    address: [],
    //是否已有默认值
    addressIsempty: true,
    //地区三位数组的初始数据
    regions: [],
    //省级列表数组
    provinces: [],
    //市级列表数组
    cities: [],
    //区县级列表数组
    hsiens: [],
    //对应regions三个子数组的索引
    multiIndex: [0, 0, 0],
    userid: 0,
    //最终存到数据库中的区县级id
    hsienId: 2,
    checked: false
  },
  addAddr(e) {
    var value = e.detail.value;
    var nickName = value.nickName;
    var phone = value.phone;
    var detailAddr = value.detailAddr;
    var city = this.data.hsienId;
    var checked = this.data.checked;
    var userid = this.data.userid;
    var hsienId = this.data.hsienId;
    var address = {
      "address": detailAddr,
      "city": city,
      "isDefault": checked,
      "nickName": nickName,
      "phone": phone,
      "userid": userid,
      "hsienId": hsienId
    }
    console.log('添加地址：')
    console.log(address);
    var path = '/addr'
    Request.postRequest(path, address, res => {
      console.log(res.data);
      wx.navigateBack();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    var that = this;
    //Promise方式调用，保证函数按顺序执行
    this.getAllProvince().then(function (id) {
      that.getAllCities(id).then(function (id) {
        that.getAllHisen(id)
      })
    })

    this.setData({
      userid: app.globalData.user.userid,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 获取所有省级单位
   */
  getAllProvince: async function () {
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
      if (this.data.addressIsempty) {
        this.setData({
          address: [this.data.provinces[0], this.data.cities[0], hsienArr[0]],
          addressIsempty: false
        })
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
   * 监听地区信息更改事件，即监听确定按钮
   */
  bindRegionChange: function () {
    var currentHsienId = this.data.hsienList[this.data.multiIndex[2]].id;
    var regions = this.data.regions;
    var multiIndex = this.data.multiIndex;
    this.setData({
      hsienId: currentHsienId,
      address: [regions[0][multiIndex[0]], regions[1][multiIndex[1]], regions[2][multiIndex[2]]]
    })
  }
})