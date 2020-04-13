const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')

// Fetch all tasks from an orginization
router.get('/organization/:no/tasks/all/', apiController.orgTasks)

// Add new task
router.post('/organization/:no/tasks/new/', apiController.orgNewTask)

// fetch a specific task
router.get('/organization/:no/tasks/:id/', apiController.orgTask)

// Edit task
router.put('/organization/:no/tasks/:id/', apiController.orgEditTask)

// delete task
router.delete('/organization/:no/tasks/:id/', apiController.orgDeleteTask)

// Fetch all users from an organization
router.get('/organization/:no/users/all/', apiController.orgUsers)

// TODO:Not fixed yet
// Assign a user to an organization
router.post('/organization/:no/users/adduser/', apiController.assignUser)

// TODO: Not fixed yet
// Fetch all tasks from a user
router.get('/user/:no/tasks/all/', apiController.userTasks)

// Exchange Code to Auth code
router.get('/authenticate/', authController.requestCode)
router.post('/authenticate/', authController.exchangeCode)

module.exports = router
