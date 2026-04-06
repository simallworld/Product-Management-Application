import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  register as registerAction,
  clearError as clearAuthError,
} from "../store/slices/authSlice";
import type { RegisterCredentials } from "../types/auth";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {};

    // First name validation
    if (!formData.firstName) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
      await dispatch(registerAction(formData)).unwrap();

      // If we get here, registration was successful
      console.log("Registration successful, navigating to home...");
      navigate("/");
    } catch (err: unknown) {
      // Error is already in Redux state
      if (err instanceof Error) {
        console.error("Registration failed:", err.message);
      } else {
        console.error("Registration failed:", err);
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
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-semibold text-teal-700">
            <span>First Name</span>
            <input
              className="w-full text-teal-700 border border-teal-700 rounded-2xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="text"
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {formErrors.firstName && (
              <span className="text-red-600 text-xs">
                {formErrors.firstName}
              </span>
            )}
          </label>

          <label className="block space-y-2 text-sm font-semibold text-teal-700">
            <span>Last Name</span>
            <input
              className="w-full text-teal-700 border border-teal-700 rounded-2xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="text"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {formErrors.lastName && (
              <span className="text-red-600 text-xs">
                {formErrors.lastName}
              </span>
            )}
          </label>

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
          Already have an account?{" "}
          <Link className="text-blue-800 font-semibold" to="/login">
            Login Here
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-700 text-white px-4 py-3 rounded-2xl hover:bg-teal-900 transition ease-in-out duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default Register;
