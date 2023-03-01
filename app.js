// app.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App({
  onLaunch() {
    let local_acc = wx.getStorageSync('acc') || "";
    if (local_acc == "") {
      this.globalData.acc = ""
      this.globalData.open_id = ""
      this.globalData.login_status = false
      this.globalData.avatarUrl = defaultAvatarUrl
      this.globalData.nickname = ""
    } else {
      this.globalData.acc = wx.getStorageSync('acc')
      this.globalData.open_id = wx.getStorageSync('open_id')
      this.globalData.login_status = true
      this.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
      this.globalData.nickname = wx.getStorageSync('nickname')
    }

    let that = this
    // 获取学校列表
    let func = async function() {
      let e1 = await that.request_get({
        url: 'https://rinka-kujou.uk/get_university',
        method: "GET", 
      })
      console.log("get_university")
      console.log("结果：")
      console.log(e1)
      for (let school_code in e1.data.universities) {
        that.globalData.access_by_code[school_code] = {}
        that.globalData.access_by_code[school_code].school_code = school_code
        that.globalData.access_by_code[school_code].school_name = e1.data.universities[school_code]
        that.globalData.access_by_code[school_code].subscribed_num = 0
      }
      for(let school_code in that.globalData.access_by_code) {
        let e2 = await that.request_post({
          url: 'https://rinka-kujou.uk/get_department',
          method: "POST",
          data: {
            university_code: parseInt(school_code)
          }
        })
        console.log("get_department")
        console.log("参数(university_code)：")
        console.log(school_code)
        console.log("结果：")
        console.log(e2)
        that.globalData.access_by_code[school_code].department = {}
        for (let department_code in e2.data.departments) {
          that.globalData.access_by_code[school_code].department[department_code] = {}
          that.globalData.access_by_code[school_code].department[department_code].department_code = department_code
          that.globalData.access_by_code[school_code].department[department_code].department_name = e2.data.departments[department_code]
          that.globalData.access_by_code[school_code].department[department_code].subscribe_status = false
        }
      }
      if (that.globalData.acc == "" || that.globalData.open_id == "") {
        console.log("没有有效的access_token或open_id")
        return
      }
      let e3 = await that.request_post({
        url: 'https://rinka-kujou.uk/get_user_subscribe',
        method: "POST",
        data: {
          access_token: that.globalData.acc,
          open_id: that.globalData.open_id
        }
      })
      console.log("get_user_subscribe")
      console.log("参数(access_token, open_id)：")
      console.log("略")
      console.log("结果：")
      console.log(e3)
      if (e3.data.err_code == 0) {
        for (let subscribe_school_code in e3.data.info) {
          that.globalData.access_by_code[subscribe_school_code].subscribed_num = e3.data.info[subscribe_school_code].length
          for (let n = 0; n < e3.data.info[subscribe_school_code].length; ++n) {
            that.globalData.access_by_code[subscribe_school_code].department[e3.data.info[subscribe_school_code][n]].subscribe_status = true
          }
        }
        that.globalData.get_subscribed_info = true
      } else if (e3.data.err_code == 104) {
        console.log("access_token已过期")
        wx.removeStorageSync('acc')
        wx.removeStorageSync('open_id')
        wx.removeStorageSync('avatarUrl')
        wx.removeStorageSync('nickname')
        that.globalData.acc = ""
        that.globalData.open_id = ""
        that.globalData.login_status = false
        that.globalData.avatarUrl = defaultAvatarUrl
        that.globalData.nickname = ""
      }
    }
    func()
  },
  globalData: {
    login_status: false,
    avatarUrl: defaultAvatarUrl,
    nickname: "",
    acc: "",
    open_id: "", 
    access_by_code: {},
    get_subscribed_info: false
  },
  // 引入`towxml3.0`解析方法
  towxml: require('/towxml/index'),
  
  request_get: function(args) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: args.url,
        method: args.method,
        success: function(e) {
          resolve(e)
        },
        fail: function(e) {
          reject(e)
        }
      })
    })
  },

  request_post: function(args) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: args.url,
        method: args.method,
        data: args.data,
        success: function(e) {
          resolve(e)
        },
        fail: function(e) {
          reject(e)
        }
      })
    })
  }
})