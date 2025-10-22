import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default ConnectDB;
