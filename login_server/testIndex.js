const express = require('express');
const path = require('path');
const router = require('../login_routes/router');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public/dist')));
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//used dependencies: express, @supabase/supabase-js, path, dotenv, nodemon
//scripts: "server-dev": "nodemon -w index.js",