const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const SuggestionSchema = new Schema({
    markerId: String,
    imageId: String,
    description: String,
    type: String,
    longitude: Number,
    latitude: Number,
    username: String
});

module.exports = model("Suggestion", SuggestionSchema);