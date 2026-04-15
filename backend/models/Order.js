const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    totalAmount: Number,
    name: String,
    email: String,
    mobile: String,
    address: String,
    city: String,
    pincode: String,
    paymentMethod: String,
    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("Order", OrderSchema);