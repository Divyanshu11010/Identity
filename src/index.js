import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import encryption from "./middlewares/encryption.js";
import register from "./routes/register.js";
import login from "./routes/login.js";
import { verifyLabToken, verifyToken } from "./middlewares/verifyToken.js"
import dentist from "./routes/dentist.js";
import lab from "./routes/lab.js"
import { createLabToken, createToken } from "./middlewares/createToken.js";

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/register", encryption, register);
app.use("/login", login);
app.use("/dentist", verifyToken, createToken, dentist);
app.use("/lab", verifyLabToken, createLabToken, lab);

app.listen(1247, () => {
    console.log("Server is listening on port 1247...")
})