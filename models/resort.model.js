const { string } = require("joi");
const { Schema, model, default: mongoose } = require("mongoose");

const resortSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    placeId: {
        type: String,
        required: false
    },
    accessibility: {
        type: String,
        enum: ["visual", "hearing", "motor", "mentalHealth"],
        required: true
    },
    description: {
        type: String,
        required: false
    },
    images: {
        type: [],
        required: false
    },
    price: {
        type: Number,
        required: true

    },
    category: {
        type: String,
        enum: ["vila", "b&b", "hotelRoom"],
        required: true
    },
    numBed: {
        type: Number,
        required: true
    },
    events: {
        type: [],
        required: false
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: "Owner",
        required: true
    }
})
resortSchema.pre("save", function (next) {
    this.id = String(this._id);
    next();
});

const Resort = model("Resort", resortSchema);
module.exports.Resort = Resort;