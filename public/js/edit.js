 
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

 
async function loadItemData(itemId) {
try {
    const response = await axios.get(`/api/v2/${itemId}`);
    const item = response.data;

    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description;

     
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.innerHTML = '';
    
    
    item.images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = `${image}`;
        img.classList.add('img-thumbnail', 'me-2');
        img.style.width = '100px';
    
         
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

 let deletedImages = [];  

 function deleteImage(index, imagePath) {
      
     const imagePreview = document.getElementById('imagePreview');
     imagePreview.children[index].remove();
 
      
     deletedImages.push(imagePath);
 }


document.getElementById('itemSelect').addEventListener('change', function () {
    const itemId = this.value;
    loadItemData(itemId);
});

 
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

     
    for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
    }

     
    for(let i = 0; i < deletedImages.length; i++){
        formData.append('deletedImages', deletedImages[i]);
    }

     
    deletedImages = [];

    try {
        const response = await axios.put(`/api/v2/${itemId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        messageContainer.innerHTML = `<div class="alert alert-success">${response.data.message}</div>`;
        loadItemData(itemId);  
    } catch (error) {
        console.error(error);
        messageContainer.innerHTML = '<div class="alert alert-danger">Failed to update portfolio item.</div>';
    }
});

 
loadPortfolioItems();