const express = require('express');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(limiter)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://Ony:muscle@cluster0.jnqu2js.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(bodyParser.json());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;

//rate limit, helmet , mongose sanitize