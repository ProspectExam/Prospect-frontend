// index.js
// 获取应用实例
var app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    nickname: ""
  },

  onLoad() {
    
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  handler_input: function(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  handler_login: function () {
    var that = this;
    wx.login({
      success: function (res) {
        //-----------------debug--------------
        // wx.showToast({
        //   title: 'wx.login成功',
        //   icon: "success"
        // });
        //-------------------------------------
        console.log("wx.login()")
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
              if (e.data.err_code == 0) {
                wx.setStorageSync('acc', e.data.access_token);
                wx.setStorageSync('open_id', e.data.open_id);
                wx.setStorageSync('avatarUrl', that.data.avatarUrl);
                wx.setStorageSync('nickname', that.data.nickname);
                app.globalData.login_status = true;
                app.globalData.avatarUrl = that.data.avatarUrl;
                app.globalData.nickname = that.data.nickname;
                wx.switchTab({
                  url: '/pages/mine/mine',
                })  
              } else {
                app.globalData.login_status = false;
                app.globalData.avatarUrl = defaultAvatarUrl;
                app.globalData.nickname = "";
                wx.showToast({
                  title: '登录失败',
                  icon: "error"
                });
              }
            },
            fail: function(err) {
              console.log("send_code fail")
              console.log(err)
            }
          });
        } else {
          console.log("wx.login()进入success回调，code出错");
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
      }
    });
  }
})