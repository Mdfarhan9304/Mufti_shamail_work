import axios from "axios";
import axiosInstance from "../config/axios.config";
import { PriceType, formatPrice } from "../utils/priceUtils";

export interface Book {
	_id?: string;
	name: string;
	description: string;
	author: string;
	price: PriceType;
	images: string[];
}

export const getAllBooks = async () => {
	try {
		const response = await axiosInstance.get(`/books`);
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
		formData.append("price", formatPrice(book.price).toString());
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
	const { name, description, author, price } = book;
	try {
		const response = await axiosInstance.put(
			`/books/${id}`,
			{ name, description, author, price: formatPrice(price) }
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
