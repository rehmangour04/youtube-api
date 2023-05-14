'use strict'

const
    http   = require('http'),
    config = require('./config.js'),
    cron   = require('./cron-job'),
    app    = require('./app');


try {
    console.log("Staring cron job");
    cron.startVideoMiningJob();
    http.createServer(app).listen(process.env.PORT || config.server.PORT);
    console.log(`App is listening on http://localhost:${config.server.PORT}`);
} catch (err) {
    console.log('Error happened during server start', err);
    throw err;
}

