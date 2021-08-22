/*
 * @Author: LeoCong
 * @Date: 2021-08-22 23:31:02
 * @LastEditors: LeoCong
 * @LastEditTime: 2021-08-23 00:02:37
 * @Description: 开发者工具
 */

// 创建自定义面板，同一个插件可以创建多个自定义面板，参数依次为：panel标题、图标、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('MyPanel', '', 'html/panel.html', (panel) =>{
  // 这个log一般看不到
	console.log('自定义面板创建成功！', panel)
})
