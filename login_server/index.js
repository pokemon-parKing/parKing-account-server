require('dotenv').config();
const express = require('express');
const path = require('path');
const router = require('../login_routes/router');

const app = express();
const port = process.env.LOGIN_PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public/dist')));
//POST MVP: implement a middleware function to access cookies saved in the browser to expidite login process
app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//used dependencies: express, @supabase/supabase-js, path, dotenv, nodemon
//scripts: "server-dev": "nodemon -w index.js",