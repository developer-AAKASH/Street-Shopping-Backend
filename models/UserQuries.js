const comman = "SELECT * FROM user_master";

const qGetAllUsers = ()=>{
    return comman;
};

const qSignIn = ()=>{
    return comman + " WHERE emailId = ?";
};

const qSignUp = ()=>{
    return "INSERT into user_master ( userId, firstName, lastName, emailId, password, contactNo ) values ( ?, ?, ?, ?, ?, ? )";
};

const qUpdateUser = ()=>{
    return "UPDATE user_master SET firstName = ?, lastName = ?, contactNo = ? WHERE userId = ?";
};

const qForgotPassword = ()=>{
    return "UPDATE user_master SET password = ? WHERE userId = ?";
}

const qUpdateProfileImage = ()=>{
    return "UPDATE user_master SET profilePic = ? WHERE userId = ?";
}

const qGetUserByA = ( fieldName )=>{
    return comman + ` WHERE ${fieldName} = ?`;
};

module.exports = {
    qSignIn,
    qSignUp,
    qGetAllUsers,
    qUpdateUser,
    qGetUserByA,
    qUpdateProfileImage,
    qForgotPassword
};