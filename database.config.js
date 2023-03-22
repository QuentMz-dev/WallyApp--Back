import mongoose from "mongoose";

// const uri = "mongodb://localhost:27017";
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

const initDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    await new mongoose.connect(uri, { dbName: "wallyDB" });
    console.log("Database connected");
  } catch (e) {
    console.log("oh problem : ", e.message);
  }
};

export default initDb;
