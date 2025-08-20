import { createHash } from "crypto";

export const fixCart = (cart: Array<{ book: any; quantity: number }>) => {
	return cart.map((item) => ({
		...item.book,
		quantity: item.quantity,
	}));
};

// Calculate delivery charges based on total book quantity
export const calculateDeliveryCharges = (totalQuantity: number): number => {
	// Every 2 books add 50 Rs delivery charge
	// 1-2 books: 50 Rs
	// 3-4 books: 100 Rs
	// 5-6 books: 150 Rs, etc.
	const deliveryGroups = Math.ceil(totalQuantity / 2);
	return deliveryGroups * 50;
};

export const generateTransactionId = () => {
	const timestamp = Date.now();
	const randomNumber = Math.floor(Math.random() * 10000)
		.toString()
		.padStart(4, "0"); // Random 4-digit number
	return `TXN-${timestamp}${randomNumber}`; // Order ID format
};

export const generateChecksum = async (
	payload: string,
	endpoint: string,
	SALT_KEY: string
) => {
	const stringToHash = payload + endpoint + SALT_KEY;
	const sha256Value = createHash("sha256").update(stringToHash).digest("hex");
	return `${sha256Value}###1`; // Key index 1
};
