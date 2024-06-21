const createError = require("http-errors");
const { userSchema } = require("../helpers/validation.helper.js");
const User = require("../models/user.model.js");
const jwtHelper = require("../helpers/jwt.helper.js");
const userHelper = require("../helpers/user.helper.js");
const bcrypt = require("bcryptjs");



module.exports = {

  
  async registerUser(req, res, next) {
    try {
      await userSchema.validateAsync(req.body);
      let password = await userHelper.encryptPassword(req.body.password);

      let userObj = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        userName: req.body.userName,
        password: password,
        email: req.body.email,
      });
      let savedData = await userObj.save();
      res.redirect("/login");
      // res.status(201).json({
      //   message: "Success",
      //   data: savedData,
      //   status: 1,
      // });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { userName, password } = req.body;
      if (!userName || !password)
        throw createError.BadRequest("UserName And Password Is Required");

      let userExist = await User.findOne({
        $and: [
          {
            userName: userName,
          },
        ],
      });

      if (userExist && (await bcrypt.compare(password, userExist.password))) {
        let { id } = userExist._id;
        const token = await jwtHelper.jwtTokenGenerator({
          id,
          userName,
        });
        res.cookie("token", token, { httpOnly: true });
        res.redirect('/select');
      //  res.redirect("/chat");
        // res.status(200).json({
        //   message: "Success",
        //   userDetails: userExist,
        //   accessToken: token,
        // });
      } else {
        res.redirect("/login");
        // res.status(400).json({
        //   message: "UserName Or Password Incorrect",
        // });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },


  async userRegistration(req, res, next) {
    try {
      await userSchema.validateAsync(req.body);
      let password = await userHelper.encryptPassword(req.body.password);

      let userObj = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        userName: req.body.userName,
        password: password,
        email: req.body.email,
      });
      let savedData = await userObj.save();
   
      res.status(201).json({
        message: "Success",
        data: savedData,
        status: 1,
      });
    } catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },

  async userLogin(req, res, next) {
    try {
      const { userName, password } = req.body;
      if (!userName || !password)
        throw createError.BadRequest("UserName And Password Is Required");

      let userExist = await User.findOne({
        $and: [
          {
            userName: userName,
          },
        ],
      });

      if (userExist && (await bcrypt.compare(password, userExist.password))) {
        let { id } = userExist._id;
        const token = await jwtHelper.jwtTokenGenerator({
          id,
          userName,
        });
     
 
        res.status(200).json({
          message: "Success",
          userDetails: userExist,
          accessToken: token,
        });
      } else {
   
        res.status(400).json({
          message: "UserName Or Password Incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
};
