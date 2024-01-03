
const { Client } = require('@googlemaps/google-maps-services-js');

const google = new Client({});

// takes in an address in some form (string based is fine)
//copied from the reservations server, I dont think it makes sense to query the reservations server when this code/api is relatively simple to implement
const createGeocode = (address) => {
  return new Promise((resolve, reject) => {
    const query = {
      params: {
        key: process.env.GOOGLE_KEY,
        address
      }
    };
    google.geocode(query)
      .then(results => {
        if (results.data.status !== 'OK') {
          return reject('No results');
        }
        const coord = JSON.stringify(results.data.results[0].geometry.location);
        return resolve(coord);
      })
  })
};

const geocodeMiddleware = (req, res, next) => {
  //need to call the reservations server and add properties to the req.body object for the lat and lng based off of what is returned from the geocode api
  //build the whole address url
  const address = req.body.address + ' ' + req.body.city + ' ' + req.body.state + ' ' + req.body.zip;
  //call the google API with the address
  createGeocode(address)
    .then(coord => {
      //add the lat and lng properties to the req.body object
      const parsedCoord = JSON.parse(coord);
      req.body.lat = parsedCoord.lat;
      req.body.lng = parsedCoord.lng;
      next();
    })
    .catch(err => {
      console.error('Error creating geocode:', err);
      res.sendStatus(500);
    });
};

module.exports = geocodeMiddleware;
