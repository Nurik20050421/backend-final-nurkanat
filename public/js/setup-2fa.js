window.onload = function() {
    axios.get(`/api/v1/setup/${username}`)
        .then(response => { 
            const { qrCodeUrl } = response.data;
            const qrCodeImage = document.getElementById('qrCode');
            qrCodeImage.src = qrCodeUrl;
            qrCodeImage.classList.remove('d-none');  
            document.getElementById('error-message').style.display = 'none';  
        })
        .catch(error => {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                const errorDiv = document.getElementById('error-message');
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';  
                document.getElementById('setup-content').style.display = 'none';  
            }
            console.error('Error fetching 2FA setup data:', error);
        });
}
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
function handleLaterSecurity(event) {
        event.preventDefault(); 

        
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

    
    axios.put(`/api/v1/skip/${username}`)
        .then(response => {
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Error skipping 2FA setup:', error);
    });
}