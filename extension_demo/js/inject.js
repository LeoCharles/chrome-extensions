/*
 * @Author: LeoCong
 * @Date: 2021-07-13 00:02:26
 * @LastEditors: LeoCong
 * @LastEditTime: 2021-08-23 01:39:48
 * @Description: 通过 DOM 操作的方式向页面注入的一种JS，需要显式的在 manifest 声明
 * 常见的场景：在页面中添加一个按钮，点击触发事件 postMessage 给 content-script，在 content-script中 调用扩展API
 * injected-script 无法直接和 popup 通信，必须借助 content-script作为中间人
 * 权限对比：
 * inject-script:  不能访问任何扩展API，但可访问页面 DOM 和 js，不可以直接跨域
 * content-script: 只能访问 extension、runtime 等部分扩展API，可以访问页面 DOM，不能访问 js，不可以直接跨域
 * popup.js:  除了 devtools 系列，可以访问绝大部分扩展API，不能直接访问页面 DOM 和 js，可以直接跨域
 * background.js:  除了 devtools 系列，可以访问绝大部分扩展API，不能直接访问页面 DOM 和 js，可以直接跨域
 * devtools.js:  只能访问 devtools、extension、runtime 等部分扩展API，可以直接访问页面 DOM 和 js，不能可以直接跨域
 */

/** ------------------ inject-script 与 content-script 通信  ------------------ */
// 发送消息到 content-script
function sendMessageToContentByPostMessage(msg) {
  console.log('inject.js post message to content-script ...');
  //  通过 window.postMessage 发送消息，content-script 通过 window.addEventListener*('message') 接收消息
	window.postMessage({cmd: 'inject_post_message', msg: msg}, '*');
}

// 手动添加一个按钮，点击发送消息自定义信息给 content-script
var injectButton = document.createElement('button')
injectButton.innerText = 'test inject'
injectButton.onclick = () => {
  sendMessageToContentByPostMessage('点击 inject 按钮，发送消息')
}
// 隐藏此按钮，防止页面污染，可以在控制台手动调用
// document.body.appendChild(injectButton)