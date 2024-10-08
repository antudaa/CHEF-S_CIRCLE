import jwt from "jsonwebtoken";

export const createToken = (
    jwtPayload: { userEmail: string; role: "admin" | "user"; userId: string | undefined },
    secret: string,
    expiresIn: string,
) => {
    return jwt.sign(jwtPayload, secret, {
        expiresIn,
    });
};