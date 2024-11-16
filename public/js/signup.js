const signupForm = document.getElementById('signupForm');
const errorMessageDiv = document.getElementById('error-message');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        username: document.getElementById('username').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
    };

    // Validation checks
    if (!isFirstLetterUppercase(formData.firstName) || !isFirstLetterUppercase(formData.lastName)) {
        showErrorMessage("First and last names should start with an uppercase letter.");
        return;
    }

    if (!isPasswordValid(formData.password)) {
        showErrorMessage("Password must be at least 8 characters long and contain at least one letter and one number.");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        showErrorMessage("Passwords do not match!");
        return;
    }

    // Submit form data using Axios
    axios.post('/api/v1/', formData)
        .then(response => {
            window.location.href = `/2fa?username=${formData.username}`; 
        })
        .catch(error => {
            // Display error message from server response
            const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
            showErrorMessage(errorMsg);
        });
});

// Function to show error message
function showErrorMessage(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

// Function to check if the first letter of a string is uppercase
function isFirstLetterUppercase(name) {
    return /^[A-Z]/.test(name);
}

// Function to check if the password is at least 8 characters and contains at least one letter and one number
function isPasswordValid(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}