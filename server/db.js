require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.Supabase_URL,
  process.env.Supabase_API_Key
);

module.exports = supabase;
