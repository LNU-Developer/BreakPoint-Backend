const express = require('express')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const firebase = require('firebase-admin')

require('dotenv').config({ path: path.join(__dirname) + '/.env' })

const serviceAccount = require('./credentials/firebaseCredentials.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.databaseURL
})

const app = express()
app.use(express.json()) // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api/v1', require('./routes/apiRouter'))

// Auth error message
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err.message)
    res.status(401).send(err.message)
  }
})

app.listen(process.env.PORT, () => {
  console.log('Server running on http://localhost:' + process.env.PORT)
  console.log('Press Ctrl-C to terminate...\n')
})
