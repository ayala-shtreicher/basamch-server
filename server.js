const { app } = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURL = process.env.MONGO_URL;

const connectToDB = () => {
  mongoose
    .connect(mongoURL)
    .then((con) => {
      console.log(`connected to database: ${mongoURL}`);
    })
    .catch((error) => {
      console.error("Error to connect to database");
      console.error(error);
    });
};

connectToDB();
const PORT = process.env.PORT || 1200;
app.listen(PORT, () => {
  console.log(`the server is running on port: ${PORT}`);
});