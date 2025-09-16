import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  title: string;
  content: string;
  author: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Article content is required"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      default: "Admin",
    },
    featuredImage: {
      type: String,
      required: [true, "Featured image is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Set publishedAt when publishing
ArticleSchema.pre<IArticle>("save", function (next) {
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for better query performance
ArticleSchema.index({ isPublished: 1, publishedAt: -1 });

const Article = mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;
