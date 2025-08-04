import express from 'express';
import { upload, uploadImage, deleteImage } from '../controllers/uploadController';

const router = express.Router();

// Upload single image
router.post('/image', upload.single('image'), uploadImage);

// Delete image
router.delete('/image/:filename', deleteImage);

export default router;
