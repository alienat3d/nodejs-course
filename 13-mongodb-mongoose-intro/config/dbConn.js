// 1.3.2 So, we'll need to import the "mongoose" library here, and then we'll create an async function, where we use "try...catch" constructions for catching errors if they'll occur. Then, inside the "try" section we'll be trying to connect to MongoDB with "Mongoose" and it's method "connect" that accepts two parameters: URI to the database and options. The URI we have already added as a secret string into ".env" file, so we'll use the "process.env" to extract that from there. And then there is an object with options and what we need to do is pass in a couple of options that will just prevent warnings that we would get from MongoDB otherwise: 1) "useUnifiedTopology" and 2) "useNewUrlParser".
// (Go to [13-mongodb-mongoose-intro/server.js])
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;