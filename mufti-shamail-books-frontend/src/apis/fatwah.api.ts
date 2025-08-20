import axiosInstance from "../config/axios.config";

export enum FatwahStatus {
  PENDING = "pending",
  PUBLISHED = "published",
  DRAFT = "draft",
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
  OTHER = "Other",
}

export interface Fatwah {
  _id: string;
  question: string;
  answer?: string;
  askerName?: string;
  askerEmail?: string;
  categories: FatwahCategory[];
  status: FatwahStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  answeredBy?: {
    _id: string;
    name: string;
  };
}

export interface FatwahSubmission {
  question: string;
  askerName?: string;
  askerEmail?: string;
  categories?: FatwahCategory[];
}

export interface FatwahCreation {
  question: string;
  answer?: string;
  categories?: FatwahCategory[];
  status?: FatwahStatus;
}

export interface FatwahQuery {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Public API calls
export const getPublishedFatwahs = async (query: FatwahQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const { data } = await axiosInstance.get(`/fatwahs/public?${params}`);
  return data;
};

export const getFatwahById = async (id: string) => {
  const { data } = await axiosInstance.get(`/fatwahs/${id}`);
  return data;
};

export const submitQuestion = async (submission: FatwahSubmission) => {
  const { data } = await axiosInstance.post("/fatwahs/submit", submission);
  return data;
};

export const getFatwahCategories = async () => {
  const { data } = await axiosInstance.get("/fatwahs/categories");
  return data;
};

// Admin API calls
export const getAllFatwahs = async (query: FatwahQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });

  const { data } = await axiosInstance.get(`/fatwahs?${params}`);
  return data;
};

export const createFatwah = async (fatwah: FatwahCreation) => {
  const { data } = await axiosInstance.post("/fatwahs", fatwah);
  return data;
};

export const updateFatwah = async (
  id: string,
  fatwah: Partial<FatwahCreation>
) => {
  const { data } = await axiosInstance.put(`/fatwahs/${id}`, fatwah);
  return data;
};

export const deleteFatwah = async (id: string) => {
  const { data } = await axiosInstance.delete(`/fatwahs/${id}`);
  return data;
};
