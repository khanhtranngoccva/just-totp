import {prisma} from "../../helpers/prisma.js";
import * as bcrypt from "bcrypt";

export async function signup(user: {
  username: string;
  password: string;
}) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);

  return await prisma.user.create({
    data: {
      username: user.username,
      password: hash,
    }
  });
}
