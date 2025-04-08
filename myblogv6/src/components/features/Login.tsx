import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../../store/authSlice";
import { Button, Input, Logo, AuthCard } from "../index";
import { useAppDispatch } from "../../store/hooks";
import authService from "../../services/appwrite/authService";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod Schema
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript Type from Zod Schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleBlur = async (field: keyof LoginFormData) => {
    await trigger(field);
  };

  const login = async (data: LoginFormData) => {
    setError("");
    try {
      const session = await authService.login({
        email: data.email.trim(),
        password: data.password,
      });

      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          console.log("Login Page user Data", userData);
          navigate("/");
        }
      }
    } catch (err) {
      setError((err as Error).message || "Failed to log in. Please try again.");
    }
  };

  return (
    <AuthCard>
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>

        {/* Toggle to Sign Up */}
        <p className="mt-2 text-center text-base">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="ml-1 px-3 py-1 bg-blue-500 font-semibold rounded-full shadow-md transition-all hover:bg-blue-400 hover:scale-105"
          >
            Sign Up
          </Link>
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 border border-red-400 px-3 py-2 mt-3 text-sm rounded-md">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 w-full space-y-4">
          {/* Email Input */}
          <div>
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              onBlur={() => handleBlur("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              onBlur={() => handleBlur("password")}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
};

export default Login;
