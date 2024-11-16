const verifyForm = document.getElementById('verifyForm');
const errorMessageDiv = document.getElementById('error-message');
 
verifyForm.addEventListener('submit', async function(event) {
    event.preventDefault();  

    const otp = document.getElementById('otp').value;

    
    errorMessageDiv.style.display = 'none';

     
    if (otp.length !== 6) {
        errorMessageDiv.textContent = "OTP must be 6 digits!";
        errorMessageDiv.style.display = 'block';
        return;
    }

    try {
         
        const response = await axios.post(`/api/v1/verify/${username}`, { token: otp });

         
        if (response.data.success) {
            window.location.href = '/home'; 
        }
    } catch (error) {
         
        const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        errorMessageDiv.textContent = errorMessage;
        errorMessageDiv.style.display = 'block';
    }
});