const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connection = require("./config/server")
const mongoose = require('mongoose');
const sessions = require('express-session');
var hbs = require('express-handlebars')
const viewEngineHelpers = require('./helpers/view-engine-helper')
require('dotenv').config()


var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
  secret: 'secret-key',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false
}))

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs', defaultLayout: 'layouts', layoutDir: __dirname + '/views/layouts', partialsDir: __dirname + '/views/partials/', helpers: viewEngineHelpers.helpers
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', usersRouter);
app.use('/admin', adminRouter);


(async function db() {
  await connection();
})();


// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  _res.render('error/error404', { status: '404' });
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.render('error/error500', { status: '500' });
});

module.exports = app;
