// index.js
let app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    login_info: null
  },

  onLoad() {
    this.setData({
      login_info: app.globalData.login_info
    })   
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.data.login_info.avatarUrl = avatarUrl 
    this.setData({
      login_info: this.data.login_info
    })
  },

  handler_input: function(e) {
    this.data.login_info.nickname = e.detail.value
    this.setData({
      login_info: this.data.login_info
    })
  },

  handler_login: function () {
    let that = this;
    wx.login({
      success: function (res) {
        //-----------------debug--------------
        // wx.showToast({
        //   title: 'wx.login成功',
        //   icon: "success"
        // });
        //-------------------------------------
        console.log("wx.login")
        console.log("结果：")
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'https://rinka-kujou.uk/send_code',
            method: "POST",
            data: {
              code: res.code,
              access_token: "",
              open_id: ""
            },
            success: function (e) {
              console.log("send_code")
              console.log("参数(code, access_token: '', open_id: '')：")
              console.log(res.code)
              console.log("结果")
              console.log(e)
              if (e.data.err_code === 0) {
                app.globalData.login_info.access_token = e.data.access_token
                app.globalData.login_info.open_id = e.data.open_id
                app.globalData.login_info.login_status = true
                app.globalData.login_info.avatarUrl = that.data.login_info.avatarUrl
                app.globalData.login_info.nickname = that.data.login_info.nickname
                wx.setStorageSync('acc', e.data.access_token)
                wx.setStorageSync('open_id', e.data.open_id)
                wx.setStorageSync('avatarUrl', that.data.login_info.avatarUrl)
                wx.setStorageSync('nickname', that.data.login_info.nickname)
                that.setData({
                  login_info: app.globalData.login_info
                })
                wx.switchTab({
                  url: '/pages/mine/mine',
                })  
              } else {
                app.globalData.login_info.access_token = ""
                app.globalData.login_info.open_id = ""
                app.globalData.login_info.login_status = false
                app.globalData.login_info.avatarUrl = defaultAvatarUrl
                app.globalData.login_info.nickname = ""
                that.setData({
                  login_info: app.globalData.login_info
                })
                wx.showToast({
                  title: '登录失败',
                  icon: "error"
                })
              }
            },
            fail: function(err) {
              console.log("send_code fail")
              console.log(err)
              app.globalData.login_info.access_token = ""
              app.globalData.login_info.open_id = ""
              app.globalData.login_info.login_status = false
              app.globalData.login_info.avatarUrl = defaultAvatarUrl
              app.globalData.login_info.nickname = ""
              that.setData({
                login_info: app.globalData.login_info
              })
              wx.showToast({
                title: '登录失败',
                icon: "error"
              })
            }
          })
        } else {
          console.log("wx.login进入success回调，code出错")
          app.globalData.login_info.access_token = ""
          app.globalData.login_info.open_id = ""
          app.globalData.login_info.login_status = false
          app.globalData.login_info.avatarUrl = defaultAvatarUrl
          app.globalData.login_info.nickname = ""
          that.setData({
            login_info: app.globalData.login_info
          })
          wx.showToast({
            title: '登录失败',
            icon: "error"
          })
        }
      },
      fail: function() {
        console.log("wx.login()进入fail回调");
        //------------------debug---------------
        wx.showToast({
          title: 'wx.login失败',
          icon: "error"
        });
        //--------------------------------------
        app.globalData.login_info.access_token = ""
        app.globalData.login_info.open_id = ""
        app.globalData.login_info.login_status = false
        app.globalData.login_info.avatarUrl = defaultAvatarUrl
        app.globalData.login_info.nickname = ""
        that.setData({
          login_info: app.globalData.login_info
        })
        wx.showToast({
          title: '登录失败',
          icon: "error"
        })
      }
    });
  }
})