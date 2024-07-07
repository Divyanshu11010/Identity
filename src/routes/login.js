import { Router } from "express";

//. for password encryption
import bcrypt from "bcrypt";

//. for db
import { PrismaClient } from "@prisma/client";

//. for token
import { genAuthToken, genRefToken } from "../utils/genAuthToken.js";

const prisma = new PrismaClient;
const router = Router();

//! Dentist login
router.post("/dentist", async (req, res) => {
    try {
        //. find dentist in db
        const dentist = await prisma.dentist.findUnique({
            where: {
                username: req.body.username,
            }
        })

        //. Comparing the db password with entered password
        if (!dentist) {
            res.status(401).json({ error: "Unauthorized access" });
        }
        const check = await bcrypt.compare(req.body.password, dentist.password);

        if (check) {
            //. check if the user is having any valid session in db
            const session = await prisma.token.findMany({
                where: {
                    type: "refresh",
                    valid: true,
                    dentistID: dentist.id
                }
            })
            if (!session.length) {
                //. generating access and refresh token
                const accessToken = genAuthToken(dentist.id);
                const refreshToken = genRefToken(dentist.id);

                //. creating token object in db
                if (accessToken && refreshToken) {
                    // access token
                    await prisma.token.create({
                        data: {
                            authToken: accessToken,
                            valid: true,
                            type: "access",
                            dentist: {
                                connect: {
                                    email: dentist.email
                                }
                            }
                        }
                    })

                    // refresh token
                    await prisma.token.create({
                        data: {
                            authToken: refreshToken,
                            valid: true,
                            type: "refresh",
                            dentist: {
                                connect: {
                                    email: dentist.email
                                }
                            }
                        }
                    })
                }

                //. Set the cookie with the access token
                const date = new Date();
                const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
                const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

                res.cookie('authToken', accessToken, {
                    domain: "localhost",
                    path: "/dentist",
                    httpOnly: true,
                    secure: false,  // set true if https
                    expires: accessCookieExp
                });

                //. Set the cookie with the refresh token 
                const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
                const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

                res.cookie('refreshToken', refreshToken, {
                    domain: "localhost",
                    path: "/dentist",
                    httpOnly: true,
                    secure: false, // set true if https
                    expires: refreshCookieExp
                })
                res.json({ "message": "successful login" });
            }
            else {
                res.json({ error: "already logged in :)" });
            }
        }
        else {
            res.json({ error: "Wrong Combination" });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
})

//! lab login
router.post("/lab", async (req, res) => {
    try {
        //. find lab in db
        const lab = await prisma.lab.findUnique({
            where: {
                username: req.body.username,
            }
        })

        //. Comparing the db password with entered password
        if (!lab) {
            res.status(401).json({ error: "Unauthorized access" });
        }
        const check = await bcrypt.compare(req.body.password, lab.password);

        if (check) {
            //. check if the user is having any valid session in db
            const session = await prisma.token.findMany({
                where: {
                    type: "refresh",
                    valid: true,
                    labID: lab.id
                }
            })
            if (!session.length) {
                //. generating access and refresh token
                const accessToken = genAuthToken(lab.id);
                const refreshToken = genRefToken(lab.id);

                //. creating token object in db
                if (accessToken && refreshToken) {
                    // access token
                    await prisma.token.create({
                        data: {
                            authToken: accessToken,
                            valid: true,
                            type: "access",
                            lab: {
                                connect: {
                                    email: lab.email
                                }
                            }
                        }
                    })

                    // refresh token
                    await prisma.token.create({
                        data: {
                            authToken: refreshToken,
                            valid: true,
                            type: "refresh",
                            lab: {
                                connect: {
                                    email: lab.email
                                }
                            }
                        }
                    })
                }

                //. Set the cookie with the access token
                const date = new Date();
                const ACCESS_COOKIE_EXPR_MIN = process.env.ACCESS_COOKIE_EXPR_MIN || 10
                const accessCookieExp = new Date(date.getTime() + ACCESS_COOKIE_EXPR_MIN * 60 * 1000);

                res.cookie('authToken', accessToken, {
                    domain: "localhost",
                    path: "/lab",
                    httpOnly: true,
                    secure: false,  // set true if https
                    expires: accessCookieExp
                });

                //. Set the cookie with the refresh token 
                const REFRESH_COOKIE_EXPR_DAYS = process.env.REFRESH_COOKIE_EXPR_DAYS || 7
                const refreshCookieExp = new Date(date.getTime() + REFRESH_COOKIE_EXPR_DAYS * 24 * 60 * 60 * 1000);

                res.cookie('refreshToken', refreshToken, {
                    domain: "localhost",
                    path: "/lab",
                    httpOnly: true,
                    secure: false,  // set true if https
                    expires: refreshCookieExp
                })
                res.json({ "message": "successful login" });
            }
            else {
                res.json({ error: "already logged in :)" });
            }
        }
        else {
            res.json({ error: "Wrong Combination" });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
})

export default router