var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var rateLimit = require('express-rate-limit');
var compression = require('compression');
var helmet = require('helmet');
require('dotenv').config(); // Load environment variables from .env file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var financeRouter = require('./routes/finance');
var hrRouter = require('./routes/hr');
var analyticsRouter = require('./routes/analytics');
var dashboardRouter = require('./routes/dashboard');
var complianceRouter = require('./routes/compliance');

var app = express();

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX ||100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3001", "http://localhost:3000", "http://localhost:3002"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet()); 
app.use(compression());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false ,limit: '10mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(limiter);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/finance', financeRouter);
app.use('/api/hr', hrRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/compliance', complianceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
