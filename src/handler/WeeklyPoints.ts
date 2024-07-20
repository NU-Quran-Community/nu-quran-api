import express from "express";
import User from "../db/model/User";
import connection from "../db/connection";
import WeeklyPoints from "../db/model/WeeklyPoints";
import Joi from "joi";
import { Op } from "sequelize";
import WeeklyPointsSchema from "../validator/WeeklyPoints";
import ExpressError from "../utils/ExpressError";
import {v4 as uuid} from "uuid"

const index = async (req: express.Request, res: express.Response) => {
    const exclude = ['hashed_password', 'pk', 'mentor_pk', 'referrer_pk', 'role'];
    
    enum DateOperator {"eq", "lte", "lt", "gte", "gt"};
    const { date = undefined, date_operator = "eq" } = req.query as unknown as { date: undefined | string, date_operator: DateOperator }

    // Validate date_operator
    const isValidDateOperator = Object.values(DateOperator).includes(date_operator as DateOperator);
    if (!isValidDateOperator) {
        throw new ExpressError(`Invalid date_operator value: ${date_operator}`, 400);
    }

    let where : {[key: string]: any} = {};
    if(date) where = { where: connection.where(
            connection.fn('DATE', connection.col('date')),
            // @ts-ignore
            Op[date_operator],
            connection.fn('DATE', date)
        )}

    const weekly_points = await WeeklyPoints.findAndCountAll({
        where,
        attributes: { exclude: ['user_pk'] },
        include: [
            { model: User, as: 'user', attributes: { exclude } },
        ],
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


const create = async (req: express.Request, res: express.Response) => {
    await Joi.object({ date: Joi.string().required() }).validateAsync(req.body)

    const query = `
        INSERT INTO ${WeeklyPoints.tableName} (id, user_pk, date, points, state)
        SELECT '${uuid()}', pk, DATE('${req.body.date}'), 0, 'absent'
        FROM "${User.tableName}";
    `;

    const weekly_points = await connection.query(query);
    res.status(201).send({ message: "Week created successfully." })
}


const update = async (req: express.Request, res: express.Response) => {
    const {id} = req.params
    const data = await WeeklyPointsSchema.validateAsync(req.body)

    const weekly_points = await WeeklyPoints.update({...req.body}, {where: {id}});

    res.status(201).send({ message: "Week updated successfully." })
}


const show = async (req: express.Request, res: express.Response) => {
    const { id } = req.params
    
    const exclude = ['hashed_password', 'pk', 'mentor_pk', 'referrer_pk', 'role'];
    const weekly_points = await WeeklyPoints.findOne({ 
        where: { id },
        attributes: {exclude: ['user_pk']},
        include: [ { model: User, attributes: { exclude } } ]
    });

    res.status(201).send(weekly_points)
}

const index_dates = async (req: express.Request, res: express.Response) => {
    const weekly_points = {
        rows: await WeeklyPoints.findAll({
            attributes: ['date'],
            group: ['date'],
            limit: res.locals.result.pagination.limit,
            offset: res.locals.result.pagination.offset
        }),
        count: await WeeklyPoints.count({
            distinct: true,
            col: 'date'
        })
    }

    const result = res.locals.result
    result.resources = weekly_points.rows;
    result.pagination.total_records = weekly_points.count;
    result.pagination.total_pages = Math.ceil(weekly_points.count / result.pagination.limit)

    if (result.pagination.total_pages > result.pagination.current_page)
        result.pagination.next_page = result.pagination.current_page + 1
    else
        result.pagination.next_page = null

    res.status(200).send(result)
}

export default {
    create,
    index,
    update,
    show,
    index_dates
}