const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const MarkerSchema = new Schema({
    journeyId: String,
    title: String,
    imageId: String,
    place: String,
    description: String,
    date: Date,
    longitude: Number,
    latitude: Number
});

module.exports = model("Marker", MarkerSchema);