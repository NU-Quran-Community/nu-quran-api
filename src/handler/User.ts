import express from "express";
import UserSchema from "../validator/User";
import LoginSchema from "../validator/Login";
import User from "../db/model/User";
import bcrypt from "bcrypt"
import get_config from "../config/config";
import ExpressError from "../utils/ExpressError";
import WeeklyPoints from "../db/model/WeeklyPoints";
import connection from "../db/connection";
import { Op } from "sequelize";


const exclude = ['hashed_password', 'pk', 'mentor_pk', 'referrer_pk', 'role'];

const index = async (req: express.Request, res: express.Response) => {
    const users = await User.findAndCountAll({
        attributes: { exclude },
        include: [
            { model: User, as: 'referrer', attributes: { exclude }  },
            { model: User, as: 'mentor', attributes: { exclude } },
        ],
        limit: res.locals.result.pagination.limit,
        offset: res.locals.result.pagination.offset
    });

    const result = res.locals.result
    result.resources = users.rows;
    result.pagination.total_records = users.count;
    result.pagination.total_pages = Math.ceil(users.count / result.pagination.limit)

    if (result.pagination.total_pages > result.pagination.current_page)
        result.pagination.next_page = result.pagination.current_page + 1
    else
        result.pagination.next_page = null

    res.status(200).send(result);
}


const create = async (req: express.Request, res: express.Response) => {
    const req_user = await UserSchema.validateAsync(req.body)

    req_user.hashed_password = req_user.password || "12345";
    const user = await User.create({
        ...req_user,
        attributes: { exclude: ['hashed_password', 'pk', 'id'] },
    });

    const last_date = await WeeklyPoints.findOne({
        attributes: ['date'],
        order: [['date', 'DESC']]
    })

    if(last_date){
        await WeeklyPoints.create({
            date: last_date.date,
            user_pk: user.pk,
            state: "execused"
        })
    }

    res.status(201).send({ user })
}




const index_weekly_points = async (req: express.Request, res: express.Response) => {
    const {id} = req.params

    enum DateOperator { "eq", "lte", "lt", "gte", "gt" };
    const { date = undefined, date_operator = "eq" } = req.query as unknown as { date: undefined | string, date_operator: DateOperator }

    // Validate date_operator
    const isValidDateOperator = Object.values(DateOperator).includes(date_operator as DateOperator);
    if (!isValidDateOperator) {
        throw new ExpressError(`Invalid date_operator value: ${date_operator}`, 400);
    }

    let where: { [key: string]: any } = {};
    if (date) where = {
        where: connection.where(
            connection.fn('DATE', connection.col('date')),
            // @ts-ignore
            Op[date_operator],
            connection.fn('DATE', date)
        )
    }

    const user = await User.findOne({attributes: ['pk'], where: {id}})
    if(!user) throw new ExpressError("Wrong user id", 404);

    where.user_pk = user.pk;
    const weekly_points = await WeeklyPoints.findAndCountAll({
        where,
        attributes: { exclude: ['user_pk'] },
        limit: res.locals.result.pagination.limit,
        offset: res.locals.result.pagination.offset
    })

    const result = res.locals.result
    result.resources = weekly_points.rows;
    result.pagination.total_records = weekly_points.count;
    result.pagination.total_pages = Math.ceil(weekly_points.count / result.pagination.limit)

    if (result.pagination.total_pages > result.pagination.current_page)
        result.pagination.next_page = result.pagination.current_page + 1
    else
        result.pagination.next_page = null

    res.status(200).send(result);
}



const show = async (req: express.Request, res: express.Response) => {
    const {id} = req.params
    
    const user = await User.findOne({
        where: { id },
        attributes: { exclude },
        include: [
            { model: User, as: 'referrer', attributes: { exclude } },
            { model: User, as: 'mentor', attributes: { exclude } },
        ],
    });

    if (!user) throw new ExpressError("Wrong user id", 404);
    res.status(200).send(user)
}


const login = async (req: express.Request, res: express.Response) => {
    const req_user = await LoginSchema.validateAsync(req.body)

    const user = await User.findOne({
        where: { email: req_user.email }
    });

    if (!user) throw new ExpressError("Wrong email or password", 404);
    const is_matched = await bcrypt.compare(req_user.password + get_config("PEPPER"), user.hashed_password)
    if (!is_matched) throw new ExpressError("Wrong email or password", 404);

    req.session.user = {
        pk: user.pk,
        id: user.id,
        email: user.email,
    }

    res.status(200).send({ message: "User loged in successfully." })
}



const logout = async (req: express.Request, res: express.Response) => {
    if (req.session) {
        req.session.destroy(e => {
            if (e) throw new e
            else res.status(200).send({ message: "User loged in successfully." })
        })
    }
    else res.redirect("users/loging")
}


export default {
    create,
    index,
    index_weekly_points,
    login,
    logout,
    show
}