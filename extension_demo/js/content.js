/*
 * @Author: LeoCong
 * @Date: 2021-07-12 22:10:23
 * @LastEditors: LeoCode
 * @LastEditTime: 2021-12-16 00:08:47
 * @Description: 向页面注入的脚本
 * content-scripts 和原始页面共享DOM，但是不共享 JS，无法访问页面中的JS
 * 如要访问页面 JS（例如某个 JS 变量），只能通过 inject.js 来实现
 * content-scripts不能访问绝大部分chrome.xxx.api，除了一下四种：
 * chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
 * chrome.i18n
 * chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
 * chrome.storage
 */

// 给B站加个黑夜模式
window.onload = (e) => {
  // 匹配 B 站
  if (/bilibili/.test(window.location.host)) {
    let darkMode = $('<div>黑夜模式</div>')
    darkMode.css({
      color: '#00a1d6',
      cursor: 'pointer',
      position: 'absolute',
      top: '60px',
      left: '20px',
      'z-index': 999,
    })

    darkMode.click(() => {
      document.body.style.backgroundColor = '#111'
    })

    // $('#internationalHeader').append(darkMode)
  }
}

/** ------------------ 短连接与长连接 ------------------ */
// 监听来自 popup 或者 background 短连接的消息（短连接）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log(message, sender, sendResponse)
  // 根据自定义的消息，做不同的处理
  if (message.cmd === 'change_bg_color') {
    document.body.style.backgroundColor = message.val
  }
  // content-script 收到消息的回调
	sendResponse(`我是 content-script，我收到了你发的消息`)
})

// 监听长连接消息
chrome.runtime.onConnect.addListener((port) => {
	console.log('通道：', port)
  // 判断是哪个通道
	if(port.name == 'test-connect') {
    // 通过通道监听消息
		port.onMessage.addListener((msg) =>{
      console.log('收到长连接消息：', msg)
      if (msg.question === '请问你是谁？') {
        // 通过通道发送消息
        port.postMessage({answer: '我是 content-script！'})
      } else {
        port.postMessage({answer: '你好！'})
      }
		})
	}
})

/** ------------------ content-script 发送消息给后台 ------------------ */
// 在标签页控制台手动调用该方法
function sendMessageToBackground() {
  // 发送消息给后台
	chrome.runtime.sendMessage({msg: '你好，我是 content-script ，我主动发消息给后台！'}, (response) => {
		console.log(`收到来自后台的回复：${response}`)
	})
}

/** ------------------ 向页面注入自定义js ------------------ */
function injectCustomJs() {
	var temp = document.createElement('script')
	temp.setAttribute('type', 'text/javascript')
	// 获得的地址类似：chrome-extension://baecbaibfdnobcnaaipkmgjaocpcbjeh/js/inject.js
	temp.src = chrome.extension.getURL('js/inject.js');
	temp.onload = function(){
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp)
}
// 注意，content_scripts 必须设置了 run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
  // 注入js
  injectCustomJs()
})

/** ------------------ content-script 与 inject-script 通信 ------------------ */
// 监听 message 事件
window.addEventListener("message", (message) => {
  if (message.data.cmd === 'inject_post_message') {
    console.log('inject 发送的信息为：', message.data)
  }
}, false)
