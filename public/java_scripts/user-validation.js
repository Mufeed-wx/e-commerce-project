var cnameError = document.getElementById('companyname-error');
var nameError = document.getElementById('name-error');
var emailError = document.getElementById('email-error');
var mobileError = document.getElementById('phone-error');
var passError = document.getElementById('pass-error');
var confirmPassError = document.getElementById('confirmPass-error');
var submitError = document.getElementById('submit-error');
var submitErrorAddress = document.getElementById('submit-error-address');
var oldpassError = document.getElementById('old-pass-error');

var pinError = document.getElementById('pin-error')
var streetError = document.getElementById('street-error');
var landmarkError = document.getElementById('landmark-error');
var cityError = document.getElementById('city-error');
var countryError = document.getElementById('country-error');
var stateError = document.getElementById('state-error');



function validateCompanyName() {
    var name = document.getElementById('cname').value;

    if (name.length == 0) {
        cnameError.innerHTML = '**Company Name is required';
        return false
    }
    if ((name.length <= 4) || (name.length > 20)) {
        cnameError.innerHTML = '**Name length must be between 5 and 20';
        return false
    }
    cnameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}



function validateName() {
    var name = document.getElementById('name').value;

    if (name.length == 0) {
        nameError.innerHTML = '**Name is required';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        nameError.innerHTML = '**Name length must be between 3 and 20';
        return false
    }
    nameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validatePhone() {
    var mobile = document.getElementById('phone').value;

    if (mobile.length == 0) {
        mobileError.innerHTML = '**Phone number is required';
        return false
    }
    if (mobile.length != 10) {
        mobileError.innerHTML = '**Phone number should be 10 digits';
        return false
    }
    if (!mobile.match(/^[0-9]{10}$/)) {
        mobileError.innerHTML = '**Only digits please';
        return false
    }
    mobileError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateEmail() {
    var email = document.getElementById('email').value;

    if (email.length == 0) {
        emailError.innerHTML = '**Email is required';
        return false
    }
    if (email.indexOf('@') <= 0) {
        emailError.innerHTML = '**Invalid email format';
        return false
    }
    if ((email.charAt(email.length - 4) != '.') && (email.charAt(email.length - 3) != '.')) {
        emailError.innerHTML = '**invalid email format ';
        return false
    }
    emailError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validatePassword() {
    var pass = document.getElementById('Password').value;

    if (pass.length == 0) {
        passError.innerHTML = '**Password is required';
        return false
    }
    if (pass.length < 8) {
        passError.innerHTML = '**Minimum password length must be 8';
        return false
    }
    passError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateOldPassword() {
    var pass = document.getElementById('Old_Password').value;

    if (pass.length == 0) {
        oldpassError.innerHTML = '**Password is required';
        return false
    }
    if (pass.length < 8) {
        oldpassError.innerHTML = '**Minimum password length must be 8';
        return false
    }
    oldpassError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateConfirm() {
    var confirmPass = document.getElementById('Re_Password').value;
    var pass = document.getElementById('Password').value;

    if (confirmPass.length == 0) {
        confirmPassError.innerHTML = '**Confirm password is required';
        return false
    }
    if (pass != confirmPass) {
        confirmPassError.innerHTML = '**Password doesnt matches';
        return false
    }
    confirmPassError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateForm() {
    if (!validateName() || !validatePhone() || !validateEmail() || !validatePassword() || !validateConfirm()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 3000)
        return false;
    }
}

// Validation of login form

function validateEmailSign() {
    var email = document.getElementById('emailin').value;

    if (email.length == 0) {
        emailError.innerHTML = '**Email is required';
        return false
    }
    if (email.indexOf('@') <= 0) {
        emailError.innerHTML = '**Invalid email format';
        return false
    }
    if ((email.charAt(email.length - 4) != '.') && (email.charAt(email.length - 3) != '.')) {
        emailError.innerHTML = '**invalid email format ';
        return false
    }
    emailError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validatePasswordsign() {
    var pass = document.getElementById('passwordin').value;

    if (pass.length == 0) {
        passError.innerHTML = '**Password is required';
        return false
    }
    if (pass.length <= 3) {
        passError.innerHTML = '**Minimum password length must be 8';
        return false
    }
    passError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}



function validatePincode() {
    var pin = document.getElementById('pincode').value;

    if (pin.length == 0) {
        pinError.innerHTML = '**pin number is required';
        return false
    }
    if (pin.length <= 5) {
        pinError.innerHTML = '**Pin number should be 6 digits';
        return false
    }
    if (!pin.match(/^[0-9]{6}$/)) {
        pinError.innerHTML = '**Only digits please';
        return false
    }
    pinError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}


function validateStreet() {
    var street = document.getElementById('street').value;

    if (street.length == 0) {
        streetError.innerHTML = 'street is required';
        return false
    }

    streetError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateLandmark() {
    var name = document.getElementById('landmark').value;

    if (name.length == 0) {
        landmarkError.innerHTML = 'landmark is required';
        return false
    }
    landmarkError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateCity() {
    var name = document.getElementById('city').value;

    if (name.length == 0) {
        cityError.innerHTML = 'city is required';
        return false
    }
    if (!name.match(/^[A-Za-z]+$/)) {
        cityError.innerHTML = '**Only Charector please';
        return false
    }

    cityError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateCountry() {
    var name = document.getElementById('country').value;

    if (name.length == 0) {
        countryError.innerHTML = 'country is required';
        return false
    }
    if (!name.match(/^[A-Za-z]+$/)) {
        countryError.innerHTML = '**Only Charector please';
        return false
    }
    countryError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateState() {
    var name = document.getElementById('state').value;

    if (name.length == 0) {
        stateError.innerHTML = 'state is required';
        return false
    }
    if (!name.match(/^[A-Za-z]+$/)) {
        stateError.innerHTML = '**Only Charector please';
        return false
    }
    stateError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateaddressForm() {
    if (!validateState() || !validateCountry() || !validateCity() || !validateLandmark() || !validateStreet() || !validatePincode() || !validateName() || !validatePhone()) {
        submitError.style.display = 'block'
        submitErrorAddress.innerHTML = 'Please fill the form';
        setTimeout(function () { submitErrorAddress.style.display = 'none' }, 3000)
        return false;
    }

}