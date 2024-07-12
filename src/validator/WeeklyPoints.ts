import Joi from "joi"


const WeeklyPointsSchema = Joi.object({
    points: Joi.number(),
    comments: Joi.string(),
    state: Joi.string().valid('execused', 'absent', 'present')
})


export default WeeklyPointsSchema