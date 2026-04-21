const express = require('express');
const { register, login, me } = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.schema');
const validate = require('../../middlewares/validate');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, me);

module.exports = router;
