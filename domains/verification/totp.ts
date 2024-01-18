import {prisma} from "../../helpers/prisma.js";
import {z} from "zod";
import * as crypto from "crypto";
import * as Prisma from '@prisma/client';
import base32Encode from "base32-encode";
import * as console from "console";

async function getOrCreateTotpParameters(userId: string) {
  const existing = await prisma.totp.findUnique({
    where: {
      userId: userId,
    }
  });
  if (existing) return existing;
  return await prisma.totp.create({
    data: {
      userId: userId,
      interval: z.coerce.number().positive().int().parse(process.env.TOTP_INTERVAL),
      secret: crypto.randomBytes(20).toString("hex").toUpperCase(),
      algorithm: "SHA256",
      digits: 8,
      timeOrigin: 0,
    }
  });
}

export async function generateTotpUrl(user: Prisma.User) {
  const params = await getOrCreateTotpParameters(user.id);
  if (params.registered) {
    throw new Error("2FA has already been signed.");
  }
  const url = new URL(`otpauth://totp/ExampleApp:${user.username}`);
  const base32Secret = hexToBase32(params.secret);
  url.searchParams.set("issuer", "Khanh");
  url.searchParams.set("secret", base32Secret);
  url.searchParams.set("algorithm", params.algorithm);
  url.searchParams.set("digits", params.digits.toString());
  url.searchParams.set("period", params.interval.toString());
  return url.toString();
}

function hexToBase32(hex: string) {
  const secretBuffer = Buffer.from(hex, "hex");
  return base32Encode(secretBuffer, "RFC3548", {
    padding: false
  });
}

function totpGenerator(params: {
  algorithm: string,
  digits: number,
  timeStep: number,
  key: string,
}) {
  const timeHex = params.timeStep.toString(16).padStart(16, "0");
  const keyHex = params.key;

  const hmac = crypto.createHmac(params.algorithm, Buffer.from(keyHex, "hex"));
  const timeBuf = Buffer.from(timeHex, "hex");
  hmac.update(timeBuf);
  const hash = hmac.digest();
  const offset = hash[hash.length - 1] & 0xf;

  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (binary % 10 ** params.digits).toString().padStart(params.digits, "0");
}

export async function verifyTotp(user: Prisma.User, inputOtp: string) {
  const params = await getOrCreateTotpParameters(user.id);
  const timeDiff = Math.floor(Date.now() / 1000 - params.timeOrigin);
  const timeStep = Math.floor(timeDiff / params.interval);

  for (let curStep = timeStep; curStep >= timeStep - 1 && curStep >= 0; curStep--) {
    if (inputOtp === totpGenerator({
      digits: params.digits,
      key: params.secret,
      timeStep: curStep,
      algorithm: params.algorithm,
    })) {
      return true;
    }
  }
  return false;
}

export async function lockTotp(userId: string) {
  await prisma.totp.update({
    where: {
      userId: userId
    },
    data: {
      registered: true,
    }
  });
}
