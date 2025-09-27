import axiosInstance from "../config/axios.config";

export interface Article {
  _id: string;
  title: string;
  excerpt?: string; // Generated from content
  content: string;
  author: string;
  featuredImage: string;
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  category?: string;
  tags?: string[];
}

export interface ArticleListResponse {
  success: boolean;
  data: {
    articles: Article[];
    pagination: {
      currentPage: number;
      totalPages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
}

export interface ArticleStatsResponse {
  success: boolean;
  data: {
    overview: {
      totalArticles: number;
      publishedArticles: number;
      draftArticles: number;
      totalViews: number;
    };
    categoriesStats: Array<{
      _id: string;
      count: number;
    }>;
    recentArticles: Array<{
      _id: string;
      title: string;
      createdAt: string;
      isPublished: boolean;
      views: number;
    }>;
  };
}

export interface CreateArticleData {
  title: string;
  content: string;
  author?: string;
  featuredImage: string;
  isPublished?: boolean;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isPublished?: boolean;
}

// Public API calls
export const getPublishedArticles = async (filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const response = await axiosInstance.get(`/articles/published?${params.toString()}`);
  return response.data;
};

export const getPublishedArticleById = async (id: string): Promise<ArticleResponse> => {
  const response = await axiosInstance.get(`/articles/published/${id}`);
  return response.data;
};

export const getFeaturedArticles = async (limit: number = 6): Promise<{ success: boolean; data: Article[] }> => {
  const response = await axiosInstance.get(`/articles/featured?limit=${limit}`);
  return response.data;
};

export const getRecentArticles = async (limit: number = 5): Promise<{ success: boolean; data: Article[] }> => {
  const response = await axiosInstance.get(`/articles/recent?limit=${limit}`);
  return response.data;
};

// Admin API calls (require authentication)
export const getAllArticles = async (filters: ArticleFilters = {}): Promise<ArticleListResponse> => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  const response = await axiosInstance.get(`/articles/admin/all?${params.toString()}`);
  return response.data;
};

export const getArticleById = async (id: string): Promise<ArticleResponse> => {
  const response = await axiosInstance.get(`/articles/admin/${id}`);
  return response.data;
};

export const createArticle = async (articleData: CreateArticleData): Promise<ArticleResponse> => {
  const response = await axiosInstance.post("/articles/admin", articleData);
  return response.data;
};

export const updateArticle = async (id: string, articleData: UpdateArticleData): Promise<ArticleResponse> => {
  const response = await axiosInstance.put(`/articles/admin/${id}`, articleData);
  return response.data;
};

export const deleteArticle = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/articles/admin/${id}`);
  return response.data;
};

export const toggleArticlePublishStatus = async (id: string): Promise<ArticleResponse> => {
  const response = await axiosInstance.patch(`/articles/admin/${id}/toggle-publish`);
  return response.data;
};

export const getArticleStats = async (): Promise<ArticleStatsResponse> => {
  const response = await axiosInstance.get("/articles/admin/stats");
  return response.data;
};
