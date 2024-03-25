// const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const moment = require("moment");
const WebSocketServer = require("./webSocketServer");
const settingModel = require("./db/schema");
const port = 3000; //端口
const pathname = "/ws/"; //访问路径
const clientKey = "name"; //客户端标识符
const server = http.createServer();

const handlebars = require("handlebars");

app.use(bodyParser.json());

setHandlerBarsHelper();

const webSocketServer = new WebSocketServer({ noServer: true }, { clientKey });
const initSocket = ({ name, req, socket, head }) => {
  console.log('name', name)
  webSocketServer.handleUpgrade(req, socket, head, (ws) => {
    ws[clientKey] = name; //添加索引，方便在客户端列表查询某个socket连接
    webSocketServer.addClient(ws);
    webSocketServer.ws = ws;
  });
};

server.on("upgrade", (req, socket, head) => {
  console.log('req', req)
  //通过http.server过滤数据
  const url = new URL(req.url, `http://${req.headers.host}`);
  const name = url.searchParams.get(clientKey); //获取连接标识
  if (!checkUrl(url.pathname, pathname)) {
    //未按标准
    socket.write("未按照标准访问");
    socket.destroy();
    return;
  }
  initSocket({ name, req, socket, head });
});

app.post("/setTableParams", (req, res) => {
  // console.log("req", req.body);
  let { queryFormData = [], headData = [], bodyJsonConfig } = req.body;
  // bodyJsonConfig = JSON.parse(bodyJsonConfig);
  // console.log("typeof bodyJsonConfig", typeof bodyJsonConfig);
  generateMockData(bodyJsonConfig, headData);
  if (headData[0] && headData[0].children && headData[0].children.length > 0) {
    const nextRow = headData[0].children;
    headData = [headData, nextRow];
  } else if (headData.length > 0) {
    headData = [headData];
  }
  const DateTypeIdx = queryFormData.findIndex((i) => i.type === "date");
  if (DateTypeIdx > -1) {
    queryFormData = queryFormData.map((item, idx) => {
      // 日期字段
      if (item.type === "date") {
        // queryFormData.push({...item, field: `${item.field}Begin`});
        // queryFormData.push({...item, field: `${item.field}End`});
        item.field = [`${item.field}Begin`, `${item.field}End`];
      }
      item = {...item, isRequire: item.isRequire == '1'}
      return item;
    });
    // queryFormData.splice(DateTypeIdx, 1);
  }
  const templateUrl = path.join(__dirname, "template/");
  const templateHtml = fs.readFileSync(
    path.join(templateUrl, "index.html.hbs"),
    "utf-8"
  );
  const templateExecTs = fs.readFileSync(
    path.join(templateUrl, "index.component.ts.hbs"),
    "utf-8"
  );
  const templateModel = fs.readFileSync(
    path.join(templateUrl, "index.model.ts.hbs"),
    "utf-8"
  );
  const html = handlebars.compile(templateHtml)({
    queryFormData,
    headData,
    bodyJsonConfig,
  });
  const execTs = handlebars.compile(templateExecTs)({
    queryFormData,
    headData,
    bodyJsonConfig,
    arr: [1,2,3]
  });
  const model = handlebars.compile(templateModel)({ queryFormData, headData });
  if (webSocketServer && webSocketServer.ws) {
    webSocketServer.send(webSocketServer.ws, { ModeCode: "html", data: html });
    webSocketServer.send(webSocketServer.ws, {
      ModeCode: "execTs",
      data: execTs,
    });
    webSocketServer.send(webSocketServer.ws, {
      ModeCode: "model",
      data: model,
    });
    res.json({ code: 0, msg: "success" });
  } else {
    res.json({ code: 400, msg: "websocket 失去连接" });
  }
});

app.get("/getMockData", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "mock/mock.json"), "utf-8");
  res.json({ code: 0, msg: "success", data: JSON.parse(data) });
});

app.post("/getSettingList", async (req, res) => {
  try {
    console.log('req.body', req.body)
    const { settingsName = '' } = req.body
    const regex = new RegExp(settingsName, 'i'); // 使用不区分大小写的模式
    const query = { settingsName: { $regex: regex } };
    const data = await settingModel.find(query);
    // console.log("data", data);
    res.json({ code: 0, msg: "success", data: data });
  } catch (err) {
    console.log(err);
  }
});

