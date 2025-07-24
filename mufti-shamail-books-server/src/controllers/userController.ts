import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { BadRequestError } from "../utils/errors";
import { fixCart } from "../utils/helper";

export const updateUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, addresses } = req.body;
		const { userId } = req.params;

		console.log("Updating user profile");

		// Validate userId
		if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
			throw new BadRequestError("Invalid user ID");
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{
				name,
				email,
				addresses,
			},
			{ new: true, runValidators: true }
		);

		if (!user) {
			throw new BadRequestError("User not found");
		}

		const updatedUser = (await user.populate("cart.book")).toObject();
		const fixedCart = fixCart(updatedUser?.cart || []);

		res.status(200).json({
			success: true,
			data: {
				user: {
					_id: userId,
					name: user.name,
					email: user.email,
					addresses: user.addresses || [],
					cart: fixedCart,
					role: user.role,
				},
			},
		});
	} catch (error) {
		if (error instanceof mongoose.Error.CastError) {
			next(new BadRequestError("Invalid user ID format"));
			return;
		}
		next(error);
	}
};
