# Chrome 扩展开发

Chrome 扩展（插件）是一个由HTML、CSS、JS、图片等资源组成的一个以 `.crx` 为后缀名的压缩包，本质上来就是 web 页面，用来增强 Chrome 浏览器的功能。

Chrome 扩展可以控制标签页、窗口、书签、网络请求、下载、自定义菜单以及各类事件监听等

Chrome 扩展包含以下几个核心概念：

+ `manifest.json`：清单文件
+ `content_script`：注入到页面的脚本
+ `popup`：弹出页
+ `background`：后台页
+ `inject`：注入的脚本

## 清单文件

每个 Chrome 扩展都必须包括一个 `manifest.json` 清单文件

```json
{
  // 清单文件版本，必要
  "manifest_version": 2,
  // 插件名称，必要
  "name": "extension_demo",
  // 插件版本，必要
  "version": "0.1.0",
  // 插件作者
  "author": "LeoCong",
  // 插件描述
  "description": "这是一个测试扩展程序",
  // 插件主页
  "homepage_url": "https://www.baidu.com",
  // 图标
  "icons": {
    "16": "img/icon_16.png",
    "48": "img/icon_48.png",
    "128": "img/icon_128.png"
  },
  // 后台页，可以指定 html，也可以指定 js 
  "background": {
    "page": "html/background.html"
    /* "scripts": ["js/background.js"] */
  },
  // 浏览器右上角图标设置，browser_action、page_action、app必须三选一
  "browser_action": {
    // 图标
    "default_icon": "img/icon_48.png",
    // 鼠标悬停时的标题
    "default_title": "学习扩展插件开发",
    // 点击图标弹出的页面
    "default_popup": "html/popup.html"
  },
  // 当某些特定页面打开才显示的图标
	/* "page_action":
	{
		"default_icon": "img/icon_48.png",
		"default_title": "我是pageAction",
		"default_popup": "popup.html"
	},*/
  // 注入页面的脚本，可以多个
  "content_scripts": [
    {
      // "<all_urls>" 表示匹配所有地址, "http://*.abc.com/*", "https://*/*"
      "matches": ["<all_urls>"],
      // 多个 js 按顺序注入
      "js": ["lib/jquery-3.5.1.min.js", "js/content.js"],
      // 注入自定义样式，注意不要影响全局样式
      "css": ["css/custom.css"],
      // 注入的时间点，document_start"、"document_end"、 "document_idle"（默认），表示页面空闲时
      "run_at": "document_start"
    }
  ],
  // 申请权限
  "permissions": [
    // 标签页
    "tabs", 
    // 右键菜单
    "contextMenus",
    // 通知
    "notifications",
    // web请求
    "webRequest",
    "webRequestBlocking",
    // 插件本地存储
		"storage",
    // 以通过executeScript或者insertCSS访问的网站
    "*://*/*", 
    "http://*/*", 
    "https://*/*"
  ],
  // 普通页面可以访问的插件资源列表，如果不设置无法直接访问
  "web_accessible_resources": [
    "js/inject.js"
  ]
  // 重写浏览器默认页面
  /* "chrome_url_overrides": {
    // 新的标签页
    "newtab": "html/newtab.html"
  }, */
  // devtools页面
	/* "devtools_page": "html/devtools.html", */
  // 默认语言
	/* "default_locale": "zh_CN" */
}
```

## 学习资料

+ [Chrome扩展开发官方文档](https://developer.chrome.com/extensions)

+ [360安全浏览器开发文档](http://open.se.360.cn/open/extension_dev/overview.html)

+ [Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)

+ [Chrome扩展开发极客系列博客](https://www.cnblogs.com/champagne/p/?page=2)