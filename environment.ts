import dotenv from "dotenv";
import path from "path";
import {getDirname} from "./helpers/directory.ts";

const envPath = path.join(getDirname(import.meta.url), ".env");

dotenv.config({
  path: envPath,
});
