import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError";
import User from "../db/model/User";


const IsAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.session) throw new ExpressError("Unauthenticated, please login", 401);
    next();
}

const IsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.session || !req.session.user) throw new ExpressError("Unauthenticated, please login", 401);

    const user = await User.findOne({
        where: { pk: req.session.user.pk }
    });

    if (!user) throw new ExpressError("Unauthenticated, please login", 401);
    if (user.dataValues.role != 'admin') throw new ExpressError("Unauthorized, please login", 401);

    next();
}


export default {
    IsAdmin,
    IsAuthenticated
}