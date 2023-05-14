'use strict';

const db = require('../db/mongo').vault;
const mongoose = require('../db/mongo').mongoose;
const schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    video_title: {
        type: String,
        required: true
    },
    video_details: schema.Types.Mixed,
    createdAt: { type: Date, required: true, default: Date.now }
}, {strict: false});


let Videos = db.model('videos', videoSchema);

const insert = (doc) => {
    return Videos.create(doc);
}

const insertMany = (docsArray) => {
    return Videos.insertMany(docsArray);
}

const getLastVideoTime = () => {
    return Videos.findOne().sort({'data.publishTime': -1}).limit(1).select({'data.publishTime': 1}).lean();
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const smartSearchVideo = (video_title) => {
    const regex = new RegExp(escapeRegex(video_title), 'gi');
    return Videos.find({'data.title': regex}).lean();
};

module.exports = {
    insert,
    smartSearchVideo,
    insertMany,
    getLastVideoTime
};
