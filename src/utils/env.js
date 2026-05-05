import dotenv from "dotenv";
dotenv.config();

export const KB_ID = process.env.KB_ID;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;

export const checkEnv = () => {
  if (
    !PORT ||
    !KB_ID ||
    !AWS_REGION ||
    !AWS_ACCESS_KEY ||
    !AWS_SECRET_KEY ||
    !MONGO_URI
  ) {
    throw new Error("Missing environment variables");
  }
};
