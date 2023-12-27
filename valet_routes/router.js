const valetRouter = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

valetRouter.route('/valet/:id').get(controllers.valetInfo.getValetData);
valetRouter
  .route('/valet/:id/operation-hours')
  .put(controllers.valetInfo.editOperationHours);
valetRouter
  .route('/valet/:id/spots')
  .put(controllers.valetInfo.editGarageParkingSpots);

module.exports = valetRouter;
