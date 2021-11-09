var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

require('dotenv').config()
require('./config/db.config')()



var usersRouter = require('./routes/user.route')
var saucesRouter = require('./routes/sauce.route')

var app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', usersRouter)
app.use('/api/sauces', saucesRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // send error response
  res.status(err.status || 500)
  res.send(err.message)
});

module.exports = app
