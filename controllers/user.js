const dbConnection = require("../configuration/DB-Config");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const {
    qGetAllUsers,
    qGetUserByA,
    qUpdateUser,
    qUpdateProfileImage,
    qForgotPassword
} = require("../models/UserQuries");

exports.getAllUsers = ( req, res )=>{
    console.log("Inside getAllusers...");
    dbConnection.query( qGetAllUsers(), ( error, dUsers, field )=>{
        if( error ){
            return res.json(error);
        } else{
            let users = [];
            dUsers.forEach( user => {
                users.push( user );
            });

            return res.status(200).json(users);
        }
    });
};

exports.getUserByA = ( req, res )=>{
    if( req.params.fieldName && req.params.value ){
        const columnName = req.params.fieldName;
        const byValue = req.params.value;

        dbConnection.query(
            qGetUserByA(columnName.trim() ),
            [ byValue ],
            ( error, userData, fields )=>{
                console.log(userData);
                if( error || ( userData.length === 0 ) ){
                    return res.status(402).json({
                        error: "Data with given parameter doesn't exist..."
                    });
                } else{
                    if( userData.length === 1 ){
                        const user = new User(userData);
                        return res.status(200).json(userData);
                    } else{
                        const users = [];
                        userData.forEach( user => {
                            users.push( user );
                        });

                        return res.status(200).json(users);
                    }
                }
            }
        );
    } else{
        res.status(402).json({
            error: "Please provide enough parameters..."
        });
    }
};

exports.updateUser = ( req, res )=>{
    const verror = validationResult( req );

    if( verror.isEmpty() ){
        const userId = req.params.userId;
        console.log(userId);
        const user = new User(req.body);
        console.log(user);
        let { firstName, lastName, contactNo } = user;

        dbConnection.query(
            qUpdateUser(),
            [ firstName, lastName, contactNo, userId ],
            ( error, response, fields )=>{
                if( error ){
                    console.log(error);
                    console.log(response);
                    res.status(402).json({
                        error: "Error while updating the data..."
                    });
                } else{
                    console.log(error);
                    console.log(response);
                    res.status(200).json({
                        message: "User data updated succesfuly..."
                    });
                }
            }
        );
    } else{
        return res.status(422).json({
            error: verror.array()[0].msg
        });
    }
};

exports.updateProfileImage = ( req, res )=>{
    const verror = validationResult( req );

    if( verror.isEmpty() ){
        const userId = req.params.userId;

        const user = new User(req.body);
        const { profileImage } = user;
        console.log(user);

        dbConnection.query(
            qUpdateProfileImage(),
            [ profileImage, userId ],
            ( error, result, fields )=>{
                if( error ){
                    console.log(error);
                    res.status(402).json({
                        error: "Unable to update the image..."
                    });
                } else{
                    console.log(result);
                    res.status(200).json({
                        message: "User's profile image updated succesfuly..."
                    });
                }
            }
        );
    } else{
        return res.status(422).json({
            error: verror.array()[0].msg
        });
    }
    
};

exports.updatePassword = ( req, res )=>{
    const verror = validationResult( req );

    if( verror.isEmpty() ){
        const userId = req.params.userId;
        console.log(userId);
        console.log(req.body);
        const user = new User(req.body);
        let { password } = user;
        console.log(user);

        bcrypt.hash( password, parseInt(process.env.SALT_ROUNDS), ( error, hash )=>{
            if( error ){
                console.log("Bcrypt ->", error );
            } else{
                // console.log(hash);
                password = hash;
                // console.log(password);
                dbConnection.query(
                    qForgotPassword(),
                    [ password, userId ],
                    ( error, result, fields )=>{
                        if( error ){
                            console.log(error);
                            res.status(402).json({
                                error: "Error while changing password..."
                            });
                        } else{
                            res.status(200).json({
                                message: "Password changed succenfuly !!"
                            });
                        }
                    }
                );
            }
        });
    } else{
        return res.status(422).json({
            error: verror.array()[0].msg
        });
    }
};