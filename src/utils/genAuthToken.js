import jwt from "jsonwebtoken"

//! Access Token
const SECRET_KEY = process.env.JWT_SECRET || "@localSecret";
const ACCESS_EXPR_MIN = process.env.ACCESS_EXPR_MIN || 1

//. Function to generate authToken 
function genAuthToken(tokenID) {
    const jwtPayload = { tokenID };
    try {
        const token = jwt.sign(jwtPayload, SECRET_KEY, { algorithm: "HS256", expiresIn: ACCESS_EXPR_MIN * 60 });
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}

//! Refresh Token
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "@refreshlocalSecret";
const REFRESH_EXPR_DAYS = process.env.REFRESH_EXPR_DAYS || 7;

//. Function to generate refresh token
function genRefToken(tokenID) {
    const jwtPayload = { tokenID };
    try {
        const token = jwt.sign(jwtPayload, REFRESH_SECRET_KEY, { algorithm: "HS384", expiresIn: REFRESH_EXPR_DAYS * 24 * 60 * 60 })
        return token;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export { genAuthToken, genRefToken };