const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const accountInfo = supabase.from('accounts');
const authUsers = supabase.from('auth.users');

//this is just my test route setup from before so that I can test the server is running and I can query the database
//these are the routes that i think i will need to set up.
//need to set up a login get request to see if a google id token exists on the database,
//need another request to log in a user with a google id token if it exists on the database
//need to set up a post request to create a new driver account with the google id token and the user information that is input on the front end
//need to set up a post request to create a new valet account with the google id token and the user information that is input on the front end (might combine these requests into one for more dry code)

router.get('/login/test', async (req, res) => {
  try {
    const { data, error } = await accountInfo.select('*');
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