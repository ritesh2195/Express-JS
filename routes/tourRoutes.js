const express = require('express');
const fs = require('fs');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/AuthController');

const router = express.Router();

router
  .route('/top5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getSingleTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  )
  .patch(tourController.updateTour);

module.exports = router;
