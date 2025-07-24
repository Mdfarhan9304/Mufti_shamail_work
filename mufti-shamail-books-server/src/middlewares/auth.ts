import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors";
import User from "../models/User";
import { AuthRequest, TokenPayload } from "../types";

export const protect = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			throw new UnauthorizedError("Not authorized to access this route");
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as TokenPayload;
		const user = await User.findById(decoded.userId).populate("cart.book");

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			next(new UnauthorizedError("Token expired"));
			return;
		}
		next(error);
	}
};

// Only to be used for payment flow
export const optionalAuth = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			// Allow request to proceed without user
			return next();
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as TokenPayload;
		const user = await User.findById(decoded.userId).populate("cart.book");

		if (user) {
			req.user = user;
		}

		next();
	} catch (error) {
		// If token is invalid, proceed without user
		next();
	}
};

export const authorize = (...roles: string[]) => {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			throw new UnauthorizedError("Not authorized to access this route");
		}
		next();
	};
};
