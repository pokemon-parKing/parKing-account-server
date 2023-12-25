const router = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

router
  .route('/user/:id')
  .get(controllers.accountInfo.getUserData)
  .put(controllers.accountInfo.updateUserData);

router.route('/user/:id/cars').get(controllers.accountInfo.getUserCarData);

module.exports = router;
