const express = require('express')
const router = express.Router()
const fs = require('fs')
const expressJwt = require('express-jwt')
const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const RSA_PUBLIC_KEY = fs.readFileSync('././credentials/jwtRS256.key.pub', 'utf8')
const firebase = require('firebase-admin')
const db = firebase.database()

// MIDDLEWARES --------------------------------------------------------------------------------------------

const checkIfAuthenticated = expressJwt({ secret: RSA_PUBLIC_KEY })

const checkifAuthorized = (req, res, next) => {
  const ref = db.ref('users/').orderByChild('email').equalTo(req.user.sub)
  ref.once('value', function (snapshot) {
    if (snapshot.exists()) {
      const user = Object.values(snapshot.val())
      const organizationString = user[0].organizations
      const tmpString = organizationString.substr(1).slice(0, -1)
      const organizationArray = tmpString.split(', ')
      if (organizationArray.includes(req.params.no)) {
        next()
      } else {
        console.log(`Unauthorized request by ${req.user.sub} on organization ${req.params.no}`)
        res.status(401).send()
      }
    } else {
      res.status(404).send()
    }
  }, function (errorObject) {
    console.log('The read failed: ' + errorObject.code)
  })
}

// ORG APIS -----------------------------------------------------------------------------------------------

// Fetch all tasks from an orginization
router.get('/organization/:no/tasks/all/', checkIfAuthenticated, checkifAuthorized, apiController.orgTasks)

// Add new task
router.post('/organization/:no/tasks/new/', checkIfAuthenticated, checkifAuthorized, apiController.orgNewTask)

// fetch a specific task
router.get('/organization/:no/tasks/:id/', checkIfAuthenticated, checkifAuthorized, apiController.orgTask)

// Edit task
router.put('/organization/:no/tasks/:id/', checkIfAuthenticated, checkifAuthorized, apiController.orgEditTask)

// delete task
router.delete('/organization/:no/tasks/:id/', checkIfAuthenticated, checkifAuthorized, apiController.orgDeleteTask)

// USER APIS -----------------------------------------------------------------------------------------------

// Fetch all organisations for a user
router.get('/user/organization/all/', checkIfAuthenticated, userController.userOrgs)

// Fetch all tasks for a user
router.get('/user/tasks/all/', checkIfAuthenticated, userController.userTasks)

// Fetch users that are have access to a specific organization
router.get('/organization/:no/users/all/', checkIfAuthenticated, checkifAuthorized, userController.orgUsers)

// TODO:Not fixed yet
// Assign a user to an organization
router.post('/organization/:no/users/adduser/', apiController.assignUser)

// AUTH APIS ----------------------------------------------------------------------------------------------

// Exchange Code to Auth code
router.get('/authenticate/', authController.requestCode)
router.post('/authenticate/', authController.exchangeCode)

// --------------------------------------------------------------------------------------------------------

module.exports = router
