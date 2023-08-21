const mongoose = require("./mongoose");

const Schema = mongoose.Schema;
const settingsSchema = new Schema({
  id: String,
  bodyJsonConfig: String,
  headColSpan: String,
  headField: String,
  headName: String,
  headRowSpan: String,
  childHeadField: String,
  childHeadName: String,
  childHeadRowSpan: String,
  childHeadColSpan: String,
  queryField: String,
  queryIsRequire: String,
  queryName: String,
  queryType: String,
  settingsName: String,
  configDesc: String,
  create_time: String,
  update_time: String,
});

module.exports = mongoose.model("settings_table", settingsSchema);
