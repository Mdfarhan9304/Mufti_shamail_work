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

	if (err instanceof CustomError) {
		res.status(err.statusCode).json({
			success: false,
			error: err.message,
		});
		return;
	}

	// console.error("Error:", err);

	res.status(500).json({
		success: false,
		error: "Internal server error",
	});
};
