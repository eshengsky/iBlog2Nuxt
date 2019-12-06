import { IBlogConfig } from "@/types";
import mongoose from "mongoose";

const uniqueId = new mongoose.Types.ObjectId().toHexString();
const config: IBlogConfig = {
  mongoUrl: "mongodb://localhost:27017/iBlog2",
  jwtSecret: uniqueId
};

export default config;
