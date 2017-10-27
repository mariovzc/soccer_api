var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var mongoose = require('mongoose')

var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
var config = require('./config') // get our config file
var User = require('./app/models/user') // get our mongoose model

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 3000 // used to create, sign, and verify tokens
mongoose.connect(config.database) // connect to database
app.set('superSecret', config.secret) // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// use morgan to log requests to the console
app.use(morgan('dev'))

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api')
})

// API ROUTES -------------------
// we'll get to these in a second

app.get('/setup', function (req, res) {
  // create a sample user
  var newUser = new User({
    name: 'Mario',
    password: '123456',
    leage: 445
  })
  // save the sample user
  newUser.save(function (err) {
    if (err) throw err

    console.log('User saved successfully')
    res.json({ success: true })
  })
})

// =======================
// start the server ======
// =======================
app.listen(port)
console.log('Magic happens at http://localhost:' + port)
