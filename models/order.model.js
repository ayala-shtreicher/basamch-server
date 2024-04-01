const { string } = require("joi");
const { Schema, model, default: mongoose } = require("mongoose");

const orderSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    dateOrder:{
        type:Date,
        required:true
    },
    dateStart:{
        type:Date,
        required:true
    },
    dateEnd:{
        type:Date,
        required:true
    },
    sumOrder:{
        type:Number,
        required:true
    },
    resortId: {
        type: mongoose.Types.ObjectId,
        ref: "Resort",
        required: true
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
});
orderSchema.pre("save", function (next) {
    this.id = String(this._id);
    next();
});

const Order = model("Order", orderSchema);
module.exports.Order = Order;