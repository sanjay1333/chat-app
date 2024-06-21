const mongoose = require("mongoose");

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDatabase = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/chatApp",
      connectionParams
    );
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  connectDatabase,
};
