const express = require('express')
const path = require('path')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const app = express()
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

app.use(cors({
  origin: 'inviflow.n00bs.io'
}))

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:4200/api/v1/google/redirect/',
  scope: ['profile', 'email']
},
function (accessToken, refreshToken, profile, done) {
  return done(null, profile)
}
))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  if (user) done(null, user)
})

passport.deserializeUser(function (id, done) {
  done(null, id)
})

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', require('./routes/apiRouter'))

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
