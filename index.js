require('dotenv').config();
const express = require('express');
const cors = require('cors');
const accountRouter = require('./account_routes/router');
const valetRouter = require('./valet_routes/router');
const loginRouter = require('./login_routes/router');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/', accountRouter);
app.use('/', valetRouter);
app.use('/', loginRouter);

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server');
  } else {
    console.log('Server starting on port', port);
  }
});
