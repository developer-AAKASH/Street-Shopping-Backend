class User{
    constructor({
        userId, 
        firstName,
        lastName, 
        emailId,
        password,
        userRole,
        profileImage,
        contactNo,
        createdAt,
        updatedAt
    }){
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailId = emailId;
        this.password = password;
        this.userRole = userRole;
        this.profileImage = profileImage;
        this.contactNo = contactNo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = User;