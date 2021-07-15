/*
 * @Author: LeoCong
 * @Date: 2021-07-08 00:24:04
 * @LastEditors: LeoCong
 * @LastEditTime: 2021-07-15 23:17:08
 * @Description: 点击图标时的弹出页
 * popup页面的生命周期一般很短，需要长时间运行的代码不要写在popup里面
 * 在权限上和 background 类似，它们之间最大的不同是生命周期的不同
 * popup 中可以直接通过 chrome.extension.getBackgroundPage() 获取 background 的 window 对象
 */



