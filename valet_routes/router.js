const router = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

router.route('/valet/:id').get(controllers.valetInfo.getValetData);
router
  .route('/valet/:id/operation-hours')
  .put(controllers.valetInfo.editOperationHours);
router
  .route('/valet/:id/spots')
  .put(controllers.valetInfo.editGarageParkingSpots);

module.exports = router;
