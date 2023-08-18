const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");
const MyWebSocket = require("./serveLib/webSocket");
const { messageCenter } = require("./serveLib/messageCenter");

let wsUrl = "ws://localhost:3000/ws/?name=' + angular";
let ws = null;

messageCenter.on("reconnect", reconnectWebSocket); //接收重连消息
// 创建一个Web Soket客户端
if (!ws) {
  connectWebSocket();
}

// console.log('ws', ws)

// if (ws && ws.readyState === 0) {
//   ws.send('connection')
// }

// 创建 socket
function createWebSocket(url) {
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("Connected to WebSocket");
  };

  socket.onmessage = (event) => {
    console.log("event", event);
    console.log("Received message:", event.data);
    if (!event.data) return;
    const data = JSON.parse(event.data) || {};
    if (data.type === "html") {
      fs.writeFileSync(path.join(__dirname, "./server.html"), data.data);
    }
    if (data.type === "model") {
      fs.writeFileSync(path.join(__dirname, "./server.model.ts"), data.data);
    }
  };

  socket.onclose = (event) => {
    console.log("Connection closed", event.code, event.reason);
  };
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return socket;
}

function reconnectWebSocket() {
  // 入口函数
  if (ws) {
    //防止多个websocket同时执行
    clear(ws);
  }
  connectWebSocket();
}

// 终止连接
function clear(myWebSocket) {
  myWebSocket.clear();
  myWebSocket = null;
}

function connectWebSocket() {
  ws = new MyWebSocket(wsUrl);
  ws.init(
    {
      //time：心跳时间间隔 timeout：心跳超时间隔 reconnect：断线重连时间，一般的，断线重连时间等于心跳时间间隔加断线重连时间（忽略超时等待）
      time: 10 * 1000,
      timeout: 1 * 1000,
      reconnect: 5 * 1000,
    },
    true
  );
}
