const router = require("express").Router();

router.get("/", function (req, res) {
  res.send("Test Route");
});

module.exports = router;
