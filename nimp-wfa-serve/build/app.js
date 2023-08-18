/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("var WebSocket = __webpack_require__(/*! ws */ \"ws\");\nvar p = new Promise(function (resolve) {\n  console.log('promise');\n  resolve('promise');\n});\np.then(function () {\n  console.log('then');\n});\n// 创建 WebSocket 服务器\nconsole.log('WebSocket', WebSocket.Server);\nvar wss = new WebSocket.Server({\n  port: 3000\n});\n// console.log(\"wss\", wss);\n\n// 监听连接事件\nwss.on(\"connection\", function (ws) {\n  console.log(\"connection\");\n  // 监听消息事件\n  ws.on(\"message\", function (message) {\n    console.log(\"Received:\", message);\n\n    // 发送消息到客户端\n    ws.send(\"Server received: \" + message);\n  });\n  ws.send(\"Hello, client\");\n\n  // 当连接关闭时执行\n  ws.on(\"close\", function () {\n    console.log(\"Client disconnected\");\n  });\n});\n\n//# sourceURL=webpack://nimp-wfa-serve/./src/index.js?");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("ws");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;