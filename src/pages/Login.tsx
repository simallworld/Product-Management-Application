import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  login as loginAction,
  clearError as clearAuthError,
} from "../store/slices/authSlice";
import type { LoginCredentials } from "../types/auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // Get state from Redux without the login function
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email) {
      errors.email = "email is required";
    } else if (formData.email.length < 3) {
      errors.email = "Email must be at least 3 characters";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 1) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
    // Clear Redux error
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(loginAction(formData)).unwrap();

      // If we get here, login was successful
      console.log("Login successful, navigating to home...");
      navigate("/");
    } catch (err: unknown) {
      // Error is already in Redux state
      if (err instanceof Error) {
        console.error("Login failed:", err.message);
      } else {
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50"
    >
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-teal-700 flex flex-col gap-6">
        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-3xl text-sm">
            <p className="font-semibold">Login Failed</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-semibold text-teal-700">
            <span>Email</span>
            <input
              className="w-full text-teal-700 border border-teal-700 rounded-2xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {formErrors.email && (
              <span className="text-red-600 text-xs">{formErrors.email}</span>
            )}
          </label>

          <label className="block space-y-2 text-sm font-semibold text-teal-700">
            <span>Password</span>
            <input
              className="w-full text-teal-700 border border-teal-700 rounded-2xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            {formErrors.password && (
              <span className="text-red-600 text-xs">
                {formErrors.password}
              </span>
            )}
          </label>
        </div>

        <div className="text-sm text-teal-700">
          Not registered?{" "}
          <Link className="text-blue-800 font-semibold" to="/register">
            Register Here
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 text-white px-4 py-3 rounded-2xl hover:bg-teal-900 transition ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Login;
