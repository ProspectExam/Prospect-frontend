// app.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

let get_login_info = function() {
  let login_info = {}
  let local_acc = wx.getStorageSync('acc') || ""
  if (local_acc == "") {
    login_info.access_token = ""
    login_info.open_id = ""
    login_info.login_status = false
    login_info.avatarUrl = defaultAvatarUrl
    login_info.nickname = ""
  } else {
    login_info.access_token = wx.getStorageSync('acc')
    login_info.open_id = wx.getStorageSync('open_id')
    login_info.login_status = true
    login_info.avatarUrl = wx.getStorageSync('avatarUrl')
    login_info.nickname = wx.getStorageSync('nickname')
  }
  return login_info
}

// let get_school_department_and_subscribe_info = async function(that) {
//   /*------------------------------
//     access_by_code: {
//       "1": ..., // "1", "2", ... -> school_code (string)
//       "2": {
//         school_code: (int类型),
//         school_name: (string类型),
//         subscribed_num: (int类型),
//         department: {
//           "1": ...,
//           "2": {
//             department_code: (int类型),
//             department_name: (string类型),
//             subscribe_status: (boolean类型)
//           },
//           "3": ...,
//           ...
//         }
//       },
//       "3": ...,
//       ...
//     }
//     ------------------------------*/
//   let access_by_code = {}
//   let e1 = await that.request_get({
//     url: 'https://rinka-kujou.uk/get_university',
//     method: "GET", 
//   })
//   console.log("get_university")
//   console.log("结果：")
//   console.log(e1)
//   for (let school_code in e1.data.universities) {
//     // console.log("school_code类型:")
//     // console.log(typeof school_code)
//     // school_code: (string)
//     access_by_code[school_code] = {}
//     access_by_code[school_code].school_code = parseInt(school_code)
//     access_by_code[school_code].school_name = e1.data.universities[school_code]
//     access_by_code[school_code].subscribed_num = 0
//   }
//   for(let school_code in access_by_code) {
//     let e2 = await that.request_post({
//       url: 'https://rinka-kujou.uk/get_department',
//       method: "POST",
//       data: {
//         university_code: access_by_code[school_code].school_code
//       }
//     })
//     console.log("get_department")
//     console.log("参数(university_code)：")
//     console.log(access_by_code[school_code].school_code)
//     console.log("结果：")
//     console.log(e2)
//     access_by_code[school_code].department = {}
//     for (let department_code in e2.data.departments) {
//       // department_code: (string)
//       access_by_code[school_code].department[department_code] = {}
//       access_by_code[school_code].department[department_code].department_code = parseInt(department_code)
//       access_by_code[school_code].department[department_code].department_name = e2.data.departments[department_code]
//       access_by_code[school_code].department[department_code].subscribe_status = false
//     }
//   }
//   if (that.globalData.login_info.access_token === "" || that.globalData.login_info.open_id === "") {
//     console.log("没有有效的access_token或open_id")
//     that.globalData.access_by_code = access_by_code
//     that.globalData.get_subscribed_info = false
//     return
//   }
//   let e3 = await that.request_post({
//     url: 'https://rinka-kujou.uk/get_user_subscribe',
//     method: "POST",
//     data: {
//       access_token: that.globalData.login_info.access_token,
//       open_id: that.globalData.login_info.open_id
//     }
//   })
//   console.log("get_user_subscribe")
//   console.log("参数(access_token, open_id)：")
//   console.log(that.globalData.login_info.access_token)
//   console.log(that.globalData.login_info.open_id)
//   console.log("结果：")
//   console.log(e3)
//   if (e3.data.err_code === 0) {
//     for (let subscribe_school_code in e3.data.info) {
//       access_by_code[subscribe_school_code].subscribed_num = e3.data.info[subscribe_school_code].length
//       for (let n = 0; n < e3.data.info[subscribe_school_code].length; ++n) {
//         // e3.data.info[subscribe_school_code][n]: (number)
//         access_by_code[subscribe_school_code].department[(e3.data.info[subscribe_school_code][n]).toString()].subscribe_status = true
//       }
//     }
//     that.globalData.access_by_code = access_by_code
//     that.globalData.get_subscribed_info = true
//     return
//   } else if (e3.data.err_code == 104) {
//     console.log("access_token已过期")
//     wx.removeStorageSync('acc')
//     wx.removeStorageSync('open_id')
//     wx.removeStorageSync('avatarUrl')
//     wx.removeStorageSync('nickname')
//     that.globalData.login_info.access_token = ""
//     that.globalData.login_info.open_id = ""
//     that.globalData.login_info.login_status = false
//     that.globalData.login_info.avatarUrl = defaultAvatarUrl
//     that.globalData.login_info.nickname = ""
//   }
//   that.globalData.access_by_code = access_by_code
//   that.globalData.get_subscribed_info = true
//   return
// }

App({
  onLaunch() {
    /*------------------------------
      login_info: {
        access_token: ...,
        open_id: ...,
        login_status: ...,
        avatarUrl: ...,
        nickname: ...
      }
    ------------------------------*/
    this.globalData.login_info = get_login_info()

    // 在 app.js 调用 get_school_department_and_subscribe_info(this) 然后调试
    // 会出现预料之外的情况，放入 mine.js 则一切正常
    // get_school_department_and_subscribe_info(this)

    this.globalData.download_file = wx.getStorageSync('download_file') || {}

    console.log("App onLaunch end")
    console.log("this.globalData:")
    console.log(this.globalData)
  },
  globalData: {
    login_info: null, 
    access_by_code: null,
    get_subscribed_info: false,
    download_file: null
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