const verifyForm = document.getElementById('verifyForm');
const errorMessageDiv = document.getElementById('error-message');
// Handle form submission with Axios
verifyForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const otp = document.getElementById('otp').value;

    // Clear any previous error messages
    errorMessageDiv.style.display = 'none';

    // Validate OTP length
    if (otp.length !== 6) {
        errorMessageDiv.textContent = "OTP must be 6 digits!";
        errorMessageDiv.style.display = 'block';
        return;
    }

    try {
        // Send OTP verification request to the server
        const response = await axios.post(`/api/v1/verify/${username}`, { token: otp });

        // Redirect on success
        if (response.data.success) {
            window.location.href = '/home'; 
        }
    } catch (error) {
        // Handle server errors
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        errorMessageDiv.textContent = errorMessage;
        errorMessageDiv.style.display = 'block';
    }
});