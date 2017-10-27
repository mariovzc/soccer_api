module.exports = function (app, express) {
  let User = require('./models/user') // get our mongoose model
  let jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
  // =======================
  // routes ================
  // =======================
  // basic route
  // API ROUTES -------------------
  // we'll get to these in a second

  // get an instance of the router for api routes
  let apiRoutes = express.Router()
  // TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
  // TODO: route middleware to verify a token

  // route to show a random message (GET http://localhost:8080/api/)
  apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  apiRoutes.post('/user/new', function (req, res) {
    const newUser = new User({
      name: req.body.name,
      password: req.body.password,
      leage: req.body.leage
    })
    newUser.save(function (err) {
      if (err) throw err
      console.log('User saved successfully')
      res.json({ success: true })
    })
  })

  // route to return all users (GET http://localhost:8080/api/users)
  apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
      res.json(users)
    })
  })
  //  AUTHENTICATE USER
  apiRoutes.post('/authenticate', function (req, res) {
    // find the user
    User.findOne({
      name: req.body.name
    }, function (err, user) {
      if (err) throw err
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' })
      } else if (user) {
        // check if password matches
        if (user.password !== req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' })
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          var token = jwt.sign(toString('hex'), app.get('superSecret'))
          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          })
        }
      }
    })
  })
  app.use('/api', apiRoutes)
}
