module.exports.validateRegisterInput = (
    username,
    email,
    password,
    passwordConfirm
) => {
    // TODO: cite
    var alphanumericRegex = /^[0-9a-zA-Z]+$/;
    // TODO: cite
    var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const errors = {}
    if (username.trim() === '')
        errors.username = 'Username must be nonempty';
    if (!username.match(alphanumericRegex))
        errors.username = 'Username must be consist of only characters and numbers';
    if (password.trim() === '')
        errors.password = 'Password must be nonempty';
    if (!(password === passwordConfirm))
        errors.password = 'Passwords do not match';
    if (email.trim() === '')
        errors.email = 'Email must be nonempty';
    if (email.toLowerCase().match(emailRegex))
        errors.email = 'Email must be valid email address';
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}