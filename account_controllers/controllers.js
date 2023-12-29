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
          return res.sendStatus(500);
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
          .select();
        if (error) {
          console.error('Error updating user data:', error);
          return res.sendStatus(500);
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
          return res.sendStatus(500);
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

    deleteVehicle: async (req, res) => {
      try {
        const { vehicleId } = req.body;
        const { error } = await supabase
          .from('cars')
          .delete()
          .eq('id', vehicleId);
        if (error) {
          console.error('Error deleting vehicle:', error);
          return res.sendStatus(500);
        }
        res.status(200).send('Vehicle deleted successfully');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    addVehicle: async (req, res) => {
      try {
        const { id } = req.params;
        const { make, model, color, license_plate_number } = req.body;
        const { error } = await supabase.from('cars').insert([
          {
            make,
            model,
            color,
            license_plate_number,
            user_id: id,
          },
        ]);
        if (error) {
          console.error('Error adding vehicle:', error);
          return res.sendStatus(500);
        }
        res.status(201).send('Successfully added vehicle');
      } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getCurrentReservations: async (req, res) => {
      try {
        const { id } = req.params;
        const { data, error } = await supabase
          .from('reservations')
          .select(
            `
            parking_spot_id,
            date,
            time,
            garages ( name, address, city, state, country, zip)
          `
          )
          .eq('user_id', id);
        if (error) {
          console.error('Error fetching reservations:', error);
          return res.sendStatus(500);
        }
        if (!data || data.length === 0) {
          return res.status(404).send('No reservations found');
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },

  valetInfo: {
    getValetData: async (req, res) => {
      try {
        const { id } = req.params;
        const { data, error } = await supabase
          .from('garages')
          .select('*')
          .eq('user_id', id);
        if (error) {
          console.error('Error fetching valet data:', error);
          return res.sendStatus(500);
        }
        if (!data || data.length === 0) {
          return res.status(404).send('No garages found for the given user');
        }
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching valet data:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    editOperationHours: async (req, res) => {
      try {
        const { id } = req.params;
        const { operation_hours } = req.body;
        const { error } = await supabase
          .from('garages')
          .update({ operation_hours })
          .eq('user_id', id)
          .single();
        if (error) {
          console.error('Error updating operation hours:', error);
          return res.sendStatus(500);
        }
        res.status(200).send('Operation hours updated successfully');
      } catch (error) {
        console.error('Error updating operation hours:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    editGarageParkingSpots: async (req, res) => {
      try {
        const { id } = req.params;
        const { spots } = req.body;

        const { error: garageError } = await supabase
          .from('garages')
          .update({ spots })
          .eq('user_id', id)
          .single();

        if (garageError) {
          console.error('Error updating garage parking spots:', garageError);
          return res.sendStatus(500);
        }

        const { data: garageData, error: garageDataError } = await supabase
          .from('garages')
          .select('id')
          .eq('user_id', id)
          .single();

        if (garageDataError) {
          console.error('Error retrieving garage data:', garageDataError);
          return res.sendStatus(500);
        }

        const garageId = garageData.id;

        const { data: existingSpots, error: existingSpotsError } =
          await supabase
            .from('parking_spots')
            .select('id')
            .eq('garage_id', garageId);

        if (existingSpotsError) {
          console.error(
            'Error retrieving existing parking spots:',
            existingSpotsError
          );
          return res.sendStatus(500);
        }

        const existingSpotIds = existingSpots.map((spot) => spot.id);

        const numSpotsToAdd = spots - existingSpotIds.length;

        if (numSpotsToAdd > 0) {
          const newSpotIds = await Promise.all(
            Array.from({ length: numSpotsToAdd }, async () => {
              const { error: newSpotError } = await supabase
                .from('parking_spots')
                .insert({
                  garage_id: garageId,
                })
                .single();

              if (newSpotError) {
                console.error('Error adding new parking spot:', newSpotError);
                return null;
              }
            })
          );

          const filteredNewSpotIds = newSpotIds.filter(
            (spotsId) => spotsId !== null
          );
          const allSpotIds = existingSpotIds.concat(filteredNewSpotIds);

          res.status(200).json({ garageId, spotIds: allSpotIds });
        } else if (numSpotsToAdd < 0) {
          const spotsToRemove = existingSpotIds.slice(0, -numSpotsToAdd);

          const { error: removeSpotsError } = await supabase
            .from('parking_spots')
            .delete()
            .in('id', spotsToRemove);

          if (removeSpotsError) {
            console.error('Error removing parking spots:', removeSpotsError);
            return res.sendStatus(500);
          }

          res.status(200).json({ garageId, removedSpotIds: spotsToRemove });
        } else {
          res.status(200).json({ garageId, spotIds: existingSpotIds });
        }
      } catch (error) {
        console.error('Error updating garage parking spots:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },
};
