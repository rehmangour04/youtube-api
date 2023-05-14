'use strict';
const cron = require('node-cron');
const config = require('./config.js');
const YouTubeService = require('./service/youtubeService');

const startVideoMiningJob = () => {
    cron.schedule(config.cron_jobs.VIDEO_MINING_INTERVAL, () => {
        YouTubeService.startVideoMining();
    });
}


module.exports = {
    startVideoMiningJob
}
