// pages/subscribe/subscribe.js
let app = getApp();
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_info: null,
    access_by_code: null,
    current_school_code: "1",
    current_department_code: "1",
    school_index: 0,
    department_index: 0,
    folded: true,
    display_status: true,
    h: 0,
    w: 0,
    code2index: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("page subscribe onLoad")
    wx.showLoading({
      title: '加载中',
    })

    this.setData({
      h: wx.getSystemInfoSync().windowHeight,
      w: wx.getSystemInfoSync().windowWidth
    })
    console.log("h:")
    console.log(this.data.h)
    console.log("w:")
    console.log(this.data.w)

    console.log("app.globalData.get_subscribed_info")
    console.log(app.globalData.get_subscribed_info)
    this.setData({
      login_info: app.globalData.login_info,
      access_by_code: app.globalData.access_by_code
    })
    let school_cnt = 0
    for (let school_code in this.data.access_by_code) {
      this.data.code2index[school_code] = {}
      this.data.code2index[school_code].school_index = school_cnt
      school_cnt += 1
      let department_cnt = 0
      this.data.code2index[school_code].department = {}
      for (let department_code in this.data.access_by_code[school_code].department) {
        this.data.code2index[school_code].department[department_code] = {}
        this.data.code2index[school_code].department[department_code].department_index = department_cnt
        department_cnt += 1
      }
    }
    this.setData({
      code2index: this.data.code2index
    })
    if (app.globalData.get_subscribed_info) {
      wx.hideLoading()
      return
    }
    if (!this.data.login_info.login_status) {
      console.log("未登录")
      wx.hideLoading()
      wx.redirectTo({
        url: '/pages/login/login',
        success: function () {
          wx.showToast({
            title: '您需要先进行登录',
            icon: "error"
          })
        }
      })
      return
    }
    let that = this
    let func = async function() {
      let e = await app.request_post({
        url: 'https://rinka-kujou.uk/get_user_subscribe',
        method: "POST",
        data: {
          access_token: that.data.login_info.access_token,
          open_id: that.data.login_info.open_id
        }
      })
      console.log("get_user_subscribe")
      console.log("参数(access_token, open_id)：")
      console.log(that.data.login_info.access_token)
      console.log(that.data.login_info.open_id)
      console.log("结果：")
      console.log(e)
      if (e.data.err_code === 0) {
        for (let subscribe_school_code in e.data.info) {
          that.data.access_by_code[subscribe_school_code].subscribed_num = e.data.info[subscribe_school_code].length
          for (let n = 0; n < e.data.info[subscribe_school_code].length; ++n) {
            that.data.access_by_code[subscribe_school_code].department[(e.data.info[subscribe_school_code][n]).toString()].subscribe_status = true
          }
        }
        that.setData({
          access_by_code: that.data.access_by_code
        })
        app.globalData.access_by_code = that.data.access_by_code
        app.globalData.get_subscribed_info = true
      } else if (e.data.err_code === 104) {
        wx.removeStorageSync('acc')
        wx.removeStorageSync('open_id')
        wx.removeStorageSync('avatarUrl')
        wx.removeStorageSync('nickname')
        app.globalData.login_info.access_token = ""
        app.globalData.login_info.open_id = ""
        app.globalData.login_info.login_status = false
        app.globalData.login_info.avatarUrl = defaultAvatarUrl
        app.globalData.login_info.nickname = ""
        that.setData({
          login_info: app.globalData.login_info
        })

        wx.redirectTo({
          url: '/pages/login/login',
          success: function () {
            wx.showToast({
              title: '您需要先进行登录',
              icon: "error"
            })
          }
        });
      }
      wx.hideLoading()
    }
    func()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  change_current_school_code: function(e) {
    console.log("change_school_list_index")
    console.log(e)
    console.log("e.detail.currentItemId类型")
    console.log(typeof e.detail.currentItemId)
    this.setData({
      current_school_code: e.detail.currentItemId
    })
    console.log("this.data.school_index:")
    console.log(this.data.school_index)
  },

  ok: function(args) {
    let that = this
    console.log("点击订阅按钮")
    console.log("结果：")
    console.log(args)
    let school_code = parseInt(this.data.current_school_code)
    let department_code = parseInt(args.currentTarget.dataset.department_code)
    // tmplIds: ['GtfweX744wEk1OFMOLivAM15GRYkL6x1Dsgkwcjjd6M']
    wx.requestSubscribeMessage({
      tmplIds: ['TMFuXpbbjg21tEN1c4D_kHGtsNuRccqo7ft3aBC2J6s'],
      success: function(res) {
        console.log("requestSubscribeMessage")
        console.log("结果")
        console.log(res);
        if (!(res.TMFuXpbbjg21tEN1c4D_kHGtsNuRccqo7ft3aBC2J6s == "accept")) {
          wx.showToast({
            title: "请授权通知权限",
            icon: "error"
          })
          return
        } else {
          wx.request({
            url: 'https://rinka-kujou.uk/subscribe',
            method: "POST",
            data: {
              info: [{
                school_code: school_code,
                department_code: department_code,
                oper: 0
              }],
              open_id: that.data.login_info.open_id,
              access_token: that.data.login_info.access_token
            },
            success: function(e) {
              console.log("subscribe")
              console.log("参数(school_code, department_code, oper)：")
              console.log(school_code.toString())
              console.log(department_code.toString())
              console.log("订阅")
              console.log("结果")
              console.log(e);
              if (e.data.err_code === 0) {
                that.data.access_by_code[school_code.toString()].subscribed_num += 1 
                that.data.access_by_code[school_code.toString()].department[department_code.toString()].subscribe_status = true
                that.setData({
                  access_by_code: that.data.access_by_code
                });
                app.globalData.access_by_code = that.data.access_by_code
                wx.showToast({
                  title: "订阅成功",
                  icon: "success"
                });
              }
            }
          })
        }
      }
    });
  },

  cancel: function(args) {
    let that = this
    console.log("点击取消订阅按钮")
    console.log("结果：")
    console.log(args)
    let school_code = parseInt(this.data.current_school_code)
    let department_code = parseInt(args.currentTarget.dataset.department_code)
    wx.request({
      url: 'https://rinka-kujou.uk/subscribe',
      method: "POST",
      data: {
        info: [{
          school_code: school_code,
          department_code: department_code,
          oper: 1
        }],
        open_id: that.data.login_info.open_id,
        access_token: that.data.login_info.access_token
      },
      success: function(e) {
        console.log("subscribe")
        console.log("参数(school_code, department_code, oper)：")
        console.log(school_code.toString())
        console.log(department_code.toString())
        console.log("取消订阅")
        console.log("结果")
        console.log(e);
        if (e.data.err_code === 0) {
          that.data.access_by_code[school_code.toString()].subscribed_num -= 1
          that.data.access_by_code[school_code.toString()].department[department_code.toString()].subscribe_status = false
          that.setData({
            access_by_code: that.data.access_by_code
          })
          app.globalData.access_by_code = that.data.access_by_code
          wx.showToast({
            title: "退订成功",
            icon: "success"
          });
        } 
      }
    });
  },

  change_display_status: function() {
    this.setData({
      display_status: !this.data.display_status
    })
  },

  handler_toggle: function() {
    this.setData({
      folded: !this.data.folded
    })
  },

  handler_tab_item_school: function(args) {
    console.log("handler_tab_item_school参数为:")
    console.log(args)
    this.setData({
      school_index: this.data.code2index[args.currentTarget.dataset.school_code.toString()].school_index,
      folded: true
    })
  },

  handler_tab_item_department: function(args) {
    console.log("handler_tab_item_department参数为:")
    console.log(args)
    this.setData({
      department_index: this.data.code2index[this.data.current_school_code].department[args.currentTarget.dataset.department_code.toString()].department_index,
      folded: true
    })
  }
})