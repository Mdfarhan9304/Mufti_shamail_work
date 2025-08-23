import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../config/axios.config";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { CartItem } from "../apis/cart.api";
import { Address } from "../apis/addresses.api";
import {
	addToCart as addToCartApi,
	updateCartItem as updateCartApi,
	removeFromCart as removeFromCartApi,
	clearCart as clearCartApi,
} from "../apis/cart.api";

export interface User {
	_id: string;
	name: string;
	email: string;
	phone?: string; // Optional since it's only for regular users, not admins
	addresses?: Address[];
	role: string;
	cart: CartItem[];
	// other user properties
}

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (email: string, password: string, role: string) => Promise<User>;
	logout: () => void;
	refreshTokens: () => Promise<void>;
	register: (name: string, email: string, phone: string, password: string) => Promise<void>;
	isLoading: boolean;
	addToCart: (book: CartItem) => Promise<void>;
	removeFromCart: (bookId: string) => Promise<void>;
	updateQuantity: (bookId: string, quantity: number) => Promise<void>;
	clearCart: () => Promise<void>;
	totalItems: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	console.log("Rendering AuthProvider");

	// Check if user is authenticated based on accessToken
	useEffect(() => {
		const initAuth = async () => {
			setIsLoading(true);
			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");
			const storedUser = localStorage.getItem("user");

			if (!accessToken || !refreshToken) {
				setIsAuthenticated(false);
				setUser(null);
				setIsLoading(false);
				return;
			}

			// First set the stored user data to avoid UI flicker
			if (storedUser) {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsAuthenticated(true);
			}

			try {
				// Then fetch fresh user data from the server
				const { data } = await axiosInstance.get("/auth/me");
				console.log("Fresh user data:", data);
				localStorage.setItem("user", JSON.stringify(data.data.user));
				setUser(data.data.user);
				setIsAuthenticated(true);
			} catch (error) {
				console.error("Auth initialization failed:", error);
				// Clear tokens if auth fails
				localStorage.removeItem("accessToken");
				localStorage.removeItem("refreshToken");
				localStorage.removeItem("user");
				setIsAuthenticated(false);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (email: string, password: string, role: string): Promise<User> => {
		setIsLoading(true);
		try {
			const { data } = await axiosInstance.post(`/auth/login`, {
				email,
				password,
				role,
			});
			const { accessToken, refreshToken, user: loggedInUser } = data.data;

			// Only set auth state if the role matches
			if (loggedInUser.role === role) {
				localStorage.setItem("accessToken", accessToken);
				localStorage.setItem("refreshToken", refreshToken);
				localStorage.setItem("user", JSON.stringify(loggedInUser));
				setUser(loggedInUser);
				setIsAuthenticated(true);
			}
			return loggedInUser;
		} catch (error) {
			console.error("Login failed", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setIsLoading(true);
		try {
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user"); // Remove user data from localStorage
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshTokens = async () => {
		setIsLoading(true);
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) return;
			const { data } = await axiosInstance.post(`/auth/refresh-token`, {
				refreshToken,
			});
			const { accessToken, refreshToken: newRefreshToken } = data.data;
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", newRefreshToken);
		} catch (error) {
			logout();
			console.error("Token refresh failed", error);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (name: string, email: string, phone: string, password: string) => {
		setIsLoading(true);
		try {
			const { data } = await axiosInstance.post("/auth/register", {
				name,
				email,
				phone,
				password,
			});
			const {
				accessToken,
				refreshToken,
				user: registeredUser,
			} = data.data;
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
			localStorage.setItem("user", JSON.stringify(registeredUser));
			setUser(registeredUser);
			setIsAuthenticated(true);
		} catch (err: unknown) {
			if (err instanceof AxiosError && err.response) {
				toast.error("Registration failed: " + err.response.data.error);
			} else {
				toast.error("Registration failed: " + (err as Error).message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	// ------CART Functions------
	const addToCart = async (book: CartItem) => {
		try {
			setIsLoading(true);
			const response = await addToCartApi(
				book._id!,
				book.quantity,
				user!._id,
				book.selectedLanguage || "english"
			);
			setUser((prev) => ({ ...prev!, cart: response.data.cart }));
			toast.success("Added to cart");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to add to cart"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const removeFromCart = async (bookId: string) => {
		try {
			setIsLoading(true);
			const response = await removeFromCartApi(bookId, user!._id);
			setUser((prev) => ({ ...prev!, cart: response.data.cart }));
			toast.success("Removed from cart");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to remove from cart"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const updateQuantity = async (bookId: string, quantity: number) => {
		try {
			setIsLoading(true);
			const response = await updateCartApi(bookId, quantity, user!._id);
			setUser((prev) => ({ ...prev!, cart: response.data.cart }));
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to update cart"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const clearCart = async () => {
		try {
			setIsLoading(true);
			await clearCartApi();
			toast.success("Cart cleared");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to clear cart"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const totalItems =
		user?.cart?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				setUser,
				login,
				logout,
				refreshTokens,
				register,
				isLoading,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
				totalItems,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
