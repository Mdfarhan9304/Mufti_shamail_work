import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { UserDocument } from "../types";

interface UserModel extends Model<UserDocument> {
	build(attrs: UserDocument): UserDocument;
}

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide a name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Please provide an email"],
			unique: true,
			lowercase: true,
			match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 6,
			select: false,
		},
		phone: {
			type: String,
			required: [false, "Please provide a phone number"],
			trim: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		addresses: [
			{
				addressLine1: {
					type: String,
					required: true,
					trim: true,
					maxLength: 100,
				},
				addressLine2: {
					type: String,
					trim: true,
					maxLength: 100,
				},
				landmark: {
					type: String,
					trim: true,
					maxLength: 100,
				},
				city: {
					type: String,
					required: true,
					trim: true,
				},
				state: {
					type: String,
					required: true,
					enum: [
						"Andhra Pradesh",
						"Arunachal Pradesh",
						"Assam",
						"Bihar",
						"Chhattisgarh",
						"Goa",
						"Gujarat",
						"Haryana",
						"Himachal Pradesh",
						"Jharkhand",
						"Karnataka",
						"Kerala",
						"Madhya Pradesh",
						"Maharashtra",
						"Manipur",
						"Meghalaya",
						"Mizoram",
						"Nagaland",
						"Odisha",
						"Punjab",
						"Rajasthan",
						"Sikkim",
						"Tamil Nadu",
						"Telangana",
						"Tripura",
						"Uttar Pradesh",
						"Uttarakhand",
						"West Bengal",
						"Andaman and Nicobar Islands",
						"Chandigarh",
						"Daman and Diu",
						"Delhi",
						"Jammu and Kashmir",
						"Ladakh",
						"Lakshadweep",
						"Puducherry",
					],
				},
				pincode: {
					type: String,
					required: true,
					match: /^[1-9][0-9]{5}$/, // Indian PIN code format
					trim: true,
				},
				isDefault: {
					type: Boolean,
					default: false,
				},
				addressType: {
					type: String,
					required: true,
					enum: ["Home", "Work", "Other"],
				},
			},
		],
		cart: [
			{
				book: {
					type: Schema.Types.ObjectId,
					ref: "Book",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				selectedLanguage: {
					type: String,
					enum: ["english", "urdu"],
					default: "english",
				},
			},
		],
		refreshToken: String,
		resetPasswordToken: String,
		resetPasswordExpires: Date,
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
