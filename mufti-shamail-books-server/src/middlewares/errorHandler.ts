import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors";

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (res.headersSent) {
		return next(err);
	}

	// Log the error for debugging
	console.error("Error occurred:", {
		message: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		body: req.body,
		files: req.files ? 'Files present' : 'No files'
	});

	if (err instanceof CustomError) {
		res.status(err.statusCode).json({
			success: false,
			error: err.message,
		});
		return;
	}

	res.status(500).json({
		success: false,
		error: process.env.NODE_ENV === 'production' ? "Internal server error" : err.message,
	});
};
