import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().required().min(3).max(15).messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Username is too short. It should be at least 3 characters.',
    'string.max': 'Username is too long. It should be at most 15 characters.',
    'string.empty': 'Username is a required field'
  }),
  password: Joi.string().required().min(3).max(30).messages({
    'string.base': 'Password must be of type string',
    'string.min': 'Password is too short. It should be at least 3 characters.',
    'string.max': 'Password is too long. It should be at least 30 characters.',
    'string.empty': 'Password is a required field'
  }),
  email: Joi.string().required().email().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Email must be valid',
    'string.empty': 'Email is a required field'
  }),
  avatarColor: Joi.string().required().messages({
    'any.required': 'Avatar color is required'
  }),
  avatarImage: Joi.string().required().messages({
    'any.required': 'Avatar image is required'
  })
});

export { signupSchema };
