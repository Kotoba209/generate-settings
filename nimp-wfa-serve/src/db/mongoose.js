const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/crud_settings";
const DB_NAME = "crud_settings";
const TABLE_NAME = "settings_table";

mongoose.connect(url); //连接本地数据库

const db = mongoose.connection;

db.on("error", function callback() {
  //监听是否有异常
  console.log("Connection error");
});

db.once("open", function callback() {
  //监听一次打开
  console.log("open!");
});

db.on("connected", () => {
  console.log("MongoDB connected success");
});

db.on("disconnected", () => {
  console.log("MongoDB connected disconnected.");
});

module.exports = mongoose; //导出连接对象
