import { useAppSelector, useAppDispatch } from '../store';
import { addTodo, updateTodo, deleteTodo, toggleTodo, clearError } from '../store/slices/todoSlice';
import type { CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

// Custom hook for todo operations
export const useTodos = () => {
  const dispatch = useAppDispatch();
  const todoState = useAppSelector((state) => state.todos);

  const handleAddTodo = async (todo: CreateTodoRequest) => {
    const result = await dispatch(addTodo(todo));
    return result;
  };

  const handleUpdateTodo = async (todo: UpdateTodoRequest) => {
    const result = await dispatch(updateTodo(todo));
    return result;
  };

  const handleDeleteTodo = async (id: number) => {
    const result = await dispatch(deleteTodo(id));
    return result;
  };

  const handleToggleTodo = async (id: number) => {
    const result = await dispatch(toggleTodo(id));
    return result;
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...todoState,
    addTodo: handleAddTodo,
    updateTodo: handleUpdateTodo,
    deleteTodo: handleDeleteTodo,
    toggleTodo: handleToggleTodo,
    clearError: handleClearError,
  };
};