import {Express} from "express";
import session from "express-session";
import {z} from "zod";
import {EnvironmentError} from "../../helpers/errors.js";
import {PrismaSessionStore} from "@quixo3/prisma-session-store";
import {prisma} from "../../helpers/prisma.js";
import passport from "passport";
import localStrategy from "./LocalStrategy.ts";


let secret: string;
try {
  secret = z.string().min(8).parse(process.env.SESSION_SECRET);
} catch (e) {
  throw new EnvironmentError("SESSION_SECRET");
}

export default function enablePassportAuth(app: Express) {
  app.use(session({
    saveUninitialized: false,
    secret: secret,
    resave: false,
    cookie: {
      sameSite: "strict",
    },
    store: new PrismaSessionStore(prisma, {})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(localStrategy);
  passport.serializeUser(async (user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: string, done) => {
    const user = await prisma.user.findFirst({
      where: {id: id},
    });
    if (!user) done(null, null);
    else done(null, user);
  });
}


