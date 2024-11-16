const express = require('express');
const session = require('express-session');
require('dotenv').config();
require('./config/db');
const authRoutes = require('./routes/authRoutes');
const portfolioRouter = require('./routes/portfolioRoutes');
const path = require('path');
const flash = require('connect-flash');
const { isAuthenticated} = require('./middleware/auth');
const { isAdmin } = require('./middleware/isAdmin');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

app.set('view engine', 'ejs');
app.set('views', './pages');
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use('/api/v1', authRoutes);
app.use('/api/v2', portfolioRouter);

const CARS_API_KEY = process.env.CARS_API_KEY;
app.get('/cars', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(process.env.CARS_URL, {
      params: {offset: 0},
      headers: { 'X-Api-Key': CARS_API_KEY },
    });

      res.render('cars', { cars: response.data });
    
  } catch (error) {
    console.error('Error fetching motorcycle data:', error);
    res.status(500).send('Error fetching motorcycle data');
  }
});

const MOTORCYCLE_API_KEY = process.env.MOTORCYCLE_API_KEY;
app.get('/motorcycle', isAuthenticated, async (req, res) => {
  try {
    const response = await axios.get(process.env.MOTORCYCLE_URL, {
      params: {offset: 0},
      headers: { 'X-Api-Key': MOTORCYCLE_API_KEY },
    });

      res.render('motorcycle', { motorcycle: response.data });
    
  } catch (error) {
    console.error('Error fetching motorcycle data:', error);
    res.status(500).send('Error fetching motorcycle data');
  }
});

app.get('/csv-motorcycle', isAuthenticated, (req, res) => {
  const allMotorData = [];
  fs.createReadStream('csv_datasets/BIKEDETAILS.csv')
    .pipe(csv())
    .on('data', (row) => {
      allMotorData.push({
        selling_price: row.selling_price,
        year: row.year,
        name: row.name,
      });
    })
    .on('end', () => {
      const motorData = allMotorData.slice(0, 100);
      res.render('motorcycle-csv', { motorData });
    });
});

app.get('/csv-cars', isAuthenticated, (req, res) => {
  const allCarsData = [];
  fs.createReadStream('csv_datasets/USAcarsdatasets.csv')
    .pipe(csv())
    .on('data', (row) => {
      allCarsData.push({
        price: row.price,
        year: row.year,
        mileage: row.mileage,
        brand: row.brand,
      });
    })
    .on('end', () => {
      const carsData = allCarsData.slice(0, 100);
      res.render('cars-csv', { carsData });
    });
});

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/home');
  } else {
    res.render('login');
  }
});

app.get('/verify2fa', (req, res) => {
  const { username } = req.query;
  res.render('verify2fa', { username });
});

app.get('/2fa', (req, res) => {
  const { username } = req.query;
  res.render('2fa', { username });
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/home', isAuthenticated, (req, res) => {
  res.render('home');
});

app.get('/create', isAuthenticated, (req, res) => {
  res.render('createItem');
});

app.get('/delete', isAuthenticated, isAdmin, (req, res) => {
  res.render('deleteItem');
});

app.get('/edit', isAuthenticated, isAdmin, (req, res) => {
  res.render('editItem');
});

app.get('/error', (req, res) => {
  res.render('error', { message: req.flash('error') || 'An unknown error occurred' });
});

app.get('/enable', isAuthenticated, (req, res) => {
  const username = req.session.user.username;
  res.render('security', { username });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
