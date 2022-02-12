import mongoose from "mongoose";

export function setupMongoose() {
  mongoose.Promise = global.Promise;

  mongoose.connect(process.env.MONGO_CONNECTION_STRING);
}
