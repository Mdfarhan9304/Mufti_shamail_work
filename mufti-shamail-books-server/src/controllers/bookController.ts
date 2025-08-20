import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import { processAndSaveImage } from "../services/uploadService";

// Get all books
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { language } = req.query;
    
    // Build filter query
    const filter: any = {};
    if (language && (language === 'english' || language === 'urdu')) {
      filter[`availableLanguages.${language}`] = true;
    }

    const books = await Book.find(filter);
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

// Get available languages
export const getBookLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const languages = [
      { value: 'english', label: 'English' },
      { value: 'urdu', label: 'Urdu' }
    ];
    
    res.status(200).json({ success: true, data: languages });
  } catch (error) {
    next(error);
  }
};

// Get a single book by ID
export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      throw new BadRequestError("Book not found");
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// Create a new book
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, author, price, availableLanguages } = req.body;

    // Validate required fields
    if (!name || !description || !author || !price) {
      throw new BadRequestError("All fields are required");
    }

    // Parse availableLanguages if it's a string (from FormData)
    let parsedLanguages = { english: true, urdu: false };
    if (availableLanguages) {
      try {
        parsedLanguages = typeof availableLanguages === 'string' 
          ? JSON.parse(availableLanguages) 
          : availableLanguages;
      } catch (error) {
        console.error("Error parsing availableLanguages:", error);
      }
    }

    // Check if files exist
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new BadRequestError("At least one image is required");
    }

    const images = req.files as Express.Multer.File[];
    console.log("Processing images:", images.length);

    // Process images with Sharp and get their URLs
    const imagePaths = await Promise.all(
      images.map(async (image) => {
        try {
          return await processAndSaveImage(image);
        } catch (error) {
          console.error("Image processing error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          throw new BadRequestError(`Image processing failed: ${errorMessage}`);
        }
      })
    );

    console.log("Image paths:", imagePaths);

    // Convert price to proper decimal format
    const priceValue = parseFloat(parseFloat(price).toFixed(2));

    const book = await Book.create({
      name,
      description,
      author,
      price: priceValue,
      images: imagePaths,
      availableLanguages: parsedLanguages,
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    console.error("Create book error:", error);
    next(error);
  }
};

// Update a book
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, author, price, availableLanguages } = req.body;

    // Parse availableLanguages if it's a string (from FormData)
    let parsedLanguages;
    if (availableLanguages) {
      try {
        parsedLanguages = typeof availableLanguages === 'string' 
          ? JSON.parse(availableLanguages) 
          : availableLanguages;
      } catch (error) {
        console.error("Error parsing availableLanguages:", error);
      }
    }

    const updateData: any = {
      name,
      description,
      author,
      price: price ? parseFloat(parseFloat(price).toFixed(2)) : undefined,
    };

    // Only update availableLanguages if provided
    if (parsedLanguages) {
      updateData.availableLanguages = parsedLanguages;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!book) {
      throw new BadRequestError("Book not found");
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// Delete a book
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      throw new BadRequestError("Book not found");
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
