/** @format */

"use strict";
const express = require("express"),
  bodyParser = require("body-parser"),
  YouTubeService = require("./service/youtubeService"),
  app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/health-check", (req, res) => {
    res.send("Working Service");
});

app.get("/searchVideo", async (req, res) => {
  try {
    let video_title = req.query.video_title;
    const result = await YouTubeService.searchVideo(video_title);
    return res.status(200).send({ success: true, data: result });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, msg: "Failiure", data: err });
  }
});

module.exports = app;
