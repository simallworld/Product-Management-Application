/**
 * API Service Configuration
 * Handles all HTTP requests to external APIs
 */

const API_BASE_URL = 'https://dummyjson.com';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  token?: string;
}

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<unknown> => {
  const {
    method = 'GET',
    headers = {},
    body,
    token,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization token if provided
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Check for HTTP errors
    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Authentication API calls
export const authApi = {
  /**
   * Login with username and password
   * Uses dummyjson auth API
   */
  login: async (username: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: {
        username,
        password,
        expiresInMins: 60, // Token expires in 60 minutes
      },
    });
  },

  // Get current user profile
  getCurrentUser: async (token: string) => {
    return apiRequest('/auth/me', {
      method: 'GET',
      token,
    });
  },

  // Refresh authentication token
  refreshToken: async (refreshToken: string) => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  },
};

// Products API calls
export const productsApi = {
  // Get products with pagination and search
  getProducts: async (skip: number = 0, limit: number = 10, search: string = '') => {
    let endpoint = `/products?skip=${skip}&limit=${limit}`;
    if (search) {
      endpoint = `/products/search?q=${encodeURIComponent(search)}&skip=${skip}&limit=${limit}`;
    }
    return apiRequest(endpoint, {
      method: 'GET',
    });
  },

  // Get product by ID
  getProductById: async (id: number) => {
    return apiRequest(`/products/${id}`, {
      method: 'GET',
    });
  },

  // Get all categories
  getCategories: async () => {
    return apiRequest('/products/categories', {
      method: 'GET',
    });
  },

  // Get products by category
  getProductsByCategory: async (category: string, skip: number = 0, limit: number = 10) => {
    return apiRequest(`/products/category/${category}?skip=${skip}&limit=${limit}`, {
      method: 'GET',
    });
  },

  // Create a product
  addProduct: async (product: unknown) => {
    return apiRequest('/products/add', {
      method: 'POST',
      body: product,
    });
  },

  // Update a product
  updateProduct: async (id: number, product: unknown) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: product,
    });
  },

  // Delete a product
  deleteProduct: async (id: number) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export for external use
export default {
  apiRequest,
  authApi,
  productsApi,
};
