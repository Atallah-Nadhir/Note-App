const mongoose = require("mongoose");
const config = require("config");
const db =
  "mongodb+srv://admin:nadiroo_1995@cluster01.pyhow.mongodb.net/ckam-db?retryWrites=true&w=majority";
// config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
