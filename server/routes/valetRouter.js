const valetRouter = require('express').Router();
const controllers = require('../controllers/accountController');

valetRouter.route('/:id').get(controllers.valetInfo.getValetData);
valetRouter
  .route('/:id/operation-hours')
  .put(controllers.valetInfo.editOperationHours);
valetRouter
  .route('/:id/spots')
  .put(controllers.valetInfo.editGarageParkingSpots);

module.exports = valetRouter;
