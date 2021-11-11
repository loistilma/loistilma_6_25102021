var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const { handleError } = require('./helpers/error.helper')

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

app.use((err, req, res, next) => {
  handleError(err, res)
})

module.exports = app
