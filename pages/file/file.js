// pages/file/file.js
//获取应用实例
const app = getApp();
Page({
	data: {
		article: {}
	},
	onLoad: function (options) {
    console.log("page file onLoad")
  },
  onShow: function() {
    console.log("page file onShow")
    const that = this
    wx.request({
      url: 'http://rinka-kujou.uk:8080/',
      method: "GET",
      success: function(e) {
        console.log("访问文件系统:")
        console.log(e)
        let obj = app.towxml(e.data, 'html', {
          // theme:'dark',
          events:{
            tap: function(args) {
              console.log('tap', args)
              console.log("tag:")
              console.log(args.currentTarget.dataset.data.tag)
              if (args.currentTarget.dataset.data.tag === "navigator") {
                let school_name = args.currentTarget.dataset.data.children["0"].text
                let href = 'http://rinka-kujou.uk:8080/' + args.currentTarget.dataset.data.attrs.href
                console.log("school_name:")
                console.log(school_name)
                console.log("href:")
                console.log(href)
                wx.navigateTo({
                  url: '/pages/file_item/file_item?name=' + school_name + '&href=' + href,
                })
              }
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