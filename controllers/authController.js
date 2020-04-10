const authController = {}

authController.auth = (req, res) => {
  console.log(req.user._json)
  res.send(req.user._json)
}

module.exports = authController
