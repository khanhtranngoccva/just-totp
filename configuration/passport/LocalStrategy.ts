import {Strategy} from "passport-local";
import {prisma} from "../../helpers/prisma.js";
import * as bcrypt from 'bcrypt';

const localStrategy = new Strategy(async function (username, password, done) {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    }
  });
  if (!user) {
    return done(null, null);
  }
  if (!await bcrypt.compare(password, user.password)) {
    return done(null, false);
  }
  return done(null, user);
});

export default localStrategy;
