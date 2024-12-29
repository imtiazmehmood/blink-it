import "dotenv/config";
import { Admin } from "../models/index.js";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import bcrypt from "bcryptjs";

const MongoDBStore = ConnectMongoDBSession(fastifySession);
export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "session",
});

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const user = await Admin.findOne({ email });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return { email, password };
    } else {
      return null;
    }
  }

  return null;
};

export const PORT = process.env.PORT;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
