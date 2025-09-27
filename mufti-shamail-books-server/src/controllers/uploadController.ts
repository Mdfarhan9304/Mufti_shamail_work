import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Ensure uploads directory exists
// top of file (replace your uploadsDir block)
const uploadsDir = path.resolve(process.cwd(), "uploads"); // <-- robust path
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
console.log("Uploads directory:", uploadsDir);


export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with Sharp - convert to WebP and optimize
    await sharp(req.file.buffer)
      .resize(800, 800, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    // Return the file path that can be used to access the image
    const imageUrl = `/api/uploads/${filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
