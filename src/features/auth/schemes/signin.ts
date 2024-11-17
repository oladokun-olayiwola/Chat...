import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(3).max(15).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Username is too short. It should be at least 3 characters.',
    'string.max': 'Username is too long. It should be at most 15 characters.',
    'string.empty': 'Username is a required field'
  }),
  password: Joi.string().required().min(3).max(30).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password is too short. It should be at least 3 characters.',
    'string.max': 'Password is too long. It should be at most 30 characters.',
    'string.empty': 'Password is a required field'
  })
});

export { loginSchema };
