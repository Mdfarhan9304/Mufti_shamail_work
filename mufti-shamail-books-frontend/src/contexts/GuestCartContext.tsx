import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface CartItem {
	_id: string;
	name: string;
	price: number;
	quantity: number;
	description: string;
	author: string;
	images: string[];
	selectedLanguage?: string;
	availableLanguages?: {
		english: boolean;
		urdu: boolean;
	};
}

interface GuestCartContextType {
	guestCart: CartItem[];
	addToGuestCart: (item: CartItem) => void;
	removeFromGuestCart: (itemId: string) => void;
	updateGuestQuantity: (itemId: string, quantity: number) => void;
	clearGuestCart: () => void;
	guestTotal: number;
	guestTotalItems: number;
}

const GuestCartContext = createContext<GuestCartContextType | undefined>(
	undefined
);

export const GuestCartProvider = ({ children }: { children: ReactNode }) => {
	const [guestCart, setGuestCart] = useState<CartItem[]>([]);

	useEffect(() => {
		const savedCart = localStorage.getItem("guestCart");
		if (savedCart) {
			setGuestCart(JSON.parse(savedCart));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("guestCart", JSON.stringify(guestCart));
	}, [guestCart]);

	const addToGuestCart = (item: CartItem) => {
		setGuestCart((prev) => {
			const existingItem = prev.find((i) => i._id === item._id);
			if (existingItem) {
				return prev.map((i) =>
					i._id === item._id ? { ...i, quantity: i.quantity + item.quantity } : i
				);
			}
			return [...prev, { ...item, quantity: item.quantity }];
		});
	};

	const removeFromGuestCart = (itemId: string) => {
		setGuestCart((prev) => prev.filter((item) => item._id !== itemId));
	};

	const updateGuestQuantity = (itemId: string, quantity: number) => {
		console.log("Updating guest quantity");

		setGuestCart((prev) => {
			if (quantity === 0) {
				return prev.filter((item) => item._id !== itemId);
			}
			return prev.map((item) =>
				item._id === itemId ? { ...item, quantity } : item
			);
		});
	};

	const clearGuestCart = () => {
		setGuestCart([]);
		localStorage.removeItem("guestCart");
	};

	const guestTotal = guestCart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);

	const guestTotalItems =
		guestCart.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

	return (
		<GuestCartContext.Provider
			value={{
				guestCart,
				addToGuestCart,
				removeFromGuestCart,
				updateGuestQuantity,
				clearGuestCart,
				guestTotal,
				guestTotalItems,
			}}
		>
			{children}
		</GuestCartContext.Provider>
	);
};

export const useGuestCart = () => {
	const context = useContext(GuestCartContext);
	if (!context) {
		throw new Error("useGuestCart must be used within a GuestCartProvider");
	}
	return context;
};
