import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";
import User from "../models/User";
import { fixCart } from "../utils/helper";

// export const getCart = async (
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) => {
// 	try {
// 		const user = await User.findById(req.user.id).populate("cart.book");
// 		res.status(200).json({
// 			success: true,
// 			data: { cart: user?.cart || [] },
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

export const addToCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId, quantity, userId } = req.body;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		const existingItemIndex = user.cart.findIndex(
			(item) => item.book.toString() === bookId
		);

		if (existingItemIndex > -1) {
			user.cart[existingItemIndex].quantity += quantity;
		} else {
			user.cart.push({ book: bookId, quantity });
		}

		await user.save();

		const updatedUser = await User.findById(user._id)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);
		res.status(200).json({
			success: true,
			data: { cart: fixedCart },
		});
	} catch (error) {
		next(error);
	}
};

export const updateCartItem = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId, quantity, userId } = req.body;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		const itemIndex = user.cart.findIndex(
			(item) => item.book.toString() === bookId
		);

		if (itemIndex === -1)
			throw new BadRequestError("Item not found in cart");

		if (quantity === 0) {
			user.cart.splice(itemIndex, 1);
		} else {
			user.cart[itemIndex].quantity = quantity;
		}

		await user.save();

		const updatedUser = await User.findById(user._id)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);
		res.status(200).json({
			success: true,
			data: { cart: fixedCart },
		});
	} catch (error) {
		next(error);
	}
};

export const removeFromCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId, userId } = req.body;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		user.cart = user.cart.filter((item) => item.book.toString() !== bookId);
		await user.save();

		const updatedUser = await User.findById(user._id)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);

		res.status(200).json({
			success: true,
			data: { cart: fixedCart },
		});
	} catch (error) {
		next(error);
	}
};

export const clearCart = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.body;
		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		user.cart = [];
		await user.save();

		res.status(200).json({ success: true, data: { cart: [] } });
	} catch (error) {
		next(error);
	}
};
