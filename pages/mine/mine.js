// pages/mine/mine.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
let app = getApp()

Page({
  data: {
    login_info: {},
    list: [
      {
        text: "订阅提醒",
        id: 1 
      }, {
        text: "文件查询",
        id: 2 
      }, {
        text: "本地缓存",
        id: 3
      }
    ],
    version: "V 1.0.0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("page mine onLoad")
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
    console.log("page mine onShow")
    console.log("app.globalData.login_info:")
    console.log(app.globalData.login_info)
    this.setData({
      login_info: app.globalData.login_info
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  login: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  handler_list: function(argument) {
    let id = argument.currentTarget.dataset.id
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/subscribe/subscribe'
      })
      return
    } else if (id == 2) {
      wx.navigateTo({
        url: '/pages/file/file',
      })
      return
    } else if (id == 3) {
      wx.navigateTo({
        url: '/pages/local_file/local_file',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/function/function?id=' + id
    })
  },

  handler_logoff: function() {
    app.globalData.login_info.access_token = ""
    app.globalData.login_info.open_id = ""
    app.globalData.login_info.login_status = false
    app.globalData.login_info.avatarUrl = defaultAvatarUrl
    app.globalData.login_info.nickname = ""
    wx.removeStorageSync('acc')
    wx.removeStorageSync('open_id')
    wx.removeStorageSync('avatarUrl')
    wx.removeStorageSync('nickname')
    this.setData({
      login_info: app.globalData.login_info
    })
  }
})