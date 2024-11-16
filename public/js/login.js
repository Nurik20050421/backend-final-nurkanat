const loginForm = document.getElementById('loginForm');
const errorMessageDiv = document.getElementById('error-message');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };

    axios.post('/api/v1/sign', formData)
        .then(response => {
            // Check if 2FA is required
            if (response.data.isEnabled) {
                window.location.href = `/verify2fa?username=${formData.username}`;
            } else {
                window.location.href = `/home`;
            } 
    
        })
        .catch(error => {
            const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
            errorMessageDiv.textContent = errorMsg;
            errorMessageDiv.style.display = 'block';
        });
});