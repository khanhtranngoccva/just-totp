import express from "express";
import * as path from "path";
import {z} from "zod";
import {EnvironmentError} from "../helpers/errors.js";
import * as process from "process";
import enablePassportAuth from "../configuration/passport/index.ts";

const app = express();
// Doing this might be vulnerable to XSRF?
app.use(express.urlencoded());
app.use(express.json());
app.use("/static", express.static(path.join(import.meta.dirname, "..", "public")));
app.set("view engine", "ejs");
enablePassportAuth(app);

// Zod library - ensures data is valid.
let port: number;
try {
  port = z.coerce.number().positive().parse(process.env.PORT);
} catch (e) {
  throw new EnvironmentError("PORT");
}
app.listen(port, () => {
  console.log(`Successfully bound to port ${port}`);
});

export default app;
