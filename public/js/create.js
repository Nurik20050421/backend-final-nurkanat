document.getElementById('createPortfolioForm').addEventListener('submit', async function (e) {
    e.preventDefault();

     
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const images = document.getElementById('images').files;

     
    const messageContainer = document.getElementById('message');
    messageContainer.innerHTML = '';

    if (images.length === 0) {
        messageContainer.innerHTML = '<div class="alert alert-warning">Please select at least one image.</div>';
        return;
    }

    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
     
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    try {
        const response = await axios.post('/api/v2/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        
        messageContainer.innerHTML = `<div class="alert alert-success">${response.data.message}</div>`;
        document.getElementById('createPortfolioForm').reset();  
    } catch (error) {
        console.error(error);
        
        messageContainer.innerHTML = '<div class="alert alert-danger">Failed to create portfolio item</div>';
    }
});