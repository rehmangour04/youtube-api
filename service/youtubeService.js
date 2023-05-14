/** @format */

"use strict";

const axios = require("axios");
const querystring = require("querystring");
const {
  smartSearchVideo,
  insertMany,
  getLastVideoTime,
} = require("../models/video");
const config = require("../config.js");

const searchVideo = async (video_title) => {
  let result = await smartSearchVideo(video_title);
  console.log(
    "Result for video title: ",
    video_title,
    " is : ",
    JSON.stringify(result, null, 4)
  );
  return result;
};

const startVideoMining = async () => {
  let lastVideoTime = await _getLastFetchedRecordTime();
  _getMinedVideoData(lastVideoTime);
};

const _getLastFetchedRecordTime = async () => {
  let lastVideoTime = null;
  let lastVideoTimeObj = await getLastVideoTime();
  console.log(lastVideoTimeObj.data);
  if (lastVideoTimeObj && lastVideoTimeObj.data) {
    lastVideoTime = lastVideoTimeObj.data.publishTime;
  }
  return lastVideoTime || config.youtube.PUBLISHED_AFTER;
};

const _getMinedVideoData = (lastVideoTime) => {
  // GET parameters
  const parameters = {
    part: config.youtube.PART,
    key: config.youtube.KEY,
    q: config.youtube.SEARCH_QUERY,
    type: config.youtube.TYPE,
    order: config.youtube.ORDER,
    publishedAfter: lastVideoTime,
    maxResults: config.youtube.MAX_RESULTS,
  };
  const get_request_args = querystring.stringify(parameters);

  let URL = config.youtube.URL_END_POINT + "?" + get_request_args;

  axios
    .get(URL)
    .then(function (response) {
      _saveMinedVideoDetails(response, config.youtube.SEARCH_QUERY);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const _saveMinedVideoDetails = (response, video_title) => {
  const docsArray = [];
  response.data.items.forEach(function (element) {
    const obj = {};
    obj.video_title = video_title;
    obj.data = element.snippet;
    delete obj.data.channelTitle;
    delete obj.data.liveBroadcastContent;
    docsArray.push(obj);
  });
  console.log("Saving Video Data: ", JSON.stringify(docsArray, null, 4));
  insertMany(docsArray);
};

module.exports = {
  searchVideo,
  startVideoMining,
};
