const { Schema, model } = require("mongoose");

const ownerSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true
    }
});
ownerSchema.pre("save", function (next) {
    this.id = String(this._id);
    next();
});

const Owner = model("Owner", ownerSchema);
module.exports.Owner = Owner;