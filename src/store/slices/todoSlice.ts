import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Todo, TodoState, CreateTodoRequest, UpdateTodoRequest } from '../../types/todo';

// Mock data for todos
const mockTodos: Todo[] = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Study React fundamentals and hooks',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Build Todo App',
    description: 'Create a complete todo application with CRUD operations',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Add Authentication',
    description: 'Implement user authentication and authorization',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial state
const initialState: TodoState = {
  todos: mockTodos,
  isLoading: false,
  error: null,
};

// Async thunks for todo operations
export const addTodo = createAsyncThunk<
  Todo,
  CreateTodoRequest,
  { rejectValue: string }
>(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTodo: Todo = {
        id: Date.now(),
        title: todoData.title,
        description: todoData.description,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return newTodo;
    } catch {
      return rejectWithValue('Failed to add todo');
    }
  }
);

export const updateTodo = createAsyncThunk<
  Todo,
  UpdateTodoRequest,
  { rejectValue: string }
>(
  'todos/updateTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedTodo: Todo = {
        id: todoData.id,
        title: todoData.title || '',
        description: todoData.description || '',
        completed: todoData.completed ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return updatedTodo;
    } catch {
      return rejectWithValue('Failed to update todo');
    }
  }
);

export const deleteTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch {
      return rejectWithValue('Failed to delete todo');
    }
  }
);

export const toggleTodo = createAsyncThunk<
  Todo,
  number,
  { rejectValue: string }
>(
  'todos/toggleTodo',
  async (id, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const toggledTodo: Todo = {
        id,
        title: 'Sample Todo',
        description: 'Sample description',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return toggledTodo;
    } catch {
      return rejectWithValue('Failed to toggle todo');
    }
  }
);

// Todo slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add todo cases
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add todo';
      })
      // Update todo cases
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update todo';
      })
      // Delete todo cases
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete todo';
      })
      // Toggle todo cases
      .addCase(toggleTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index].completed = !state.todos[index].completed;
          state.todos[index].updatedAt = new Date().toISOString();
        }
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to toggle todo';
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;
