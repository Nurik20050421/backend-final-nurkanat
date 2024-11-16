const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');

 
exports.createItem = async (req, res) => {
  const { title, description } = req.body;
  const images = req.files.map(file => path.join('images', file.filename)); 

  try {
      const newItem = new Item({
          title,
          description,
          images,
          userId: req.session.user.userId 
      });

      await newItem.save();
      res.status(201).json({ message: 'Portfolio item created successfully', item: newItem });
  } catch (error) {
      console.error('Error creating portfolio item:', error);
      res.status(500).json({ error: 'Failed to create portfolio item' });
  }
};

exports.getItems = async (req, res) => {
  try {
   
    const items = await Item.find();

   
    const itemsWithUser = await Promise.all(items.map(async (item) => {
      const user = await User.findById(item.userId); 

      return {
        ...item.toObject(),
        author: {
          firstName: user ? user.firstName : 'Anonymous',
          lastName: user ? user.lastName : 'Anonymous'
        }
      };
      
    }));

    res.json(itemsWithUser);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio items' });
  }
};



exports.getByIdItem = async (req, res) => {
  try {
    const itemId = req.params.id; 
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio item' });
  }
};

exports.updateItem = async (req, res) => {
  const { title, description, deletedImages } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    const currentImages = item ? item.images : [];

    const newImages = req.files ? req.files.map(file => path.join('images', file.filename)) : [];

    const allImages = [...currentImages, ...newImages];

    const deletedImagesArray = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
    
    if (deletedImagesArray && deletedImagesArray.length > 0) {
      deletedImagesArray.forEach((imagePath) => {
        if (imagePath && imagePath !== 'null' && imagePath !== 'undefined') { 
          const imageFilePath = path.join(__dirname, '..', imagePath);  
          fs.unlink(imageFilePath, (err) => {
            if (err) {
              console.error('Error deleting image:', err);
            } else {
              console.log('Deleted image:', imagePath);
            }
          });
      
          const imageIndex = allImages.indexOf(imagePath);
          if (imageIndex > -1) {
            allImages.splice(imageIndex, 1); 
          }
        } else {
          console.log('Invalid image path:', imagePath);
        }
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { title, description, images: allImages, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Portfolio item updated successfully', item: updatedItem });
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ error: 'Failed to update portfolio item' });
  }
};



exports.deleteItem = async (req, res) => {
  try {
  
    const deletedItem = await Item.findById(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

  
    deletedItem.images.forEach((imagePath) => {
      const imageFilePath = path.join(__dirname, '..', imagePath);
      fs.unlink(imageFilePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Deleted image:', imagePath);
        }
      });
    });

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
};
