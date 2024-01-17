import express, {Request, Response} from "express";

export function signInRedirect(mode: "guest" | "user") {
  return function (req: Request, res: Response, next: express.NextFunction) {
    if (mode === "user" && !req.user) {
      return res.redirect("/");
    } else if (mode === "guest" && req.user) {
      return res.redirect("/dashboard");
    }
    next();
  };
}
