import { IBlogConfig } from "@/types";

const config: IBlogConfig = {
  mongoUrl: "mongodb://localhost:27017/iBlog2",
  githubClientID: "7dc9bb0e0fd4e9a92de9",
  githubClientSecret: "a3d9f400defcee58bef9ce90f5e8ddf3bb71c6bf",
  githubCallbackURL: "http://localhost:8000/auth/github/callback",
  githubAdmin: "eshengsky"
};

export default config;
