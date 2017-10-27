module.exports = function (app, express) {
  var User = require('./models/user') // get our mongoose model
  var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens  
  // =======================
  // routes ================
  // =======================
  // basic route
  // API ROUTES -------------------
  // we'll get to these in a second

  // get an instance of the router for api routes
  var apiRoutes = express.Router()
  // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
  // TODO: route middleware to verify a token

  // route to show a random message (GET http://localhost:8080/api/)
  apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  // route to return all users (GET http://localhost:8080/api/users)
  apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
      res.json(users)
    })
  })
  app.use('/api', apiRoutes)
}
