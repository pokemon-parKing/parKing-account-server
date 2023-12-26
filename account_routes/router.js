const router = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

// User Routes
router
  .route('/user/:id')
  .get(controllers.accountInfo.getUserData)
  .put(controllers.accountInfo.updateUserData);
router.route('/user/:id/cars').get(controllers.accountInfo.getUserCarData);
router.route('/user/:id/add-vehicle').post(controllers.accountInfo.addVehicle);
router
  .route('/user/:id/current-reservations')
  .get(controllers.accountInfo.getCurrentReservations);

// Valet Routes
router.route('/valet/:id').get(controllers.valetInfo.getValetData);
router
  .route('/valet/:id/operation-hours')
  .put(controllers.valetInfo.editOperationHours);
router
  .route('/valet/:id/spots')
  .put(controllers.valetInfo.editGarageParkingSpots);

module.exports = router;
