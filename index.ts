import "./environment.js";
import app from "./server/app.js";
import {z} from "zod";
import {signup} from "./domains/user/application.ts";
import passport from "passport";
import {routeRequiresOtp, signInRedirect} from "./helpers/middleware.ts";
import {generateTotpUrl, lockTotp, verifyTotp} from "./domains/verification/totp.ts";

app.get("/signup", signInRedirect("guest"), (req, res) => {
  res.render("register", {});
});

app.get("/", signInRedirect("guest"), (req, res) => {
  res.render("login", {});
});

app.post("/signup", signInRedirect("guest"), async (req, res) => {
  const username = z.string().regex(/^[a-z0-9_-]+$/i).min(8).parse(req.body.username);
  const password = z.string().min(8).parse(req.body.password);
  await signup({username, password});
  res.redirect("/");
});

app.post("/login", signInRedirect("guest"), passport.authenticate("local", {
  failureRedirect: "/"
}), (req, res) => {
  res.redirect("/dashboard");
});

app.get("/dashboard", signInRedirect("user"), (req, res) => {
  res.render("dashboard", {
    username: req.user.username,
  });
});

app.get("/logout", signInRedirect("user"), (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

app.post("/2fa-activate", signInRedirect("user"), async (req, res) => {
  try {
    const result = await generateTotpUrl(req.user);
    return res.json({
      success: true,
      data: result,
    });
  } catch (e) {
    return res.status(400).send({
      success: false,
    });
  }
});

app.get("/2fa-activate", signInRedirect("user"), (req, res) => {
  return res.render("2fa-activate");
});

app.post("/verify", signInRedirect("user"), async (req, res) => {
  const code = z.string().regex(/[0-9]{8}/).parse(req.body.code);
  const result = await verifyTotp(req.user, code);
  if (result) {
    await lockTotp(req.user.id);
    return res.redirect("/dashboard");
  } else {
    return res.redirect("/2fa-activate");
  }
});

app.get("/email", (req, res) => {
  res.render("email");
})

app.post("/email", routeRequiresOtp, async (req, res) => {
  res.send({
    email: req.body.email,
  })
})
