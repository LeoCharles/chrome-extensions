/*
 * @Author: LeoCong
 * @Date: 2021-07-08 01:10:24
 * @LastEditors: LeoCode
 * @LastEditTime: 2021-12-15 23:13:22
 * @Description: 后台页
 * 后台页随着浏览器的打开而打开，随着浏览器的关闭而关闭，是一个常驻的页面
 * background的权限非常高，几乎可以调用所有的 Chrome 扩展API
 * 而且可以无限制跨域，也就是可以跨域访问任何网站而无需要求对方设置CORS
 */

// 监听 chrome 插件加载
chrome.runtime.onInstalled.addListener(() => {
	// console.log('chrome_extension_demo installed');
})

/** ------------------ background 与 popup 通信 ------------------ */
// 可以在 popup 中直接调用 background 的方法和 DOM
function callFromPopup() {
	alert('你好 Popup，我是 background！');
}

// 在 background 中访问 popup
$('#get_popup_title').click(() => {
	// popup 打开才能访问
	var views = chrome.extension.getViews({
		type:'popup'
	})
	if(views.length > 0) {
		alert(views[0].document.title)
	} else {
		alert('popup未打开！')
	}
})

// 录屏
async function recordScreen () {
	try {
		// 让用户选择和授权捕获展示的内容（要共享的屏幕或窗口），从而获取媒体流，返回值是一个 Promise
		let stream = await navigator.mediaDevices.getDisplayMedia({
			video: true, // 启用视频
		})

		// 设备支持的文件类型
		const mime = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/webm'

		// 创建媒体流录制实例
		let mediaRecorder = new MediaRecorder(stream, {
			mimeType: mime
		})

		// 手动开始录屏
		mediaRecorder.start()

		// 缓存容器
		let chunks = []
		// 监听数据是否可用，该事件可用于获取录制的媒体资源
		mediaRecorder.addEventListener('dataavailable', (e) => {
			// 事件的 data 属性中提供了一个可用的 Blob 对象
			chunks.push(e.data)
		})

		// 监听停止录制
		mediaRecorder.addEventListener('stop', (e) => {
			let blob = new Blob(chunks, {
				type: chunks[0].type
			})
			// 将数据转成可访问的 url 地址
			let url = URL.createObjectURL(blob)
			// 模拟点击链接下载
			let a = document.createElement('a')
			a.href = url
			a.download = 'video.webm'
			a.click()
		})
	} catch (err) {
		// 捕获异常
		console.log('Error :>> ', err)
	}
}

/** ------------------ background 与 content-script 通信 ------------------ */
// 监听来自 content-script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message, sender, sendResponse)
	sendResponse('我是后台页，我已收到你的消息：' + JSON.stringify(message))
})

/** ------------------ 右键菜单 ------------------ */
/** 
	语法：
	chrome.contextMenus.create({
		type: 'normal'， // 类型，可选：["normal", "checkbox", "radio", "separator"]，默认 normal
		title: '菜单的名字', // 显示的文字，除非为“separator”类型否则此参数必需，如果类型为“selection”，可以使用%s显示选定的文本
		contexts: ['page'], // 上下文环境，可选：["all", "page", "frame", "selection", "link", "editable", "image", "video", "audio"]，默认page
		onclick: function(){}, // 单击时触发的方法
		parentId: 1, // 右键菜单项的父菜单项ID。指定父菜单项将会使此菜单项成为父菜单项的子菜单
		documentUrlPatterns: 'https://*.baidu.com/*' // 只在某些页面显示此右键菜单
	})
 */
chrome.contextMenus.create({
	title: "使用百度搜索：%s", // %s 表示选中的文字
	contexts: ['selection'], // 只有当选中文字是才会出现此右键菜单
	onclick: (params) => {
		// 在新的标签页打开百度
		chrome.tabs.create({
			url: 'https://www.baidu.com/s?&wd=' + encodeURI(params.selectionText)
		})
	}
})

/** ------------------ 地址栏关键字触发搜索建议 ------------------ */
// 用户输入关键字，触发建议
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
	if(text == 'fe') {
		suggest([
			{content: 'Vue' + text, description: '你要找 Vue 吗？'},
			{content: 'React' + text, description: '你要找 React 吗？'},
		])
	}
})
// 用户选中建议
chrome.omnibox.onInputEntered.addListener((text) => {
	var url = ''
	if(text.startsWith('Vue')) {
		url = 'https://v3.cn.vuejs.org/'
	}
	if(text.startsWith('React')) {
		url = 'https://zh-hans.reactjs.org/'
	}
	// 在带当前标签页打开
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		chrome.tabs.update(tabs[0].id, {url: url})
	})
})
