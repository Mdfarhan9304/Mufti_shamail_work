import { Request } from "express";
import mongoose from "mongoose";

export interface CartItem {
	book: mongoose.Types.ObjectId;
	quantity: number;
}

export interface Address {
	_id: string;
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
enum State {
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

enum AddressType {
	Home = "Home",
	Work = "Work",
	Other = "Other",
}

export interface UserDocument extends Document {
	_id: string;
	name: string;
	email: string;
	addresses?: Address[];
	cart: CartItem[];
	password: string;
	role: "user" | "admin";
	refreshToken?: string;
	comparePassword(candidatePassword: string): Promise<boolean>;
	createdAt: Date;
	updatedAt: Date;
	resetPasswordToken?: String;
	resetPasswordExpires?: Date;
}

export interface AuthRequest extends Request {
	user?: UserDocument;
}

export interface TokenPayload {
	userId: string;
}

export interface AuthResponse {
	success: boolean;
	data: {
		user?: {
			_id: string;
			name: string;
			email: string;
			addresses?: Address[];
			cart: CartItem[];
			role: string;
		};
		accessToken?: string;
		refreshToken?: string;
	};
}
