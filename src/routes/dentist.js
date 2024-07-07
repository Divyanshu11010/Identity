import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

router.get("/", (req, res) => {
    res.send("Verification is working");
})

//! logout dentist
router.delete("/logout", async (req, res) => {
    try {
        await prisma.token.deleteMany({
            where: {
                dentistID: req.dentist
            }
        })
        // clear cookies before logout
        res.clearCookie("refreshToken", { domain: "localhost", path: "/dentist" });
        res.clearCookie("authToken", { domain: "localhost", path: "/dentist" });

        res.send("Successfully Logout");
    } catch (error) {
        console.error(error)
        res.json({ error: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
})

export default router;