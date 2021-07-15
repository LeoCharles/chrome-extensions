/*
 * @Author: LeoCong
 * @Date: 2021-07-12 22:10:23
 * @LastEditors: LeoCong
 * @LastEditTime: 2021-07-15 23:40:40
 * @Description: 向页面注入的脚本
 * content-scripts 和原始页面共享DOM，但是不共享 JS，无法访问页面中的JS
 * 如要访问页面 JS（例如某个 JS 变量），只能通过 inject.js 来实现
 * content-scripts不能访问绝大部分chrome.xxx.api，除了一下四种：
 * chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
 * chrome.i18n
 * chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
 * chrome.storage
 */
