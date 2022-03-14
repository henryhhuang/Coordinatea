const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
    username: String,
    createdAt: String,
    content: String,
    //root: String
});

module.exports = model("Comment", CommentSchema);