// pages/mine/mine.js
var app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    islogin: false,
    avatarUrl: defaultAvatarUrl,
    nickname: "",
    list: [
      {
        text: "信息提醒",
        id: 1 
      }, {
        text: "专业推荐",
        id: 2 
      }, {
        text: "保研资讯",
        id: 3
      }, {
        text: "保研课堂",
        id: 4
      }, {
        text: "保研商场",
        id: 5
      }
    ],
    version: "V 1.0.0"
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
    console.log("page mine onShow()")
    console.log("app.globalData.login_status:")
    console.log(app.globalData.login_status)
    this.setData({
      islogin: app.globalData.login_status,
      avatarUrl: app.globalData.avatarUrl,
      nickname: app.globalData.nickname
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
    let id = argument.currentTarget.dataset.id;
    if (id == 1) {
      wx.navigateTo({
        url: '/pages/subscribe/subscribe',
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/function/function?id=' + id,
    });
  },

  handler_logoff: function() {
    wx.removeStorageSync('acc');
    wx.removeStorageSync('open_id');
    wx.removeStorageSync('avatarUrl');
    wx.removeStorageSync('nickname');
    app.globalData.login_status = false;
    app.globalData.avatarUrl = defaultAvatarUrl;
    app.globalData.nickname = "";
    this.setData({
      islogin: false,
      avatarUrl: defaultAvatarUrl,
      nickname: ""
    });
    wx.switchTab({
      url: '/pages/mine/mine',
    });
  }
})