import Joi from 'joi';

export const loginUserValidationSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(5).required(),
});
