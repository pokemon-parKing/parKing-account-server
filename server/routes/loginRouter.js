const express = require('express');

const router = express.Router();
const supabase = require('../db');
const geocodeMiddleware = require('../middleware/geocodeGrabber');

//these are the routes that i will need to set up.
//driver/valet account creation, get account info

//get the account info and return null if there is nothing there
router.get('/login/:id', async (req, res) => {
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

//create the driver account, and the car associated with that account in the database.
//will probably refactor to be a supabase transaction for atomicity, so that if one fails, the other will fail as well. so we dont have to deal with a partially constructed record in the database.
router.post('/login/:id/driver', async (req, res) => {
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
//need to set up a post request to create a new valet account with the google id token and the user information that is input on the front end. this also assumes that a middleware function is used that generates the lat and lng from the passed in address. then creates the garage and the parking spots associated with that garage.
router.post('/login/:id/valet', geocodeMiddleware, async (req, res) => {
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
      console.error('Error creating valet account:', accountsError);
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
      console.error('Error creating valet account (garage):', garagesError);
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

router.get('/login/test/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('accounts').select('*');
    //another valid way to query the data from this table would be to use the following:
    // const { data, error } = await supabase.from('accounts').select('*');

    //example of a join table query to get the accounts first and last names from the accounts table and the cars id from the cars table joined over accounts id and the cars user_id //apologies if im not phrasing that correctly, brain no worky
    // const { data, error } = await supabase.from('cars').select('id, make, model, color, license_plate, accounts (firstName, lastName)')

    //another way to do that a little more explicitly and maybe more 'readablly' would be to use the following:
    // const { data, error } = await supabase.from('cars').select('id, make, model, color, license_plate, accounts!inner (firstName, lastName)');

    if (error) {
      throw error;
    }
    res.json(data);
  } catch (error) {
    console.error('Error retrieving account info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
