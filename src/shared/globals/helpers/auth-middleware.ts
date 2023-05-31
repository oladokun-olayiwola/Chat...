import { NextFunction, Request, Response } from "express";
import  JWT from "jsonwebtoken";
import { UnAuthorizedError } from "./error-handler";
import { AuthPayload } from "@auth/interfaces/auth.interface";


export function verifyUser(req: Request, _res: Response, next: NextFunction) {
  console.log(req.session);
    if (!req.session?.jwt) {
      throw new UnAuthorizedError("Token is not available. Please login again");
    }
    try {
        const payload: AuthPayload = JWT.verify(req.session?.jwt, process.env.JWT_TOKEN!) as AuthPayload
        req.currentUser = payload;
    } catch (error) {
        throw new UnAuthorizedError("Invalid token, Please login again")
    }
    next()
}

export function checkAuthentication(req: Request, _res: Response, next: NextFunction) {
    if (!req.session?.jwt) {
      throw new UnAuthorizedError("Token is not available. Please login again");
    }
    next();
}