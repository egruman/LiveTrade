var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([{"word1":"pimp"},{"word1":"hoe"},{"word1":"damm"}]);
});

module.exports = router;
