require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const session      = require('express-session');
const passport     = require('passport');



mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/phone-store', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const passportSetup = require('./configs/passport');
passportSetup(passport);

const app = express();

// Middleware Setup
app.use(session({
  secret: 'angular auth passport secret shh',
  resave: true,
  saveUninitialized: true,
  cookie : { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// Routes
const index = require('./routes/index');
const phonesApi = require('./routes/phones-api');
const authApi = require('./routes/auth-api');
app.use('/', index);
app.use('/api', phonesApi);
app.use('/', authApi);
// This will be the default route is nothing else is caught
app.use(function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
