import mongoose, { Schema, Document } from "mongoose";


interface BookDocument extends Document {
	name: string;
	description: string;
	author: string;
	price: number;
	images: string[];
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
	},
	{ 
		timestamps: true,
		toJSON: { getters: true },
		toObject: { getters: true }
	}
);

const Book = mongoose.model<BookDocument>("Book", bookSchema);

export default Book;
