const signupForm = document.getElementById('signupForm');
const errorMessageDiv = document.getElementById('error-message');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();  

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

     
    axios.post('/api/v1/', formData)
        .then(response => {
            window.location.href = `/2fa?username=${formData.username}`; 
        })
        .catch(error => {
             
            const errorMsg = error.response?.data?.message || 'An error occurred. Please try again.';
            showErrorMessage(errorMsg);
        });
});

 
function showErrorMessage(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

 
function isFirstLetterUppercase(name) {
    return /^[A-Z]/.test(name);
}

 
function isPasswordValid(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}