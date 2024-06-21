const router = require("express").Router();
// const jwtMiddleware = require("../middlewares/jwtMiddleware.js");
const userController = require("../controllers/user.controller.js");

/**User Routes for view */
router.post("/userRegistration", userController.registerUser);

router.post("/login", userController.login);

/**User Routes for user register and login*/
router.post("/registerUser", userController.userRegistration);

router.post("/userLogin", userController.userLogin);

module.exports = router;
