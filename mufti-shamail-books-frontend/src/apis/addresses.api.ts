import axios from "axios";
import axiosInstance from "../config/axios.config";

export interface Address {
	_id?: string; // optional field
	addressLine1: string;
	addressLine2?: string; // optional field
	landmark?: string; // optional field
	city: string;
	state: State; // using enum for state
	pincode: string;
	isDefault: boolean;
	addressType: AddressType;
}

// Enum for Indian states
export enum State {
	AndhraPradesh = "Andhra Pradesh",
	ArunachalPradesh = "Arunachal Pradesh",
	Assam = "Assam",
	Bihar = "Bihar",
	Chhattisgarh = "Chhattisgarh",
	Goa = "Goa",
	Gujarat = "Gujarat",
	Haryana = "Haryana",
	HimachalPradesh = "Himachal Pradesh",
	Jharkhand = "Jharkhand",
	Karnataka = "Karnataka",
	Kerala = "Kerala",
	MadhyaPradesh = "Madhya Pradesh",
	Maharashtra = "Maharashtra",
	Manipur = "Manipur",
	Meghalaya = "Meghalaya",
	Mizoram = "Mizoram",
	Nagaland = "Nagaland",
	Odisha = "Odisha",
	Punjab = "Punjab",
	Rajasthan = "Rajasthan",
	Sikkim = "Sikkim",
	TamilNadu = "Tamil Nadu",
	Telangana = "Telangana",
	Tripura = "Tripura",
	UttarPradesh = "Uttar Pradesh",
	Uttarakhand = "Uttarakhand",
	WestBengal = "West Bengal",
	AndamanAndNicobarIslands = "Andaman and Nicobar Islands",
	Chandigarh = "Chandigarh",
	DamanAndDiu = "Daman and Diu",
	Delhi = "Delhi",
	JammuAndKashmir = "Jammu and Kashmir",
	Ladakh = "Ladakh",
	Lakshadweep = "Lakshadweep",
	Puducherry = "Puducherry",
}

export enum AddressType {
	Home = "Home",
	Work = "Work",
	Other = "Other",
}

export const getAddresses = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/addresses/${userId}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to get addresses"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const addNewAddress = async (address: Address, userId: string) => {
	console.log(address, userId);
	try {
		const response = await axiosInstance.post("/addresses", {
			address,
			userId,
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to add address"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const updateExistingAddress = async (
	addressId: string,
	address: Partial<Address>,
	userId: string
) => {
	console.log(addressId, address, userId);
	try {
		const response = await axiosInstance.put(`/addresses/${addressId}`, {
			address,
			userId,
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to update address"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

export const removeAddress = async (addressId: string, userId: string) => {
	try {
		const response = await axiosInstance.delete(`/addresses/${addressId}`, {
			data: { userId },
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.error || "Failed to remove address"
			);
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};
