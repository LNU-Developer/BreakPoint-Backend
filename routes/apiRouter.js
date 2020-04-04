const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

// Fetch all tasks from an orginization
router.get('/organization/:no/tasks/all/', apiController.orgTasks)

// Fetch all users from an organization
router.get('/organization/:no/users/all/', apiController.orgUsers)

// TODO:Not fixed yet
// Assign a user to an organization
router.post('/organization/:no/users/adduser/', apiController.assignUser)

// TODO: Not fixed yet
// Fetch all tasks from a user
router.get('/user/:no/tasks/all/', apiController.userTasks)

// fetch a specific task
router.get('/organization/:no/tasks/:id/', apiController.orgTask)

// Add new task
router.post('/organization/:no/tasks/new/', apiController.orgNewTask)

// Edit task
router.put('/organization/:no/tasks/:id/', apiController.orgEditTask)

// delete task
router.delete('/organization/:no/tasks/:id/delete/', apiController.orgDeleteTask)

module.exports = router
