const router = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

router.route('/user').get(controllers.accountInfo.getUsersData);

module.exports = router;
