// Load all portfolio items for selection
async function loadPortfolioItems() {
    try {
        const response = await axios.get('/api/v2/');
        const items = response.data;

        const itemSelect = document.getElementById('itemSelect');
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item._id;
            option.textContent = item.title;
            itemSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        document.getElementById('message').innerHTML = '<div class="alert alert-danger">Failed to load portfolio items.</div>';
    }
}

// Load selected item data to edit
async function loadItemData(itemId) {
try {
    const response = await axios.get(`/api/v2/${itemId}`);
    const item = response.data;

    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description;

    // Clear previous image previews
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    
    // Show images with delete option
    item.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = `${image}`;
        img.classList.add('img-thumbnail', 'me-2');
        img.style.width = '100px';
    
        // Create delete button for each image
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'mt-2');
        deleteBtn.addEventListener('click', () => deleteImage(index, image));
     
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('position-relative');
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(deleteBtn);
        imagePreview.appendChild(imageWrapper);
    });
    } catch (error) {
    console.error(error);
    document.getElementById('message').innerHTML = '<div class="alert alert-danger">Failed to load item data.</div>';
    }
 }  

 let deletedImages = []; // Track deleted image paths

 function deleteImage(index, imagePath) {
     // Remove the image from the preview
     const imagePreview = document.getElementById('imagePreview');
     imagePreview.children[index].remove();
 
     // Add the image path to the deletedImages array
     deletedImages.push(imagePath);
 }

// Event listener for selecting an item to edit
document.getElementById('itemSelect').addEventListener('change', function () {
    const itemId = this.value;
    loadItemData(itemId);
});

// Event listener for form submission
document.getElementById('editPortfolioForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const itemId = document.getElementById('itemSelect').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const images = document.getElementById('images').files;

    const messageContainer = document.getElementById('message');
    messageContainer.innerHTML = '';

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

    // Append images
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

    // Append deleted images paths
    for(let i = 0; i < deletedImages.length; i++){
        formData.append('deletedImages', deletedImages[i]);
    }

    // After submitting, reset deletedImages
    deletedImages = [];

    try {
        const response = await axios.put(`/api/v2/${itemId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        messageContainer.innerHTML = `<div class="alert alert-success">${response.data.message}</div>`;
        loadItemData(itemId); // Reload form with updated data
    } catch (error) {
        console.error(error);
        messageContainer.innerHTML = '<div class="alert alert-danger">Failed to update portfolio item.</div>';
    }
});

// Initial load of portfolio items
loadPortfolioItems();