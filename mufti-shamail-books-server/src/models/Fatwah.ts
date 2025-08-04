import mongoose, { Schema, Document } from "mongoose";

export enum FatwahStatus {
	PENDING = "pending",
	PUBLISHED = "published",
	DRAFT = "draft"
}

export enum FatwahCategory {
	PRAYER = "Prayer",
	FASTING = "Fasting",
	MARRIAGE = "Marriage",
	BUSINESS = "Business",
	PURIFICATION = "Purification",
	HAJJ = "Hajj",
	ZAKAT = "Zakat",
	FAMILY = "Family",
	WORSHIP = "Worship",
	OTHER = "Other"
}

interface FatwahDocument extends Document {
	question: string;
	answer?: string;
	askerName?: string;
	askerEmail?: string;
	categories: FatwahCategory[];
	status: FatwahStatus;
	createdAt: Date;
	updatedAt: Date;
	publishedAt?: Date;
	answeredBy?: mongoose.Types.ObjectId;
}

const fatwahSchema = new Schema(
	{
		question: {
			type: String,
			required: true,
			trim: true,
		},
		answer: {
			type: String,
			trim: true,
		},
		askerName: {
			type: String,
			trim: true,
		},
		askerEmail: {
			type: String,
			trim: true,
			lowercase: true,
		},
		categories: {
			type: [String],
			enum: Object.values(FatwahCategory),
			default: [FatwahCategory.OTHER],
		},
		status: {
			type: String,
			enum: Object.values(FatwahStatus),
			default: FatwahStatus.PENDING,
		},
		publishedAt: {
			type: Date,
		},
		answeredBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ 
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Index for search functionality
fatwahSchema.index({ 
	question: "text", 
	answer: "text" 
});

// Index for filtering
fatwahSchema.index({ status: 1, categories: 1, createdAt: -1 });

const Fatwah = mongoose.model<FatwahDocument>("Fatwah", fatwahSchema);

export default Fatwah;
