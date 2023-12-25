/* eslint-disable consistent-return */
/* eslint-disable camelcase */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.Supabase_URL,
  process.env.Supabase_API_Key
);

module.exports = {
  accountInfo: {
    getUserData: async (req, res) => {
      try {
        const { id } = req.params;
        const { data, error } = await supabase
          .from('accounts')
          .select(
            'id, google_account_id, first_name, last_name, email, phone_number, role, contact_preferences'
          )
          .eq('id', id)
          .single();
        if (error) {
          console.error('Error retrieving user data:', error);
          return res.status(500).send('Internal Server Error');
        }
        if (!data) {
          return res.status(404).send('User not found');
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    updateUserData: async (req, res) => {
      try {
        const { id } = req.params;
        const { first_name, last_name, email, phone_number } = req.body;
        const { data, error } = await supabase
          .from('accounts')
          .update({
            first_name,
            last_name,
            email,
            phone_number,
          })
          .eq('id', id)
          .single()
          .select();
        if (error) {
          console.error('Error updating user data:', error);
          return res.status(500).send('Internal Server Error');
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getUserCarData: async (req, res) => {
      try {
        const { id } = req.params;
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('user_id', id);
        if (error) {
          console.error('Error retrieving car data:', error);
          return res.status(500).send('Internal Server Error');
        }
        if (!data || data.length === 0) {
          return res.status(404).send('User not found or no cars associated');
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Error retrieving car data:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },
};
