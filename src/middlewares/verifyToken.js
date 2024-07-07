import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";

//! verification of dentist token
export async function verifyToken(req, res, next) {
    //. Extracting authorization token from HTTP header
    const dentistToken = req.cookies ? req.cookies.authToken : null;

    if (!dentistToken) {
        return next();
    }
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: dentistToken },
        });

        if (!dbtoken) {
            return res.status(401).json({ error: "Unauthorized access(P100)" });
        }

        if (!dbtoken.valid) {
            req.dentist = null
            return next();
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(dentistToken, SECRET_KEY);

        //. Confirming user's profile
        const dbuser = await prisma.dentist.findUnique({
            where: { id: jwtPayload.tokenID },
        });
        if (!dbuser) {
            return res.status(401).json({ error: "Unauthorized access(P102)" });
        }

        //. Adding { dentist: dentistID } in the req object
        req.dentist = dbtoken.dentistID;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: dentistToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            return res.status(401).json({ error: "Unauthorized access(P103)" });
        }
    } finally {
        next();
    }
}

//! verification of lab token
export async function verifyLabToken(req, res, next) {
    //. Extracting authorization token from HTTP header
    const labToken = req.cookies ? req.cookies.authToken : null;
    if (!labToken) {
        return next();
    }
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: labToken },
        });

        if (!dbtoken) {
            return res.status(401).json({ error: "Unauthorized access(P100)" });
        }

        if (!dbtoken.valid) {
            req.lab = null
            return next();
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(labToken, SECRET_KEY);

        //. Confirming user's profile
        const dbuser = await prisma.lab.findUnique({
            where: { id: jwtPayload.tokenID },
        });
        if (!dbuser) {
            return res.status(401).json({ error: "Unauthorized access(P102)" });
        }

        //. Adding { lab: labID } in the req object
        req.lab = dbtoken.labID;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: labToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            return res.status(401).json({ error: "Unauthorized access(P103)" });
        }
    } finally {
        next();
    }
}
