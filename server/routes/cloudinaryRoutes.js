const express = require('express');
const cloudinary = require('../cloudinary');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); 

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;

  try {
    const result = await cloudinary.uploader.upload(filePath, { folder: 'uploads' });
    
    // Delete the local file after successful upload
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting local file:', err);
      }
    });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload to Cloudinary failed', error });
  }
});


router.get('/image/:publicId', async (req, res) => {
    const publicId = req.params.publicId;
  
    const imageUrl = cloudinary.url(publicId, { secure: true, folder: 'uploads' });
    res.redirect(imageUrl);
  });
  
  module.exports=router
