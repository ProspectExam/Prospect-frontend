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
    let get_school_department_and_subscribe_info = async function(that) {
      /*------------------------------
        access_by_code: {
          "1": ..., // "1", "2", ... -> school_code (string)
          "2": {
            school_code: (int类型),
            school_name: (string类型),
            subscribed_num: (int类型),
            department: {
              "1": ...,
              "2": {
                department_code: (int类型),
                department_name: (string类型),
                subscribe_status: (boolean类型)
              },
              "3": ...,
              ...
            }
          },
          "3": ...,
          ...
        }
        ------------------------------*/
      let access_by_code = {}
      let e1 = await that.request_get({
        url: 'https://rinka-kujou.uk/get_university',
        method: "GET", 
      })
      console.log("get_university")
      console.log("结果：")
      console.log(e1)
      for (let school_code in e1.data.universities) {
        // console.log("school_code类型:")
        // console.log(typeof school_code)
        // school_code: (string)
        access_by_code[school_code] = {}
        access_by_code[school_code].school_code = parseInt(school_code)
        access_by_code[school_code].school_name = e1.data.universities[school_code]
        access_by_code[school_code].subscribed_num = 0
      }
      for(let school_code in access_by_code) {
        let e2 = await that.request_post({
          url: 'https://rinka-kujou.uk/get_department',
          method: "POST",
          data: {
            university_code: access_by_code[school_code].school_code
          }
        })
        console.log("get_department")
        console.log("参数(university_code)：")
        console.log(access_by_code[school_code].school_code)
        console.log("结果：")
        console.log(e2)
        access_by_code[school_code].department = {}
        for (let department_code in e2.data.departments) {
          // department_code: (string)
          access_by_code[school_code].department[department_code] = {}
          access_by_code[school_code].department[department_code].department_code = parseInt(department_code)
          access_by_code[school_code].department[department_code].department_name = e2.data.departments[department_code]
          access_by_code[school_code].department[department_code].subscribe_status = false
        }
      }
      if (that.globalData.login_info.access_token === "" || that.globalData.login_info.open_id === "") {
        console.log("没有有效的access_token或open_id")
        that.globalData.access_by_code = access_by_code
        that.globalData.get_subscribed_info = false
        return
      }
      let e3 = await that.request_post({
        url: 'https://rinka-kujou.uk/get_user_subscribe',
        method: "POST",
        data: {
          access_token: that.globalData.login_info.access_token,
          open_id: that.globalData.login_info.open_id
        }
      })
      console.log("get_user_subscribe")
      console.log("参数(access_token, open_id)：")
      console.log(that.globalData.login_info.access_token)
      console.log(that.globalData.login_info.open_id)
      console.log("结果：")
      console.log(e3)
      if (e3.data.err_code === 0) {
        for (let subscribe_school_code in e3.data.info) {
          access_by_code[subscribe_school_code].subscribed_num = e3.data.info[subscribe_school_code].length
          for (let n = 0; n < e3.data.info[subscribe_school_code].length; ++n) {
            // e3.data.info[subscribe_school_code][n]: (number)
            access_by_code[subscribe_school_code].department[(e3.data.info[subscribe_school_code][n]).toString()].subscribe_status = true
          }
        }
        that.globalData.access_by_code = access_by_code
        that.globalData.get_subscribed_info = true
        return
      } else if (e3.data.err_code == 104) {
        console.log("access_token已过期")
        wx.removeStorageSync('acc')
        wx.removeStorageSync('open_id')
        wx.removeStorageSync('avatarUrl')
        wx.removeStorageSync('nickname')
        that.globalData.login_info.access_token = ""
        that.globalData.login_info.open_id = ""
        that.globalData.login_info.login_status = false
        that.globalData.login_info.avatarUrl = defaultAvatarUrl
        that.globalData.login_info.nickname = ""
      }
      that.globalData.access_by_code = access_by_code
      that.globalData.get_subscribed_info = true
      return
    }
    get_school_department_and_subscribe_info(app)
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