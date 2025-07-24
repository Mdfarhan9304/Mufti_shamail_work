import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils/errors";
import User from "../models/User";
import { Address } from "../types";
import { fixCart } from "../utils/helper";

export const getAddresses = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { userId } = req.params;
	try {
		const user = await User.findById(userId);
		res.status(200).json({
			success: true,
			data: { addresses: user?.addresses || [] },
		});
	} catch (error) {
		next(error);
	}
};

export const addAddress = async (
	req: Request<{}, {}, { address: Address; userId: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { address, userId } = req.body;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		// If this is the first address or marked as default, handle default logic
		if (address.isDefault || user.addresses?.length === 0) {
			if (user.addresses) {
				user.addresses = user.addresses.map((addr) => ({
					...addr,
					isDefault: false,
				}));
			}
			address.isDefault = true;
		}

		user.addresses = [...(user.addresses || []), address];
		await user.save();

		const updatedUser = await User.findById(userId)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);

		res.status(200).json({
			success: true,
			data: { user: { ...updatedUser, cart: fixedCart } },
		});
	} catch (error) {
		next(error);
	}
};

export const updateAddress = async (
	req: Request<
		{ addressId: string },
		{},
		{ address: Partial<Address>; userId: string }
	>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { address, userId } = req.body;
		const { addressId } = req.params;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		const addressIndex = user.addresses?.findIndex(
			(addr) => addr._id.toString() === addressId
		);

		if (addressIndex === -1 || addressIndex === undefined) {
			throw new BadRequestError("Address not found");
		}

		// Handle default address logic
		if (address.isDefault) {
			user.addresses = user.addresses?.map((addr) => ({
				...addr,
				isDefault: false,
			}));
		}

		user.addresses![addressIndex] = {
			...user.addresses![addressIndex],
			...address,
		};

		await user.save();

		const updatedUser = await User.findById(userId)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);

		res.status(200).json({
			success: true,
			data: { user: { ...updatedUser, cart: fixedCart } },
		});
	} catch (error) {
		next(error);
	}
};

export const deleteAddress = async (
	req: Request<{ addressId: string }, {}, { userId: string }>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.body;
		const { addressId } = req.params;

		const user = await User.findById(userId);
		if (!user) throw new BadRequestError("User not found");

		const addressToDelete = user.addresses?.find(
			(addr) => addr._id.toString() === addressId
		);

		if (!addressToDelete) {
			throw new BadRequestError("Address not found");
		}

		// If deleting default address, make the first remaining address default
		const wasDefault = addressToDelete.isDefault;
		user.addresses = user.addresses?.filter(
			(addr) => addr._id.toString() !== addressId
		);

		if (wasDefault && user.addresses && user.addresses.length > 0) {
			user.addresses[0].isDefault = true;
		}

		await user.save();

		const updatedUser = await User.findById(userId)
			.populate("cart.book")
			.lean();
		const fixedCart = fixCart(updatedUser?.cart || []);

		res.status(200).json({
			success: true,
			data: { user: { ...updatedUser, cart: fixedCart } },
		});
	} catch (error) {
		next(error);
	}
};
