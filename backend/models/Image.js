const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

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

