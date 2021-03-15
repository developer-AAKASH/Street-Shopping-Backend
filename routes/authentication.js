const express = require("express");
const { check } = require('express-validator');
const routes = express.Router();
const { signIn, signUp, signOut } = require("../controllers/authentication");

routes.post(
    "/signup",
    [
        check("firstName").isLength({ min: 3, max: 50 }).withMessage("firstname must be greater than 3 !!"),
        check("lastName").isLength({ min: 3, max: 50 }).withMessage("lastname must be greater than 3 !!"),
        check("emailId").isLength({ min: 6, max: 50 }).withMessage("email must be greater than 6 !!"),
        check("password").isLength({ min: 8, max: 20 }).withMessage("password length should be between 8 to 20."),
        check("contactNo").isLength({ min: 10, max: 10 }).withMessage("contact no length should excat 10."),
        check("emailId").isEmail().withMessage("email is not valid...")
    ],
    signUp
);

routes.post(
    "/signin",
    [
        check("emailId").isLength({ min: 6, max: 50 }).withMessage("email must be greater than 6 !!"),
        check("password").isLength({ min: 8, max: 20 }).withMessage("password length should be between 8 to 20."),
        check("emailId").isEmail().withMessage("email is not valid...")
    ],
    signIn
);

routes.get(
    "/signout",
    signOut
);


module.exports = routes;