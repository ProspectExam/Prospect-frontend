// pages/waterfall_content/waterfall_content.js
//获取应用实例
const app = getApp();
Page({
	data: {
		article: {}
	},
	onLoad: function (options) {
    console.log("page waterfall_content onLoad()")
    console.log(options)
    let post_id = options.post_id
		const that = this;

    wx.request({
      url: 'https://rinka-kujou.uk/' + post_id,
      method: "GET",
      success: function(e) {
        console.log(post_id)
        console.log("结果：")
        console.log(e)
        let obj = app.towxml(e.data, 'markdown', {
          // theme:'dark',
          events:{
            tap: function(args) {
              console.log('tap', args)
              console.log("tag:")
              console.log(args.currentTarget.dataset.data.tag)
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
        });
  
        that.setData({
          article: obj
        });
      }
    })
	}
})