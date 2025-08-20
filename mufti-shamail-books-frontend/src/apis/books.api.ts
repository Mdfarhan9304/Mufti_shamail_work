import axios from "axios";
import axiosInstance from "../config/axios.config";

export enum BookLanguage {
	ENGLISH = "english",
	URDU = "urdu",
}

export interface Book {
	_id?: string;
	name: string;
	description: string;
	author: string;
	price: number;
	images: string[];
	availableLanguages?: {
		english: boolean;
		urdu: boolean;
	};
}

export interface LanguageOption {
	value: BookLanguage;
	label: string;
}

export const getAllBooks = async (language?: BookLanguage) => {
	try {
		const params = language ? { language } : {};
		const response = await axiosInstance.get(`/books`, { params });
		console.log(response.data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.error || "Cannot get books");
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const getBookLanguages = async (): Promise<{ success: boolean; data: LanguageOption[] }> => {
	try {
		const response = await axiosInstance.get(`/books/languages`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.error || "Cannot get languages");
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const getBookById = async (id: string) => {
	try {
		const response = await axiosInstance.get(`/books/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.error || "Cannot get book");
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const createBook = async (book: Book, images: File[]) => {
	try {
		const formData = new FormData();
		formData.append("name", book.name);
		formData.append("description", book.description);
		formData.append("author", book.author);
		formData.append("price", book.price.toString());
		formData.append("availableLanguages", JSON.stringify(book.availableLanguages));
		images.forEach((image) => formData.append("images", image));

		const response = await axiosInstance.post(`/books`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to create book"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateBook = async (id: string, book: Book, _images: File[]) => {
	console.log(book);
	const { name, description, author, price, availableLanguages } = book;
	try {
		const response = await axiosInstance.put(
			`/books/${id}`,
			{ name, description, author, price, availableLanguages: JSON.stringify(availableLanguages) }
		);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to update book"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const deleteBook = async (id: string) => {
	try {
		const response = await axiosInstance.delete(`/books/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to delete book"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};
