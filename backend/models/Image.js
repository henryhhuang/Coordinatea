const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

//todo make two image schemas one for journeys, one for markers
const ImageSchema = new Schema({
    journeyId: String,
    markerId: String,
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

module.exports = model("Image", ImageSchema);

