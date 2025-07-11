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

// Routers
var userRouter = require('./routes/user');
var financeRouter = require('./routes/finance');
var hrRouter = require('./routes/hr');
var analyticsRouter = require('./routes/analytics');
var dashboardRouter = require('./routes/dashboard');
var complianceRouter = require('./routes/compliance');

// Middlewares
var authenticateUser = require('./middleware/authUser');

var app = express();

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:3001'];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  // Allow cookies to be sent with cross-domain requests
  exposedHeaders: ['set-cookie'],
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use('/api/user', userRouter);
app.use('/api/finance', authenticateUser, financeRouter);
app.use('/api/hr', authenticateUser, hrRouter);
app.use('/api/analytics', authenticateUser, analyticsRouter);
app.use('/api/dashboard', authenticateUser, dashboardRouter);
app.use('/api/compliance', authenticateUser, complianceRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = 'Error';

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
