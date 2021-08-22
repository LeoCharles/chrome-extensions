/*
 * @Author: LeoCong
 * @Date: 2021-07-08 00:24:04
 * @LastEditors: LeoCong
 * @LastEditTime: 2021-08-23 01:50:49
 * @Description: 点击图标时的弹出页
 * popup页面的生命周期一般很短，需要长时间运行的代码不要写在popup里面
 * 在权限上和 background 类似，它们之间最大的不同是生命周期的不同
 * popup 中可以直接通过 chrome.extension.getBackgroundPage() 获取 background 的 window 对象
 */

/** ------------------ popup 操作后台页 ------------------ */
// 打开后台页
$('#open_background').click(e => {
  window.open(chrome.extension.getURL('/html/background.html'))
})

// 调用后台页js
$('#invoke_background_js').click(e => {
  var bg = chrome.extension.getBackgroundPage()
  // popup 可以直接调用 background 中的方法
  bg.callFromPopup()
})

// 获取后台页DOM
$('#get_background_dom').click(e => {
	var bg = chrome.extension.getBackgroundPage()
  // popup 也可以直接获取 background 的 DOM
  alert(bg.document.body.innerHTML)
});

// 设置后台页标题
$('#set_background_title').click(e => {
	var title = prompt('请输入后台页的新标题：', '这是新标题');
	var bg = chrome.extension.getBackgroundPage();
	bg.document.title = title
	alert('修改成功！')
});

/** ------------------ popup 操作窗口 ------------------ */
// 获取当前窗口id
$('#get_current_window').click(() => {
  chrome.windows.getCurrent({}, (currentWindow) => {
		alert(currentWindow.id)
	});
})

// 打开新窗口
$('#open_new_window').click(() => {
	chrome.windows.create({url: 'https://www.baidu.com'})
});

// 最大化窗口
$('#max_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		chrome.windows.update(currentWindow.id, {
      state: 'maximized' // 'minimized'：最小化, 'maximized'：最大化， 'fullscreen'：全屏 
    })
	})
})

// 自定义窗体大小
$('#custom_window_size').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		var startLeft = 10
		chrome.windows.update(currentWindow.id, {
			left: startLeft * 10,
			top: 100,
			width: 800,
			height: 600
		});
		var inteval = setInterval(() => {
			if(startLeft >= 40) clearInterval(inteval);
			chrome.windows.update(currentWindow.id, {
        left: (++startLeft) * 10
      });
		}, 50)
	})
})

// 关闭当前窗口全部标签页
$('#close_current_window').click(() => {
	chrome.windows.getCurrent({}, (currentWindow) => {
		chrome.windows.remove(currentWindow.id)
	})
})

/** ------------------ popup 操作标签页 ------------------ */
// 获取当前标签页ID
$('#get_current_tab').click(() => {
  // 获取当前标签页ID, getSelected()已弃用
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    var tab = tabs[0]
    alert(tab.id)
  })
})

// 新标签打开网页
$('#open_url_new_tab').click(() => {
	chrome.tabs.create({url: 'https://www.baidu.com'})
});

// 当前标签页打开网页
$('#open_url_current_tab').click(() => {
  // 获取当前标签页ID, getSelected()已弃用
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    var tab = tabs[0]
    chrome.tabs.update(tab.id, {url: 'http://www.baidu.com'})
  })
})

// 切换到第一个标签页
$('#highlight_tab').click(() => {
	chrome.tabs.highlight({tabs: 0})
})

/** ------------------ popup 与 content_script 通信 ------------------ */
// popup 和 content-script 建立短连接
$('#send_message_to_content_script').click(() => {
  // 先获取当前 tab
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    var tab = tabs[0]
    // 短连接：通过 chrome.tabs.sendMessage 发送消息，通过 chrome.runtime.onMessage.addListener 接收消息
    chrome.tabs.sendMessage(tab.id, {
      cmd: 'test_send_message', // 可以自定义参数，用于在content-script区分不同的操作
      msg: '我是popup，通过 chrome.tabs.sendMessage 发送消息'
    }, res => {
      if (res) {
        alert(`收到来自content-script的回复：${JSON.stringify(res)}`)
      }
    })
  })
})

// popup 与 content-script 建立长连接
$('#connect_to_content_script').click(() => {
  // 先获取当前 tab
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    var tab = tabs[0]
    // 建立连接获取通道
    var port = chrome.tabs.connect(tab.id, {name: 'test-connect'})
    // 通过通道发送消息
    port.postMessage({question: '请问你是谁？'})
    // 通过通道接收消息
    port.onMessage.addListener((msg) => {
      console.log('收到长连接消息：', msg)
      if (msg.answer && msg.answer.startsWith('我是')) {
        // 再次发送消息
        port.postMessage({question: '你好，你好！'})
      }
      alert(`收到长连接返回的消息：${JSON.stringify(msg)}`)
    })
  })
})

/** ------------------ popup 操作页面 DOM ------------------ */
// 在 background 和 popup 中无法直接访问页面 DOM，但可以通过 executeScript 来执行脚本，从而实现操作面 DOM
$('#update_bg_execute_script').click(() => {
  // 先获取当前 tab
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // executeScript 不能直接访问页面的js
    chrome.tabs.executeScript(tabs[0].id, {
      code: 'document.body.style.backgroundColor="#C7EDCC"'
    })
  })
})

// 通过 sendMessage 向页面发送消息，content-script 执行特定的回调。从而实现操作页面DOM
$('#update_bg_send_message').click(() => {
  // 先获取当前 tab
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // executeScript 不能直接访问页面的js
    chrome.tabs.sendMessage(tabs[0].id, {
      cmd: 'change_bg_color', // 可以自定义参数，用于在content-script区分不同的操作
      val: '#C7EDCC'
    })
  })
})

/** ------------------ 其他操作 ------------------ */
// 显示徽章
$('#show_badge').click(() => {
	chrome.browserAction.setBadgeText({text: 'New'})
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})
})

// 隐藏徽章
$('#hide_badge').click(() => {
	chrome.browserAction.setBadgeText({text: ''})
	chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]})
})

// cookie
$('#get_cookie').click(() => {
	chrome.cookies.getAll({
    url: 'https://www.baidu.com'
  }, cookies => {
    alert(cookies)
  })
})