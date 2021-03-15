const dbConnection = require("../configuration/DB-Config");
const { DELIVERY_BOY, USER, VENDOR, ADMIN } = require("../configuration/UserRoles");
const User = require("../models/User");
const {
    qSignUp, qSignIn
} = require("../models/UserQuries");
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const generateUniqueId = require("generate-unique-id");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.signIn = ( req, res )=>{
    const validationErrors = validationResult( req );

    if( validationErrors.isEmpty() ){
        const user = new User( req.body );

        const { emailId, password } = user;
        dbConnection.query(
            qSignIn(),
            [ emailId ],
            ( errorDB, userD, fields )=>{
                // if user with given emailId will not exist then this userD will come empty
                // which is not error so if its empty means no user exist with this data, still 
                // it goes to else and error will be occured because we are accecing userD[0]
                // of null so we have to do the check for that also and with or we are
                // just checking that condition...
                if( errorDB || ( userD.length === 0) ){
                    res.status(422).json({
                        message: "email or password does not match... "
                    });
                } else{
                    const dUser = new User(userD[0]);

                    bcrypt.compare( password, dUser.password, ( errorBc, result )=>{
                        console.log("Bcrypt-response");    
                        if( result === true ){
                            const token = jwt.sign({ id: dUser.userId }, process.env.SECRET );
                            res.cookie( "token", token, { expire: new Date() + 5 });
                            res.cookie( "user", dUser, { expire: new Date() + 5 });

                            res.status(200).json({
                                token,
                                message: "Signin succesfuly !! "
                            });
                        } else{
                            res.status(422).json({
                                message: "email or password does not match... "
                            });
                        }
                    });
                }
            }
        );
    } else{
        return res.status(422).json({
            error: validationErrors.array()[0].msg
        });
    }
};

exports.signUp = ( req, res )=>{
    const verror = validationResult( req );

    if( verror.isEmpty() ){
        const user = new User( req.body );
        let { userId, firstName, lastName, emailId, password, contactNo } = user;

        userId = generateUniqueId({
            length: 20
        });
        // console.log(process.env.SALT_ROUNDS);

        bcrypt.hash( password, parseInt(process.env.SALT_ROUNDS), ( error, hash )=>{
            if( error ){
                console.log("Bcrypt", error );
            } else{
                // console.log(hash);
                password = hash;
                // console.log(password);
                dbConnection.query(
                    qSignUp(),
                    [ userId, firstName, lastName, emailId, password, contactNo ],
                    ( error, user, fields )=>{
                        if( error ){
                            console.log(error);
                            res.status(402).json({
                                error: "Error while adding user..."
                            });
                        } else{
                            res.status(200).json({
                                message: "User added succenfuly !!"
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

exports.signOut = ( req, res )=>{
    res.clearCookie("token");
    res.clearCookie("user");
    res.status(200).json({
        message: "User signout succesfuly..."
    });
};

const isSignedInM = ()=>{
    if( req.cookies.token ){
        console.log(req.cookies.user);
        console.log("signined");
        return true;
    }
    return false;
};

const isUserM = ()=>{
    if( isSignedInM() ){
        const user = req.cookies.user;
        if( user.userRole === USER ){
            return true;
        } else{
            return false;
        }
    }
    return false;
};

const isAdminM = ()=>{
    if( isSignedInM() ){
        const user = req.cookies.user;
        if( user.userRole === ADMIN ){
            return true;
        } else{
            return false;
        }
    }
    return false;
};

const isVendorM = ()=>{
    if( isSignedInM() ){
        const user = req.cookies.user;
        if( user.userRole === VENDOR ){
            return true;
        } else{
            return false;
        }
    }
    return false;
};

const isDeliveryBoyM = ()=>{
    if( isSignedInM() ){
        const user = req.cookies.user;
        if( user.userRole === DELIVERY_BOY ){
            return true;
        } else{
            return false;
        }
    }
    return false;
};

exports.isSignedIn = ( req, res, next )=>{
    if( !isSignedInM() ){
        console.log(req.cookies.user);
        console.log("signined");
        return res.status(403).json({
            error: "You haven't signed in..."
        });
    }

    next();
};

exports.isAdmin = ( req, res, next )=>{
    if( !isAdminM() ){
        return res.status(403).json({
            error: "You are not a Admin, Access Denied..."
        });
    }

    next();
};

exports.isVendor = ( req, res, next )=>{
    if( isVendorM() ){
        return res.status(403).json({
            error: "You are not a Vendor, Access Denied..."
        });
    }

    next();
};

exports.isDeliveryBoy = ( req, res, next )=>{
    if( isDeliveryBoyM() ){
        return res.status(403).json({
            error: "You are not a Delivery Boy, Access Denied..."
        });
    }

    next();
};

exports.isUser = ( req, res, next )=>{
    if( isUserM() ){
        return res.status(403).json({
            error: "You are not a User, Access Denied..."
        });
    }
    next();
};

exports.isAuthenticated = ( req, res, next )=>{
};