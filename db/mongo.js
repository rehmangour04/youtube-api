/** @format */

"use strict";
const mongoose = require("mongoose");
const config = require("../config.js");
const vault = mongoose.createConnection(config.db_credentials.MONGO_URI);
module.exports = {
  vault,
  mongoose,
};
