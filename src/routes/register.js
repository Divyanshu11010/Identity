import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//! Dentist Register
router.post("/dentist", async (req, res) => {
    const { email, contact, username, password } = req.body;
    try {
        const dentist = await prisma.dentist.findUnique({ where: { email: email, username: username } });
        if (!dentist) {
            //. User creation
            await prisma.dentist.create({
                data: {
                    email,
                    contact,
                    username,
                    password,
                }
            })
            res.status(200).json({ "message": "Account created" });
        }
        else {
            res.json({ error: "User Already Exists! do login" });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
})

//! Lab register
router.post("/lab", async (req, res) => {
    const { email, username, password, contact } = req.body;
    try {
        const lab = await prisma.lab.findUnique({
            where: {
                email,
                password
            }
        })
        if (!lab) {
            await prisma.lab.create({
                data: {
                    email,
                    username,
                    password,
                    contact,
                }
            })
            res.status(200).json({ "message": "Account created" });
        }
        else {
            res.status(401).json({ "error": "user already exits ! do login" });
        }
    } catch (error) {
        console.error(error);
        res.json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
})

export default router
