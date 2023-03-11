// pages/local_file/local_file.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    download_file: {},
    empty: true
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
    this.setData({
      download_file: app.globalData.download_file,
      empty: true
    })
    for (let item in this.data.download_file) {
      this.setData({
        empty: false
      })
      break
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handler_tap: function(e) {
    const that = this
    console.log("openfile", e)
    wx.showActionSheet({
      itemList: ['打开文件', '删除文件'],
      success (res) {
        console.log(res)
        if (res.tapIndex === 0) {
          wx.openDocument({
            filePath: e.currentTarget.dataset.filepath,
            success: function(u)  {
              console.log(u)
            },
            fail: function(u) {
              console.log(u)
            }
          })
        } else if (res.tapIndex === 1) {
          let fsm = wx.getFileSystemManager()
          fsm.removeSavedFile({
            filePath: e.currentTarget.dataset.filepath,
            success: function(u)  {
              console.log(u)
              delete app.globalData.download_file[e.currentTarget.dataset.filename]
              wx.setStorageSync('download_file', app.globalData.download_file)
              that.setData({
                download_file: app.globalData.download_file,
                empty: true
              })
              for (let item in that.data.download_file) {
                that.setData({
                  empty: false
                })
                break
              }
            },
            fail: function(u) {
              console.log(u)
            }
          })
        }
      },
      fail (res) {
        console.log(res)
      }
    })
  }
})