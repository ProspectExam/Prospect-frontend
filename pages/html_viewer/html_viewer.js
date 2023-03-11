// pages/html_viewer/html_viewer.js
//获取应用实例
const app = getApp();
Page({
	data: {
    article: {},
    name: null,
    href: null
	},
	onLoad: function (options) {
    console.log("page html_viewer onLoad")
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
      url: that.data.href,
      method: "GET",
      success: function(e) {
        console.log("访问：", that.data.href)
        console.log(that.data.name)
        console.log(e)
        let obj = app.towxml(e.data, 'html', {
          // theme:'dark',
          events:{
            tap: function(args) {
              console.log('tap', args)
              console.log("tag:", args.currentTarget.dataset.data.tag)
              if (args.currentTarget.dataset.data.tag === "navigator") {
                let name = args.currentTarget.dataset.data.children["0"].text
                let href = args.currentTarget.dataset.data.attrs.href
                console.log("name:", name)
                console.log("href:", href)
                if (href.substr(-5, 5) === ".html") {
                  console.log(name, "是一个html文件")
                  wx.navigateTo({
                    url: '/pages/html_viewer/html_viewer?name=' + name + '&href=' + href,
                  })
                } else {
                  
                }
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