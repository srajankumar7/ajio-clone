const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: String,
    name: String,
    price: Number,
    image: String,
    quantity:
    {
        type: Number,
        default: 1
    }
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;