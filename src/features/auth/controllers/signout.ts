
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


export async function logout(req: Request, res: Response) {
    req.session = null;
    res.status(StatusCodes.OK).json({message: "Logout Successfully"})
}
