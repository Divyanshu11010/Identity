import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "@localSecretDiv";

export const verifyRefToken = async (dentistRefToken) => {
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: dentistRefToken },
        });

        if (!dbtoken || !dbtoken.valid) {
            return null;
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(dentistRefToken, JWT_REFRESH_SECRET);

        //. Confirming user's profile
        const dbuser = await prisma.dentist.findUnique({
            where: { id: jwtPayload.tokenID },
        });

        if (!dbuser) {
            return null;
        }

        return dbuser.id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: dentistRefToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            console.error(error);
            res.json({ error: "Internal Server Error" });
        }
        return null;
    }
};


//! verification of lab refresh token
export const verifyRefLabToken = async (labRefToken) => {
    try {
        //. Checking if there is any token
        const dbtoken = await prisma.token.findUnique({
            where: { authToken: labRefToken },
        });

        if (!dbtoken || !dbtoken.valid) {
            return null;
        }

        //. Verifying JWT token
        const jwtPayload = jwt.verify(labRefToken, JWT_REFRESH_SECRET);

        //. Confirming user's profile
        const dbuser = await prisma.lab.findUnique({
            where: { id: jwtPayload.tokenID },
        });

        if (!dbuser) {
            return null;
        }

        return dbuser.id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            try {
                await prisma.token.updateMany({
                    where: { authToken: labRefToken },
                    data: { valid: false },
                });
            } catch (updateError) {
                console.error("Error updating token validity: ", updateError);
            }
        } else {
            console.error(error);
            res.json({ error: "Internal Server Error" });
        }
        return null;
    }
};