const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const JourneySchema = new Schema({
    username: String,
    title: String,
    imageId: String,
    description: String,
    fromDate: Date,
    toDate: Date,
    published: Boolean,
    suggestionsEnabled: Boolean
});

module.exports = model("Journey", JourneySchema);