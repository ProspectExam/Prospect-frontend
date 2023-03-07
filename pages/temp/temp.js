// pages/temp/temp.js
//获取应用实例
const app = getApp();
Page({
	data: {
    article: {},
    name: null,
    href: null
	},
	onLoad: function (options) {
    console.log("page file_item onLoad")
    console.log("options:")
    console.log(options)
    this.setData({
      name: options.name,
      href: options.href
    })
  },
  onShow: function() {
    const that = this
    wx.request({
      url: 'https://rinka-kujou.uk/' + that.data.href,
      method: "GET",
      success: function(e) {
        console.log("访问文件系统子目录")
        console.log(that.data.name)
        console.log(e)
        let obj = app.towxml(e.data, 'html', {
          // theme:'dark',
          events:{
            tap: function(args) {
              console.log('tap', args)
              console.log("tag:", args.currentTarget.dataset.data.tag)
              return
              let name = args.currentTarget.dataset.data.children["0"].text
              let href = args.currentTarget.dataset.data.attrs.href
              console.log("name:", name)
              console.log("href:", href)
              wx.navigateTo({
                url: '/pages/temp/temp?name=' + name + '&href=' + href,
              })
            },
            change: function(args) {
              console.log('todo', args)
            }
          }
        })
        that.setData({
          article: obj
        });
      },
      fail: function(e) {
        console.log("request fail:")
        console.log(e)
      }
    })
  }
})