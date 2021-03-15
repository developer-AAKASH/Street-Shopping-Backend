const express = require("express");
const { check } = require("express-validator");
const routes = express.Router();
const { getAllUsers, getUserByA, updateUser, updatePassword, updateProfileImage } = require("../controllers/user");

routes.get(
    "/users",
    getAllUsers
);

routes.get(
    "/user/:fieldName/:value",
    getUserByA
);

routes.put(
    "/user/:userId",
    [
        check("firstName").isLength({ min: 3, max: 50 }).withMessage("firstname must be greater than 3 !!"),
        check("lastName").isLength({ min: 3, max: 50 }).withMessage("lastname must be greater than 3 !!"),
        check("contactNo").isLength({ min: 10, max: 10 }).withMessage("contact no length should excat 10."),
    ],
    updateUser
);

routes.put(
    "/user/password/:userId",
    [
        check("password").isLength({ min: 8, max: 20 }).withMessage("password length should be between 8 to 20."),
    ],
    updatePassword
);

routes.put(
    "/user/image/:userId",
    [
        check("profileImage").isLength({ min: 8, max: 20 }).withMessage("profileImage can not be empty."),
    ],
    updateProfileImage
);

module.exports = routes;