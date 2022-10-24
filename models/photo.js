const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    albumId: "number",
    id: "number",
    title: "string",
    url: "string",
    thumbnailUrl: "string"
});

module.exports = mongoose.model('Photo', photoSchema);
