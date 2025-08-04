import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Use memory storage for processing with Sharp
const storage = multer.memoryStorage();

// Check file type
const checkFileType = (
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	const filetypes = /jpeg|jpg|png|webp/;
	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb(new Error("Images only!"));
	}
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Process and save image with Sharp
export const processAndSaveImage = async (file: Express.Multer.File): Promise<string> => {
	if (!file || !file.buffer) {
		throw new Error("Invalid file or missing file buffer");
	}

	try {
		const timestamp = Date.now();
		const filename = `images-${timestamp}.png`;
		const filepath = path.join(uploadsDir, filename);

		// Process image with Sharp - convert to PNG for better compatibility
		await sharp(file.buffer)
			.resize(800, 800, { 
				fit: 'inside', 
				withoutEnlargement: true 
			})
			.png({ quality: 90 })
			.toFile(filepath);

		console.log(`Image saved: ${filename}`);
		return filename;
	} catch (error) {
		console.error("Sharp processing error:", error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
		throw new Error(`Image processing failed: ${errorMessage}`);
	}
};

// Init upload with memory storage
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

export default upload;
