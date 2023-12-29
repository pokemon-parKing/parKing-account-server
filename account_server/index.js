const express = require('express');
const cors = require('cors');
const router = require('../account_routes/router');
const valetRouter = require('../valet_routes/router');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/', router);
app.use('/', valetRouter);

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server');
  } else {
    console.log('Server starting on port', port);
  }
});
