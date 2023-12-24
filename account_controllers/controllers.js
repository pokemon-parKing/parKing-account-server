require('dotenv').config();
const supabase = createClient(process.env.Supabase_URL, process.env.Supabase_API_Key)

module.exports = {
  accountInfo: {
    getUsersData: async (req, res) > {
      try {

      } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  }
}