app.get("/getSetting/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await settingModel.findById(id);
    res.json({ code: 0, msg: "success", data: data });
  } catch (error) {
    res.json({ code: 400, msg: "error", data: error });
  }
});

app.post("/setSettings", async (req, res) => {
  try {
    const { id, ...rest } = req.body;
    const current_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    let settings = {
      ...rest,
      bodyJsonConfig: req.body.bodyJsonConfig
        ? JSON.stringify(req.body.bodyJsonConfig)
        : "",
      create_time: current_time,
    };
    if (id) {
      settings = {
        ...settings,
        update_time: current_time,
      };
      await settingModel.findByIdAndUpdate(id, settings);
      res.json({ code: 0, msg: "success" });
    } else {
      settings = {
        ...settings,
        create_time: current_time,
      };
      await settingModel.insertMany(settings);
      res.json({ code: 0, msg: "success" });
    }
  } catch (err) {
    console.log(err);
    res.json({ code: 400, msg: "error" });
  }
});

app.get("/delSettingByIds", async (req, res) => {
  const ids = req.query.id.split(',');
  try {
    await settingModel.deleteMany({_id: {$in: ids}});
    res.json({ code: 0, msg: "success" });
  } catch (err) {
    res.json({ code: 400, msg: "error" });
  }
});

app.listen(3881, () => {
  console.log(`接口 服务开启 端口号：${3881}`);
});

server.listen(port, () => {
  console.log(`websocket 服务开启 端口号：${port}`);
});

//验证url标准
function checkUrl(url, key) {
  //判断url是否包含key
  return -~url.indexOf(key);
}

function generateMockData(bodyJsonConfig, headData) {
  const mockData = setMockData(bodyJsonConfig, headData);
  fs.writeFileSync(
    path.join(__dirname, "mock/mock.json"),
    JSON.stringify(mockData)
  );
}

// 注册自定义helper
function setHandlerBarsHelper() {
  handlebars.registerHelper("isEqual", function (variable, value, options) {
    if (variable === value) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
  handlebars.registerHelper(
    "isMultipleSelect",
    function (variable, value, options) {
      if (variable === value) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  );
  handlebars.registerHelper(
    "surroundWithCurlyBraces",
    function (value, value1) {
      // console.log("value1", value1);
      var result = "{{" + "item." + value + "}}";
      if (
        typeof value1 !== "undefined" &&
        value1 !== null &&
        typeof value1 === "string"
      ) {
        result = "{{" + value1 + "." + value + "}}";
      }
      return new handlebars.SafeString(result);
    }
  );

  handlebars.registerHelper("isArray", function (value, options) {
    if (Array.isArray(value)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
}

// 生成mock数据
function setMockData(bodyJsonConfig = [], headData = []) {
  let mockData = [];
  if (bodyJsonConfig && bodyJsonConfig.length > 0) {
    mockData = setConfigList(bodyJsonConfig);
  } else {
    mockData = setNormalList(headData);
  }
  return mockData;
}

function recursive(list, obj, name) {
  console.log("name", name);
  console.log("obj", obj);
  let maps = {}; //
  list.forEach((item, index) => {
    obj[name] = [];
    // obj[name][index] = {};
    // obj[name].push(item);
    console.log("item", item);
    item.fields.forEach((item1) => {
      // obj[name][index][item1] = `${item1}123`;
      maps[item1] = `${item1}123`;
    });
    // obj[name].push(
    //   maps
    // )
    Array.from({ length: 5 }).forEach(() => {
      obj[name].push(maps);
    });
    if (item.list) {
      recursive(item.list, obj[name][index], item.dataName);
    }
  });
  return obj;
}

function setConfigList(configList) {
  const obj = {};
  configList.forEach((item) => {
    item.fields.forEach((i, idx) => {
      obj[i] = `${i}${idx}`;
    });
    if (item.list) {
      recursive(item.list, obj, item.dataName);
    }
  });
  return Array.from({ length: 10 }).map(() => ({ ...obj }));
}

function setNormalList(normalList) {
  const obj = {};
  let list = (normalList[0] && normalList[0].children) || [];
  normalList.forEach((i, idx) => {
    obj[i.field] = `${i.name}${idx}`;
  });
  return Array.from({ length: 10 }).map(() => ({ ...obj, list: list }));
}
