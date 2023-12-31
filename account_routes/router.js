const router = require('express').Router();
const controllers = require('../account_controllers/controllers');
require('dotenv').config();

router
  .route('/user/:id')
  .get(controllers.accountInfo.getUserData)
  .put(controllers.accountInfo.updateUserData);
router.route('/user/:id/cars').get(controllers.accountInfo.getUserCarData);
router
  .route('/user/:id/delete-vehicle')
  .delete(controllers.accountInfo.deleteVehicle);
router.route('/user/:id/add-vehicle').post(controllers.accountInfo.addVehicle);
router.route('/user/:id/edit-vehicle').put(controllers.accountInfo.editVehicle);
router
  .route('/user/:id/current-reservations')
  .get(controllers.accountInfo.getCurrentReservations);

module.exports = router;
