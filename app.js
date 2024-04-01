const express = require("express");
const userRoutes = require("./routers/user.router");
const ownerRoutes = require("./routers/owner.router");
const resortRoutes = require("./routers/resort.router");
const orderRoutes = require("./routers/order.router")
const app = express();
const cors = require("cors");
const AppError = require("./utils/AppError");

app.use(cors());

app.use(express.json());


app.use("/accessiableHeaven/api/v1/users", userRoutes);
app.use("/accessiableHeaven/api/v1/owners", ownerRoutes);
app.use("/accessiableHeaven/api/v1/resorts", resortRoutes);
app.use("/accessiableHeaven/api/v1/orders", orderRoutes);

app.get('/test', (req, res, next) => {
    res.send("hello")

});
app.use((error, req, res, next) => {
    console.log(error);
    return res.status(400).send({ msg: error.message });
});
app.all("*", (req, res, next) => {
    next(new AppError(404, "The requested resource not exist on this server"));
});

module.exports.app = app;