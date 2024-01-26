const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError')
const globalError = require('./controllers/ErrorConroller')

const tourRouter = require('./routes/tourRoutes');
const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.reuestTime = new Date().toISOString();
  next();
});

app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`,404))
});

app.use(globalError);

module.exports = app;
