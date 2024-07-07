import { PrismaClient } from "@prisma/client";
import { genAuthToken, genRefToken } from "../utils/genAuthToken.js";
import { verifyRefLabToken, verifyRefToken } from "../utils/verifyRefToken.js";

const prisma = new PrismaClient();

export async function createToken(req, res, next) {
    //. check if there is refresh token cookie
    const dentistRefToken = req.cookies ? req.cookies.refreshToken : null;
    if (!dentistRefToken) {
        return res.json({ error: "Unauthorized access (Do login)" });
    }
    try {
        if (req.dentist) {
            return next();
        }

        const dentistId = await verifyRefToken(dentistRefToken);
        if (dentistId) {
            //. Invalidate all the tokens
            await prisma.token.updateMany({
                where: { dentistID: dentistId },
                data: { valid: false },
            });

            //. Generate new tokens in the DB
            const newAccess = genAuthToken(dentistId);
            const newRefresh = genRefToken(dentistId);

            //. New access token
            await prisma.token.create({
                data: {
                    authToken: newAccess,
                    valid: true,
                    type: "access",
                    dentist: { connect: { id: dentistId } },
                },
            });

            //. New refresh token
            await prisma.token.create({
                data: {
                    authToken: newRefresh,
                    valid: true,
                    type: "refresh",
                    dentist: { connect: { id: dentistId } },
                },
            });

            //. Set the cookies with the new tokens
            const date = new Date();
            const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
            const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

            const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
            const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

            res.clearCookie('authToken', { domain: "localhost", path: "/dentist" });
            res.cookie('authToken', newAccess, {
                domain: "localhost",
                path: "/dentist",
                httpOnly: true,
                secure: false,
                expires: accessCookieExp,
            });

            res.clearCookie('refreshToken', { domain: "localhost", path: "/dentist" });
            res.cookie('refreshToken', newRefresh, {
                domain: "localhost",
                path: "/dentist",
                httpOnly: true,
                secure: false,
                expires: refreshCookieExp,
            });

            //. update dentist id in req object
            req.dentist = dentistId;
        } else {
            return res.json({ error: "Do Login!" });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

//! Create lab token
export async function createLabToken(req, res, next) {
    //. check if there is refresh token cookie
    const labRefToken = req.cookies ? req.cookies.refreshToken : null;
    if (!labRefToken) {
        return res.json({ error: "Unauthorized access (Do login)" });
    }
    try {
        if (req.lab) {
            return next();
        }

        const labId = await verifyRefLabToken(labRefToken);
        if (labId) {
            //. Invalidate all the tokens
            await prisma.token.updateMany({
                where: { labID: labId },
                data: { valid: false },
            });

            //. Generate new tokens in the DB
            const newAccess = genAuthToken(labId);
            const newRefresh = genRefToken(labId);

            //. New access token
            await prisma.token.create({
                data: {
                    authToken: newAccess,
                    valid: true,
                    type: "access",
                    lab: { connect: { id: labId } },
                },
            });

            //. New refresh token
            await prisma.token.create({
                data: {
                    authToken: newRefresh,
                    valid: true,
                    type: "refresh",
                    lab: { connect: { id: labId } },
                },
            });

            //. Set the cookies with the new tokens
            const date = new Date();
            const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
            const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

            const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
            const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

            res.clearCookie('authToken', { domain: "localhost", path: "/lab" });
            res.cookie('authToken', newAccess, {
                domain: "localhost",
                path: "/lab",
                httpOnly: true,
                secure: false,
                expires: accessCookieExp,
            });

            res.clearCookie('refreshToken', { domain: "localhost", path: "/lab" });
            res.cookie('refreshToken', newRefresh, {
                domain: "localhost",
                path: "/lab",
                httpOnly: true,
                secure: false,
                expires: refreshCookieExp,
            });

            //. update lab id in req object
            req.lab = labId;
        } else {
            return res.json({ error: "Do Login!" });
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
