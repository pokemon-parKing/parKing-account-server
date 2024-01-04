const router = require('express').Router();
const controllers = require('../controllers/accountController');

router
  .route('/:id')
  .get(controllers.accountInfo.getUserData)
  .put(controllers.accountInfo.updateUserData);
router.route('/:id/cars').get(controllers.accountInfo.getUserCarData);
router
  .route('/:id/delete-vehicle')
  .delete(controllers.accountInfo.deleteVehicle);
router.route('/:id/add-vehicle').post(controllers.accountInfo.addVehicle);
router.route('/:id/edit-vehicle').put(controllers.accountInfo.editVehicle);
router
  .route('/:id/current-reservations')
  .get(controllers.accountInfo.getCurrentReservations);

module.exports = router;
