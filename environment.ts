import dotenv from "dotenv";
import path from "path";
import * as console from "console";

const envPath = path.join(import.meta.dirname, ".env");


dotenv.config({
  path: envPath,
});
