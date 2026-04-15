const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile: String,
    role: {
        type: String,
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);