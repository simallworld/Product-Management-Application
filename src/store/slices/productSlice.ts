import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  ProductsState,
  ProductsResponse,
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from '../../types/product';
import { productsApi } from '../../services/api';

const initialState: ProductsState = {
  products: [],
  total: 0,
  isLoading: false,
  error: null,
  currentPage: 0,
  pageSize: 10,
  searchTerm: '',
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  { skip: number; limit: number; search: string }
>(
  'products/fetchProducts',
  async ({ skip, limit, search }) => {
    const response = await productsApi.getProducts(skip, limit, search);
    return response as ProductsResponse;
  }
);

export const createProduct = createAsyncThunk<Product, CreateProductPayload>(
  'products/createProduct',
  async (product) => {
    const response = await productsApi.addProduct(product);
    return response as Product;
  }
);

export const updateProduct = createAsyncThunk<Product, UpdateProductPayload>(
  'products/updateProduct',
  async ({ id, ...product }) => {
    const response = await productsApi.updateProduct(id, product);
    return response as Product;
  }
);

export const deleteProduct = createAsyncThunk<number, number>(
  'products/deleteProduct',
  async (id) => {
    await productsApi.deleteProduct(id);
    return id;
  }
);

// Products slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 0; // Reset to first page when searching
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products states
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.products.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update product';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter((item) => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { setCurrentPage, setPageSize, setSearchTerm, clearError } = productSlice.actions;
export default productSlice.reducer;
