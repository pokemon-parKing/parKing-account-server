const router = require('express').Router();
const { createClient } = require('@supabase/supabase-js');


const accountInfo = supabase.from('accounts');
const authUsers = supabase.from('auth.users');

app.get('/login', async (req, res) => {
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