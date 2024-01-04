/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const { DateTime } = require('luxon');
const supabase = require('../db');

const formatDate = (inputDate) => {
  const [month, day, year] = inputDate.toLocaleDateString().split('/');
  const formattedDate = `${month.padStart(2, '0')}-${day.padStart(
    2,
    '0'
  )}-${year.slice(-2)}`;
  return formattedDate;
};

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

    editVehicle: async (req, res) => {
      try {
        const { id, make, model, color, license_plate_number } = req.body;
        const { error } = await supabase
          .from('cars')
          .update({
            make,
            model,
            color,
            license_plate_number,
          })
          .eq('id', id);

        if (error) {
          console.error('Error editing vehicle:', error);
          return res.sendStatus(500);
        }

        res.status(200).send('Successfully edited vehicle');
      } catch (error) {
        console.error('Error editing vehicle:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getCurrentReservations: async (req, res) => {
      try {
        const { id } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const formattedToday = formatDate(today);

        const { data, error } = await supabase
          .from('reservations')
          .select(
            `
            id,
            parking_spot_id,
            date,
            time,
            garages (name, address, city, state, country, zip)
          `
          )
          .eq('user_id', id)
          .in('status', ['reserved', 'checked-in'])
          .order('date', { ascending: true })
          .order('time', { ascending: true })
          .eq('date', formattedToday);

        if (error) {
          console.error('Error fetching reservations:', error);
          return res.sendStatus(500);
        }

        if (!data || data.length === 0) {
          return res.status(404).send('No reservations found for today');
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
        const { operation_hours } = req.body;
        const { id } = req.params;
        const [startHour, endHour] = operation_hours.split('-').map(Number);

        if (
          startHour < 0 ||
          startHour > 24 ||
          endHour < 0 ||
          endHour > 24 ||
          startHour >= endHour
        ) {
          return res.status(400).send('Invalid hours');
        }

        const { data: garagesData, error: garagesError } = await supabase
          .from('garages')
          .select('operation_hours')
          .eq('user_id', id)
          .single();

        if (garagesError) {
          console.error(
            'Error fetching current operation hours:',
            garagesError
          );
          return res.sendStatus(500);
        }

        const currentOperationHours = garagesData
          ? garagesData.operation_hours
          : null;

        if (!currentOperationHours) {
          return res.status(400).send('Current operation hours not found');
        }

        const [currentStartHour, currentEndHour] = currentOperationHours
          .split('-')
          .map(Number);

        const formattedNext7Days = [...Array(7)].map((_, index) =>
          DateTime.local()
            .startOf('day')
            .plus({ days: index })
            .toFormat('MM-dd-yy')
        );

        const {
          data: startHourReservations,
          error: startHourReservationsErrors,
        } = await supabase
          .from('reservations')
          .select('*')
          .in('status', ['reserved', 'checked-in'])
          .in('date', formattedNext7Days)
          .gte('time', currentStartHour)
          .lt('time', startHour);

        if (startHourReservationsErrors) {
          console.error(
            'Error fetching reservations:',
            startHourReservationsErrors
          );
          return res.sendStatus(500);
        }

        const { data: endHourReservations, error: endHourReservationsErrors } =
          await supabase
            .from('reservations')
            .select('*')
            .in('status', ['reserved', 'checked-in'])
            .in('date', formattedNext7Days)
            .lte('time', currentEndHour)
            .gt('time', endHour);

        if (endHourReservationsErrors) {
          console.error(
            'Error fetching reservations:',
            endHourReservationsErrors
          );
          return res.sendStatus(500);
        }
        if (
          (startHourReservations && startHourReservations.length > 0) ||
          (endHourReservations && endHourReservations.length > 0)
        ) {
          return res
            .status(400)
            .send('Cannot update operation hours due to existing reservations');
        }

        const { error: updateError } = await supabase
          .from('garages')
          .update({ operation_hours })
          .eq('user_id', id);

        if (updateError) {
          console.error('Error updating operation hours:', updateError);
          return res.sendStatus(500);
        }

        res.status(200).send('Operation hours updated successfully');
      } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    editGarageParkingSpots: async (req, res) => {
      try {
        const { id } = req.params;
        const { spots } = req.body;

        const { data: garageData, error: garageDataError } = await supabase
          .from('garages')
          .select('id, spots')
          .eq('user_id', id)
          .single();

        if (garageDataError) {
          console.error('Error retrieving garage data:', garageDataError);
          return res.sendStatus(500);
        }

        const garageId = garageData.id;
        const formattedNext7Days = [...Array(7)].map((_, index) =>
          DateTime.local()
            .startOf('day')
            .plus({ days: index })
            .toFormat('MM-dd-yy')
        );

        const { data: conflictingReservations, error: reservationError } =
          await supabase
            .from('reservations')
            .select('parking_spot_id')
            .eq('garage_id', garageId)
            .in('status', ['reserved', 'checked-in'])
            .in('date', formattedNext7Days);

        if (reservationError) {
          console.error(
            'Error retrieving conflicting reservations:',
            reservationError
          );
          return res.sendStatus(500);
        }

        const conflictingSpotIds = conflictingReservations.map(
          (reservation) => reservation.parking_spot_id
        );

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
        const availableSpotIds = existingSpotIds.filter(
          (spotId) => !conflictingSpotIds.includes(spotId)
        );
        const numSpotsToAdd = spots - existingSpotIds.length;

        if (numSpotsToAdd > 0) {
          const newSpotIds = await Promise.all(
            Array.from({ length: numSpotsToAdd }, async () => {
              try {
                const { data: newSpotData, error: newSpotError } =
                  await supabase
                    .from('parking_spots')
                    .insert({
                      garage_id: garageId,
                    })
                    .select();

                if (newSpotError) {
                  console.error('Error adding new parking spot:', newSpotError);
                  return null;
                }

                if (!newSpotData) {
                  console.error(
                    'Unexpected response from Supabase:',
                    newSpotData
                  );
                  return null;
                }

                return newSpotData.id;
              } catch (insertError) {
                console.error('Error during insertion:', insertError);
                return null;
              }
            })
          );

          const filteredNewSpotIds = newSpotIds.filter(
            (filteredid) => filteredid !== null
          );
          const allSpotIds = availableSpotIds.concat(filteredNewSpotIds);

          await supabase.from('garages').update({ spots }).eq('id', garageId);

          res.status(200).json({ garageId, spotIds: allSpotIds });
        } else if (numSpotsToAdd < 0) {
          const spotsToRemove = availableSpotIds.slice(numSpotsToAdd);

          if (availableSpotIds.length < Math.abs(numSpotsToAdd)) {
            return res.status(400).json({
              error: 'Cannot remove spots due to conflicting reservations.',
            });
          }

          await supabase.from('parking_spots').delete().in('id', spotsToRemove);

          await supabase.from('garages').update({ spots }).eq('id', garageId);

          res.status(200).json({ garageId, removedSpotIds: spotsToRemove });
        } else {
          res.status(200).json({
            message:
              'No changes needed. Requested spots are the same as current spots.',
            garageId,
          });
        }
      } catch (error) {
        console.error('Error updating garage parking spots:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },
};
