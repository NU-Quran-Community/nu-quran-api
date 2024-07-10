import { Request, Response, NextFunction } from "express";
import Sequelize from "sequelize";
import ExpressError from "./ExpressError";
import User from "../db/model/User";
import Joi from "joi";


function WrapAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => Promise<any> {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        }

        catch (e: unknown) {
            console.error(e);

            if (e instanceof Sequelize.BaseError) {
                if (e instanceof Sequelize.ConnectionError) next(new ExpressError(e.message, 500));

                if (e instanceof Sequelize.ValidationError) {
                    for (let error of e.errors) {
                        e.message += ", " + error.message

                        if (e.name === "SequelizeUniqueConstraintError") {
                            if (error.instance instanceof User)
                                e.message += ", This username is already taken."
                        }
                    }
                    next(new ExpressError(e.message, 400));
                }

                else next(new ExpressError(e.message, 500));
            }
            else if (e instanceof Joi.ValidationError) next(new ExpressError(e.message, 400));
            else if (e instanceof Error) next(new ExpressError(e.message, 400));
            else next(e);
        }
    }
}



export default WrapAsync;