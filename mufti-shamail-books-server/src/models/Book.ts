import mongoose, { Schema, Document } from "mongoose";

export enum BookLanguage {
	ENGLISH = "english",
	URDU = "urdu",
}

interface BookDocument extends Document {
	name: string;
	description: string;
	author: string;
	price: number;
	images: string[];
	availableLanguages: {
		english: boolean;
		urdu: boolean;
	};
}

const bookSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		price: {
			type: Schema.Types.Decimal128,
			required: true,
			get: (v: any) => parseFloat(v?.toString() || "0"),
		},
		images: {
			type: [String],
			required: true,
		},
		availableLanguages: {
			english: {
				type: Boolean,
				default: true,
			},
			urdu: {
				type: Boolean,
				default: false,
			},
		},
	},
	{ 
		timestamps: true,
		toJSON: { getters: true },
		toObject: { getters: true }
	}
);

const Book = mongoose.model<BookDocument>("Book", bookSchema);

export default Book;
