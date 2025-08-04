import { Request, Response, NextFunction } from "express";
import Fatwah, { FatwahStatus, FatwahCategory } from "../models/Fatwah";
import { BadRequestError, NotFoundError } from "../utils/errors";

// Get all published fatwahs (public)
export const getPublishedFatwahs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { search, category, page = 1, limit = 10 } = req.query;
		
		const query: any = { status: FatwahStatus.PUBLISHED };
		
		// Add search functionality
		if (search) {
			query.$text = { $search: search as string };
		}
		
		// Add category filter
		if (category && category !== 'all') {
			query.categories = { $in: [category] };
		}

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		const fatwahs = await Fatwah.find(query)
			.populate('answeredBy', 'name')
			.sort({ publishedAt: -1 })
			.skip(skip)
			.limit(limitNum);

		const total = await Fatwah.countDocuments(query);
		
		res.status(200).json({
			success: true,
			data: fatwahs,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum)
			}
		});
	} catch (error) {
		next(error);
	}
};

// Get all fatwahs for admin (including pending)
export const getAllFatwahs = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { status, search, category, page = 1, limit = 10 } = req.query;
		
		const query: any = {};
		
		// Add status filter
		if (status && status !== 'all') {
			query.status = status;
		}
		
		// Add search functionality
		if (search) {
			query.$text = { $search: search as string };
		}
		
		// Add category filter
		if (category && category !== 'all') {
			query.categories = { $in: [category] };
		}

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		const fatwahs = await Fatwah.find(query)
			.populate('answeredBy', 'name')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limitNum);

		const total = await Fatwah.countDocuments(query);
		
		res.status(200).json({
			success: true,
			data: fatwahs,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum)
			}
		});
	} catch (error) {
		next(error);
	}
};

// Get single fatwah by ID
export const getFatwahById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const fatwah = await Fatwah.findById(req.params.id)
			.populate('answeredBy', 'name');
		
		if (!fatwah) {
			throw new NotFoundError("Fatwah not found");
		}
		
		res.status(200).json({ success: true, data: fatwah });
	} catch (error) {
		next(error);
	}
};

// Submit a new question (public)
export const submitQuestion = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { question, askerName, askerEmail, categories } = req.body;
		
		if (!question) {
			throw new BadRequestError("Question is required");
		}
		
		const fatwah = await Fatwah.create({
			question,
			askerName,
			askerEmail,
			categories: categories || [FatwahCategory.OTHER],
			status: FatwahStatus.PENDING
		});
		
		res.status(201).json({ 
			success: true, 
			data: fatwah,
			message: "Your question has been submitted successfully. We will review and publish the answer soon."
		});
	} catch (error) {
		next(error);
	}
};

// Create a new fatwah (admin only)
export const createFatwah = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { question, answer, categories, status } = req.body;
		const userId = (req as any).user._id;
		
		if (!question) {
			throw new BadRequestError("Question is required");
		}
		
		const fatwahData: any = {
			question,
			categories: categories || [FatwahCategory.OTHER],
			status: status || FatwahStatus.DRAFT
		};
		
		if (answer) {
			fatwahData.answer = answer;
			fatwahData.answeredBy = userId;
		}
		
		if (status === FatwahStatus.PUBLISHED) {
			fatwahData.publishedAt = new Date();
		}
		
		const fatwah = await Fatwah.create(fatwahData);
		
		res.status(201).json({ success: true, data: fatwah });
	} catch (error) {
		next(error);
	}
};

// Update fatwah (admin only)
export const updateFatwah = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { question, answer, categories, status } = req.body;
		const userId = (req as any).user._id;
		
		const fatwah = await Fatwah.findById(req.params.id);
		
		if (!fatwah) {
			throw new NotFoundError("Fatwah not found");
		}
		
		// Update fields
		if (question) fatwah.question = question;
		if (answer) {
			fatwah.answer = answer;
			fatwah.answeredBy = userId;
		}
		if (categories) fatwah.categories = categories;
		if (status) {
			fatwah.status = status;
			if (status === FatwahStatus.PUBLISHED && !fatwah.publishedAt) {
				fatwah.publishedAt = new Date();
			}
		}
		
		await fatwah.save();
		
		res.status(200).json({ success: true, data: fatwah });
	} catch (error) {
		next(error);
	}
};

// Delete fatwah (admin only)
export const deleteFatwah = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const fatwah = await Fatwah.findByIdAndDelete(req.params.id);
		
		if (!fatwah) {
			throw new NotFoundError("Fatwah not found");
		}
		
		res.status(200).json({ 
			success: true, 
			message: "Fatwah deleted successfully" 
		});
	} catch (error) {
		next(error);
	}
};

// Get fatwah categories
export const getFatwahCategories = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const categories = Object.values(FatwahCategory);
		res.status(200).json({ success: true, data: categories });
	} catch (error) {
		next(error);
	}
};
