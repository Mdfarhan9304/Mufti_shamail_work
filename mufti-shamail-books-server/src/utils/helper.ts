import { createHash } from "crypto";

export const fixCart = (cart: Array<{ book: any; quantity: number }>) => {
	return cart.map((item) => ({
		...item.book,
		quantity: item.quantity,
	}));
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
