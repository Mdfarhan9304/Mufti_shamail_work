import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface UploadResponse {
	success: boolean;
	message: string;
	imageUrl: string;
	filename: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
	const formData = new FormData();
	formData.append('image', file);

	const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

	return response.data;
};

export const deleteImage = async (filename: string): Promise<{ success: boolean; message: string }> => {
	const response = await axios.delete(`${API_BASE_URL}/upload/image/${filename}`);
	return response.data;
};

export const getImageUrl = (filename: string): string => {
	const baseUrl = API_BASE_URL.replace('/api', '');
	return `${baseUrl}/api/uploads/${filename}`;
};
