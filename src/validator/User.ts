import Joi from "joi"


const UserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string(),
    mentor_id: Joi.string(),
    referrer_id: Joi.string(),
})


export default UserSchema