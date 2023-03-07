// pages/file_download/file_download.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exist: false,
    download_percent: 0,
    download_totalBytesWritten: 0,
    download_totalBytesExpectedToWrite: 0,
    filePath: "",
    name: "",
    href: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("page file_download onLoad")
    console.log("options:")
    console.log(options)
    this.setData({
      name: options.name,
      href: options.href
    })

    if (app.globalData.download_file[this.data.name]) {
      console.log(this.data.name, "文件存在")
      this.setData({
        exist: true,
        filePath: app.globalData.download_file[this.data.name]
      })
      wx.openDocument({
        filePath: app.globalData.download_file[this.data.name],
        success: function(u)  {
          console.log(u)
        },
        fail: function(u) {
          console.log(u)
        }
      })
      return
    } else {
      console.log(this.data.name, "文件不存在")
    }

    const that = this
    const downloadTask = wx.downloadFile({
      url: that.data.href,
      success: function(res) {
        console.log(res)
        that.setData({
          filePath: res.tempFilePath,
          exist: true
        })
        app.globalData.download_file[that.data.name] = res.tempFilePath
        wx.setStorageSync('download_file', app.globalData.download_file)
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function(u)  {
            console.log(u)
          },
          fail: function(u) {
            console.log(u)
          }
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
    
    downloadTask.onProgressUpdate((opu_res) => {
      // console.log('下载进度', opu_res.progress)
      // console.log('已经下载的数据长度', opu_res.totalBytesWritten)
      // console.log('预期需要下载的数据总长度', opu_res.totalBytesExpectedToWrite)
      that.setData({
        download_percent: opu_res.progress,
        download_totalBytesWritten: opu_res.totalBytesWritten,
        download_totalBytesExpectedToWrite: opu_res.totalBytesExpectedToWrite
      })
    })
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

  openfile: function() {
    wx.openDocument({
      filePath: this.data.filePath,
      success: function(u)  {
        console.log(u)
      },
      fail: function(u) {
        console.log(u)
      }
    })
  },

  cancel_or_delete: function() {
    if (this.data.download_percent >= 100) {

    } else {
      
    }
  }
})