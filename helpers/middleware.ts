import express, {NextFunction, Request, Response} from "express";
import {prisma} from "./prisma.js";
import {z} from "zod";
import {verifyTotp} from "../domains/verification/totp.js";

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

export async function routeRequiresOtp(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        throw new Error("User has not signed in");
    }
    const otpConfig = await prisma.totp.findUnique({
        where: {
            userId: req.user.id
        }
    });
    // User has not registered config yet.
    if (!otpConfig || !otpConfig.registered) {
        return next();
    }
    const otp = z.string().regex(/[0-9]{6,8}/).parse(req.body["_otp"]);
    if (!await verifyTotp(req.user, otp)) {
        return res.redirect(req.get("referer"))
    }
    next();
}