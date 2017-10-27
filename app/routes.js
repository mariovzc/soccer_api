module.exports = function (app, express) {
  let User = require('./models/user') // get our mongoose model
  let jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
  let axios = require('axios')
  // =======================
  // routes ================
  // =======================
  // basic route
  // API ROUTES -------------------
  // we'll get to these in a second

  // get an instance of the router for api routes
  let apiRoutes = express.Router()
  const config = {
    headers: {
      'X-Auth-Token': '8a20e4c9c79446ac8b913a5140578f14',
      'X-Response-Control': 'minified'
    }
  }

  // route middleware to verify a token
  function isLoggedIn (req, res, next) {
      // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token']
    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function (err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded
          next()
        }
      })
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
  }

  // route to show a random message (GET http://localhost:8080/api/)
  apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' })
  })

  apiRoutes.post('/users', function (req, res) {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      leage: req.body.leage
    })
    newUser.save(function (err) {
      if (err) {
        res.status(400)
        res.json({success: false})
      }

      console.log('User saved successfully')
      res.json({ success: true })
    })
  })

  // route to return all users (GET http://localhost:8080/api/users)
  apiRoutes.get('/user', isLoggedIn, function (req, res) {
    const token = req.body.token || req.query.token || req.headers['x-access-token']    
    if (token) {
      User.find({
        token: token
      }, function (err, users) {
        if (err) throw err
        res.json(users)
      })
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
  })
  //  AUTHENTICATE USER
  apiRoutes.post('/authenticate', function (req, res) {
    // find the user
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) throw err
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' })
      } else if (user) {
        // check if password matches
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' })
        } else {
          // if user is found and password is right
          // create a token with only our given payload
          // we don't want to pass in the entire user since that has the password
          var token = jwt.sign({id: user.id}, app.get('superSecret'))
          // return the information including token as JSON
          if (user) {
            user.token = token
            user.save()
          }
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          })
        }
      }
    })
  })
  apiRoutes.get('/all', isLoggedIn, function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    axios.get('http://api.football-data.org/v1/soccerseasons', config)
    .then(function (response) {
      res.json(response.data)
    })
  })
  apiRoutes.get('/leage/:id', isLoggedIn, function (req, res) {
    axios.get('http://api.football-data.org/v1/soccerseasons/' + req.params.id + '/leagueTable', config)
    .then(function (response) {
      res.json(response.data)
    })
  })
  apiRoutes.get('/team/:id', isLoggedIn, function (req, res) {
    axios.get('http://api.football-data.org/v1/soccerseasons/' + req.params.id + '/teams', config)
    .then(function (response) {
      res.json(response.data)
    })
  })
  app.use('/api', apiRoutes)
}
