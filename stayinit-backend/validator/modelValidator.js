const validator = require('validator');

const emailValidator = (email) => {
    // validates an email
    // example: abc.xyz@xyz
    return validator.isEmail(email);
};
const passwordValidator = (password) => {
    // password should be at least 8 chars long 
    // and should contain at least one uppercase, one lowercase, one number and one special character
    return validator.isStrongPassword(password);
};

const phoneNumberValidator = (phoneNumber) => {
    // example: +91 9876543210
    return validator.isMobilePhone(phoneNumber);
};

const usernameValidator = (username) => {
    // allows letters, numbers and "-"
    // example: abc-xyz
    return /^[a-zA-Z0-9-]+$/.test(username);
};

const linkValidator = (link) => {
    // validates a url
    return validator.isURL(link);
}

const positiveNumberValidator = (price) => {
    // price should be positive and should be numeric
    return price >= 0 && validator.isNumeric(price);
}

const pincodeValidator = (pincode) => {
    return validator.isNumeric(pincode) && pincode.toString().length === 6;
}

module.exports = {
    emailValidator,
    passwordValidator,
    phoneNumberValidator,
    usernameValidator,
    linkValidator,
    positiveNumberValidator,
    pincodeValidator,
};

