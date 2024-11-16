document.getElementById('createPortfolioForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const images = document.getElementById('images').files;

    // Clear previous messages
    const messageContainer = document.getElementById('message');
    messageContainer.innerHTML = '';

    if (images.length === 0) {
        messageContainer.innerHTML = '<div class="alert alert-warning">Please select at least one image.</div>';
        return;
    }

    // Create FormData to send as multipart/form-data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    // Append images to FormData
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const response = await axios.post('/api/v2/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Show success message
        messageContainer.innerHTML = `<div class="alert alert-success">${response.data.message}</div>`;
        document.getElementById('createPortfolioForm').reset(); // Optionally reset form fields
    } catch (error) {
        console.error(error);
        // Show error message
        messageContainer.innerHTML = '<div class="alert alert-danger">Failed to create portfolio item</div>';
    }
});