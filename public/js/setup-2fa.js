window.onload = function() {
    axios.get(`/api/v1/setup/${username}`)
        .then(response => { 
            const { qrCodeUrl } = response.data;
            const qrCodeImage = document.getElementById('qrCode');
            qrCodeImage.src = qrCodeUrl;
            qrCodeImage.classList.remove('d-none'); // Show QR code
            document.getElementById('error-message').style.display = 'none'; // Hide error message
        })
        .catch(error => {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const errorDiv = document.getElementById('error-message');
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block'; // Show error message
                document.getElementById('setup-content').style.display = 'none'; // Hide content
            }
            console.error('Error fetching 2FA setup data:', error);
        });
}
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
            window.location.href = '/home'; // Change to desired success redirect page
        }
    } catch (error) {
        // Handle server errors
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        errorMessageDiv.textContent = errorMessage;
        errorMessageDiv.style.display = 'block';
    }
});
function handleLaterSecurity(event) {
        event.preventDefault(); 

        // Send an axios request to notify the server
        axios.put(`/api/v1/skip/${username}`)
            .then(response => {
                window.location.href = '/home';
            })
            .catch(error => {
                console.error('Error skipping 2FA setup:', error);
        });
}
function handleLater(event) {
    event.preventDefault(); 

    // Send an axios request to notify the server
    axios.put(`/api/v1/skip/${username}`)
        .then(response => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error skipping 2FA setup:', error);
    });
}