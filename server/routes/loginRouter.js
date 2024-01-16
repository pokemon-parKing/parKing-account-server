const express = require('express');

const router = express.Router();
const supabase = require('../db');
const geocodeMiddleware = require('../middleware/geocodeGrabber');

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('accounts')
      .select()
      .eq('id', id);
    if (error) {
      console.error('Error retrieving user data:', error);
      return res.sendStatus(500);
    }
    if (!data) {
      return res.status(201).send(null);
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/driver', async (req, res) => {
  const { id } = req.params;
  const {
    google_accounts_id,
    first_name,
    last_name,
    email,
    phone_number,
    role,
    make,
    model,
    color,
    license_plate_number,
  } = req.body;
  try {
    const { error: accountsError } = await supabase.from('accounts').insert({
      id,
      first_name,
      last_name,
      email,
      phone_number,
      role,
    });
    if (accountsError) {
      console.error('Error creating driver account:', accountsError);
      return res.sendStatus(500);
    }
    const { error: carsError } = await supabase.from('cars').insert({
      make,
      model,
      color,
      license_plate_number,
      user_id: id,
    });
    if (carsError) {
      console.error('Error creating driver account (cars):', carsError);
      return res.sendStatus(500);
    }
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/valet', geocodeMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    google_accounts_id,
    first_name,
    last_name,
    email,
    phone_number,
    role,
    address,
    city,
    state,
    zip,
    country,
    name,
    operation_hours,
    spots,
    lat,
    lng,
  } = req.body;

  try {
    const { error: accountsError } = await supabase.from('accounts').insert({
      id,
      first_name,
      last_name,
      email,
      phone_number,
      role,
    });

    if (accountsError) {
      return res.sendStatus(500);
    }
    const { error: garagesError, data: garageData } = await supabase
      .from('garages')
      .insert({
        address,
        city,
        state,
        zip,
        country,
        name,
        operation_hours,
        spots,
        user_id: id,
        lat,
        lng,
      })
      .select();

    if (garagesError) {
      return res.sendStatus(500);
    }

    const rows = Array.from({ length: spots }, () => ({
      garage_id: garageData[0].id,
    }));

    const { error: spotsError } = await supabase
      .from('parking_spots')
      .insert(rows);

    if (spotsError) {
      console.error('Error creating valet account (spots):', spotsError);
      res.sendStatus(500);
    }
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
