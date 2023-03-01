// pages/home/home.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_by_code: {},
    get_subscribed_info: false,
    have_subscribe: false,
    waiting: false ,
    floorStatus: false,
    waterfall_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.get_waterfall_list()

    if (!app.globalData.get_subscribed_info) {
      return
    }
    this.setData({
      get_subscribed_info: true,
      access_by_code: app.globalData.access_by_code
    })
    for (let school_code in this.data.access_by_code) {
      if (this.data.access_by_code[school_code].subscribed_num != 0) {
        this.setData({
          have_subscribe: true
        })
        return
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.waiting) return;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  get_waterfall_list: function() {
    var that = this
    wx.request({
      url: 'https://rinka-kujou.uk/waterfall',
      method: "GET",
      success: function(e) {
        console.log("waterfall")
        console.log("结果：")
        console.log(e)
        if (e.data.err_code == 0) {
          let waterfall_list_ret = []
          for (let i = 0; i < e.data.items.length; ++i) {
            let waterfall_list_item_ret = {}
            waterfall_list_item_ret.title = e.data.items[i].title
            waterfall_list_item_ret.url = e.data.items[i].img_source_link,
            // waterfall_list_item_ret.summary = e.data.items[i].summary
            waterfall_list_item_ret.post_id = e.data.items[i].post_id
            waterfall_list_ret.push(waterfall_list_item_ret)
          }
          that.setData({
            waterfall_list: waterfall_list_ret
          })
        }
      }
    })
  },

  handler: function(argument) {
    var id = argument.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/detail/detail?id=' + id
    // })
    wx.navigateTo({
      url: '/pages/light/index'
    })
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 250) {
      this.setData({
        floorStatus: true
      });
    } else {
      this.setData({
        floorStatus: false
      });
    }
  },

  handler_waterfall: function(e) {
    console.log("handler_waterfall")
    console.log(e)
    wx.navigateTo({
      url: '/pages/waterfall_content/waterfall_content?post_id=' + this.data.waterfall_list[e.currentTarget.dataset.id].post_id,
    })
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})