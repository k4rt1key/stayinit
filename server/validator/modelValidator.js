const validator = require('validator');

const emailValidator = (email) => {
    // const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

    // Use a regex to check the basic email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (validator.isEmail(email) && emailPattern.test(email)) {
        // Extract the domain from the email address
        const [, domain] = email.split('@');

        // Check if the domain is in the allowed domains list
       
            return true; // Valid email address
    }

    return false; // Invalid email address
};


const passwordValidator = (password) => {
    // password should be at least 8 chars long 
    // and should contain at least one uppercase, one lowercase, one number and one special character
    return validator.isStrongPassword(password);
    // return true;
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

