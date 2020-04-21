const express = require('express')
const router = express.Router()
const fs = require('fs')
const expressJwt = require('express-jwt')
const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')

const RSA_PUBLIC_KEY = fs.readFileSync('././credentials/jwtRS256.key.pub', 'utf8')

const checkIfAuthenticated = expressJwt({ secret: RSA_PUBLIC_KEY })

// Fetch all tasks from an orginization
router.get('/organization/:no/tasks/all/', checkIfAuthenticated, apiController.orgTasks)

// Add new task
router.post('/organization/:no/tasks/new/', checkIfAuthenticated, apiController.orgNewTask)

// fetch a specific task
router.get('/organization/:no/tasks/:id/', checkIfAuthenticated, apiController.orgTask)

// Edit task
router.put('/organization/:no/tasks/:id/', checkIfAuthenticated, apiController.orgEditTask)

// delete task
router.delete('/organization/:no/tasks/:id/', checkIfAuthenticated, apiController.orgDeleteTask)

// Fetch all users from an organization
router.get('/organization/:no/users/all/', checkIfAuthenticated, apiController.orgUsers)

// TODO:Not fixed yet
// Assign a user to an organization
router.post('/organization/:no/users/adduser/', apiController.assignUser)

// TODO: Not fixed yet
// Fetch all tasks from a user
router.get('/user/tasks/all/', checkIfAuthenticated, apiController.userTasks)

// Exchange Code to Auth code
router.get('/authenticate/', authController.requestCode)
router.post('/authenticate/', authController.exchangeCode)

module.exports = router
