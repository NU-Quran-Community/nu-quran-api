import express from "express";
import User from "../db/model/User";
import connection from "../db/connection";
import WeeklyPoints from "../db/model/WeeklyPoints";
import { Op } from "sequelize";
import ExpressError from "../utils/ExpressError";





const index = async (req: express.Request, res: express.Response) => {
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

    if (where.Where) where.where.state = { [Op.ne]: 'absent' }
    else where.state = {[Op.ne]: 'absent'}

    const monthly_points = await WeeklyPoints.findAndCountAll({
        where,
        attributes: [[connection.fn('SUM', connection.col('points')), 'total_points']],
        include: [
            { model: User, as: 'user', attributes: ['id'] },
        ],
        group: connection.col('user.pk'),
        limit: res.locals.result.pagination.limit,
        offset: res.locals.result.pagination.offset
    })


    const result = res.locals.result
    result.resources = monthly_points.rows.map(row => {
        return {total_points: row.getDataValue("total_points"), user_id: row.user.id}
    });
    result.pagination.total_records = monthly_points.count.length;
    result.pagination.total_pages = Math.ceil(monthly_points.count.length / result.pagination.limit)

    if (result.pagination.total_pages > result.pagination.current_page)
        result.pagination.next_page = result.pagination.current_page + 1
    else
        result.pagination.next_page = null

    res.status(200).send(result)
}



export default {
    index
}