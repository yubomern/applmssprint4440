const mongoose = require(`mongoose`);
const port = 27017;

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL || "mongodb://localhost:27017/lmsuser", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
    })
    .then((data) => {
      console.log(
        `mongoDB connected with server on : http://${data.connection.host}:${port}`
      );
    })
    .catch((error) => {
      console.log("mongoDB coonection failed: ", error.message);
    });
};

module.exports = connectDatabase;
