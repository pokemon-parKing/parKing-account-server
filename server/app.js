require('dotenv').config();
const express = require('express');
const cors = require('cors');
const accountRouter = require('./routes/accountRouter');
const valetRouter = require('./routes/valetRouter');
const loginRouter = require('./routes/loginRouter');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use('/user', accountRouter);
app.use('/valet', valetRouter);
app.use('/login', loginRouter);

app.listen(port, (err) => {
  if (err) {
    console.log('Error starting server');
  } else {
    console.log('Server starting on port', port);
  }
});
