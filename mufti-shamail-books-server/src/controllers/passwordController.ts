import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";
import User from "../models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "../services/emailService";

// Create forgot password
export const forgotPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			throw new BadRequestError("User not found");
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

		// Save token to user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = resetTokenExpiry;
		await user.save();

		// Send password reset email
		await sendPasswordResetEmail(user.email, user.name, resetToken);

		res.status(200).json({
			success: true,
			data: { message: "Password reset email sent" },
		});
	} catch (error) {
		next(error);
	}
};

// Reset password
export const resetPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { token, password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		}).select("+password");

		if (!user) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		// Update user
		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save({ validateBeforeSave: false });

		res.status(200).json({
			success: true,
			data: { message: "Password reset successful" },
		});
	} catch (error) {
		next(error);
	}
};
