import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import authService from "../../services/appwrite/authService";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice";
import { Button, Input, Logo, AuthCard } from "../index";
import { useAppDispatch } from "@/store/hooks";
import { useForm } from "react-hook-form";

const signupSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/, "Password must include letters & numbers"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleBlur = async (field: keyof SignupFormData) => {
    await trigger(field);
  };

  const createAccount = async (data: SignupFormData) => {
    setServerError("");
    setLoading(true);

    try {
      const userData = await authService.createAccount(data);

      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login({ userData: currentUser}));
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.message);

      if (error.message.includes("already exists")) {
        setError("email", { message: "Email is already in use" });
      } else {
        setServerError(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="flex flex-col items-center w-full">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="50px" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create an account
        </h2>

        <p className="mt-2 text-center text-base">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="ml-1 px-3 py-1 bg-blue-500 font-semibold rounded-full shadow-md transition-all hover:bg-blue-400 hover:scale-105"
          >
            Sign In
          </Link>
        </p>

        {serverError && (
          <p className="bg-red-700 bg-opacity-90 font-semibold px-4 py-2 rounded-lg text-center shadow-md mt-4">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit(createAccount)} className="mt-6 w-full">
          <div className="space-y-5">
            <Input
              label="Full Name:"
              placeholder="Enter your full name"
              {...register("name")}
              onBlur={() => handleBlur("name")}
            />
            {errors.name && (
              <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
                {errors.name.message}
              </p>
            )}

            <Input
              label="Email:"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
              onBlur={() => handleBlur("email")}
            />
            {errors.email && (
              <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
                {errors.email.message}
              </p>
            )}

            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              onBlur={() => handleBlur("password")}
            />
            {errors.password && (
              <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
                {errors.password.message}
              </p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
};

export default Signup;

// import React, { useState } from "react";
// import authService from '../../services/appwrite/authService';
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../../store/authSlice";
// import { Button, Input, Logo, AuthCard } from "../index";
// import { useAppDispatch } from "@/store/hooks";
// import { useForm, FieldValues } from "react-hook-form";

// const Signup: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const [serverError, setServerError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const {
//     register,
//     handleSubmit,
//     trigger,
//     setError: setFormError,
//     formState: { errors },
//   } = useForm<FieldValues>();

//   const handleBlur = async (field: string) => {
//     await trigger(field);
//   };

//   const createAccount = async (data: FieldValues) => {
//     setServerError("");
//     setLoading(true);

//     try {
//       const userData = await authService.createAccount(data);

//       if (userData) {
//         const currentUser = await authService.getCurrentUser();
//         if (currentUser) dispatch(login(currentUser));
//         navigate("/");
//       }
//     } catch (error: any) {
//       console.error("Signup Error:", error.message);

//       if (error.message.includes("already exists")) {
//         setFormError("email", { message: "Email is already in use" });
//       } else {
//         setServerError(error.message || "An unexpected error occurred.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthCard>
//       <div className="flex flex-col items-center w-full">
//         <div className="mb-2 flex justify-center">
//           <span className="inline-block w-full max-w-[100px]">
//             <Logo width="50px" />
//           </span>
//         </div>

//         <h2 className="text-center text-2xl font-bold leading-tight text-white">
//           Sign up to create an account
//         </h2>

//         <p className="mt-2 text-center text-base text-gray-300">
//           Already have an account?&nbsp;
//           <Link
//             to="/login"
//             className="ml-1 px-3 py-1 bg-blue-500 text-white font-semibold rounded-full shadow-md transition-all hover:bg-blue-400 hover:scale-105"
//           >
//             Sign In
//           </Link>
//         </p>

//         {serverError && (
//           <p className="bg-red-700 bg-opacity-90 text-white font-semibold px-4 py-2 rounded-lg text-center shadow-md mt-4">
//             {serverError}
//           </p>
//         )}

//         <form onSubmit={handleSubmit(createAccount)} className="mt-6 w-full">
//           <div className="space-y-5">
//             <Input
//               label="Full Name:"
//               placeholder="Enter your full name"
//               {...register("name", { required: "Full Name is required" })}
//               onBlur={() => handleBlur("name")}
//             />
//             {errors.name && (
//               <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
//                 {errors.name.message as string}
//               </p>
//             )}

//             <Input
//               label="Email:"
//               placeholder="Enter your email"
//               type="email"
//               {...register("email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//                   message: "Invalid email address",
//                 },
//               })}
//               onBlur={() => handleBlur("email")}
//             />
//             {errors.email && (
//               <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
//                 {errors.email.message as string}
//               </p>
//             )}

//             <Input
//               label="Password:"
//               type="password"
//               placeholder="Enter your password"
//               {...register("password", {
//                 required: "Password is required",
//                 minLength: { value: 6, message: "Password must be at least 6 characters" },
//                 pattern: {
//                   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/,
//                   message: "Password must include letters & numbers",
//                 },
//               })}
//               onBlur={() => handleBlur("password")}
//             />
//             {errors.password && (
//               <p className="text-red-800 px-3 py-1 font-bold text-sm shadow-md">
//                 {errors.password.message as string}
//               </p>
//             )}

//             <Button type="submit" disabled={loading}>
//               {loading ? "Creating Account..." : "Create Account"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </AuthCard>
//   );
// };

// export default Signup;
