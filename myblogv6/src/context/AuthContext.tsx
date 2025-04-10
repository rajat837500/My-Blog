// import { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/appwrite";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     getCurrentUser().then(setUser);
//   }, []);

//   const login = async (email, password) => {
//     await loginUser(email, password);
//     setUser(await getCurrentUser());
//   };

//   const register = async (name, email, password) => {
//     await registerUser(name, email, password);
//     setUser(await getCurrentUser());
//   };

//   const logout = async () => {
//     await logoutUser();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
