const express = require('express')
const router = express.Router()
const passport = require('passport')

const apiController = require('../controllers/apiController')
const authController = require('../controllers/authController')

const auth = () => {
  return (req, res, next) => {
    passport.authenticate('google', (error, user, info) => {
      if (error) res.status(400).json({ statusCode: 200, message: error })
      req.login(user, function (error) {
        if (error) return next(error)
        next()
      })
    })(req, res, next)
  }
}

// TODO: Use as middleware to check if auth
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(400).json({ statusCode: 400, message: 'not authenticated' })
}

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

// OAuth via Google
router.get('/authenticate/', auth(), (req, res) => {
  res.status(200).json({ statusCode: 200 })
})
router.get('/google/redirect/', passport.authenticate('google'), authController.auth)

module.exports = router
