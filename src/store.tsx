import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/slices/authSlice";
import todoReducer from "./store/slices/todoSlice";
import productReducer from "./store/slices/productSlice";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

// Configure the Redux store with slices
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // To ignore these action types for async thunks
        ignoredActions: [
          "auth/login/pending",
          "auth/login/fulfilled",
          "auth/login/rejected",
        ],
        // To ignore these field paths in state
        ignoredPaths: ["auth.token"],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for usage in components
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
