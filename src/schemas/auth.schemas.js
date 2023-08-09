import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(4).required(),
    phone: Joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    image: Joi.string().uri().allow('')
})

export const signinSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(4).required()
})