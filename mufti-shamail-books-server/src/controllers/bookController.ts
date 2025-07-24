import { Request, Response, NextFunction } from "express";
import Book from "../models/Book";
import { BadRequestError, UnauthorizedError } from "../utils/errors";

// Get all books
export const getAllBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const books = await Book.find();
		res.status(200).json({ success: true, data: books });
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
		const { name, description, author, price } = req.body;
		const images = req.files as Express.Multer.File[];
		const imagePaths = images.map((image) => image.path);

		const book = await Book.create({
			name,
			description,
			author,
			price,
			images: imagePaths,
		});

		res.status(201).json({ success: true, data: book });
	} catch (error) {
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
		const { name, description, author, price } = req.body;
		// const images = req.files as Express.Multer.File[];
		// const imagePaths = images.map((image) => image.path);

		const book = await Book.findByIdAndUpdate(
			req.params.id,
			{
				name,
				description,
				author,
				price,
			},
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
