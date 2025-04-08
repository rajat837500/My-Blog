import React, { useState, useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import authService from "./services/appwrite/authService";
import { login, logout } from "./store/authSlice";
import { Footer, Navbar } from "./components/index";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  console.log("App mount");

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData: any) => {
        if (userData) {
          dispatch(login({ userData }));
          console.log("dispatch userData:", userData);
        } else {
          dispatch(logout());
        }
      })
      .catch((error: Error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => setLoading(false));
  }, []); // Removed `loading` from dependency to avoid infinite re-renders

  console.log("After dispatch loading:", loading);

  return !loading ? (
    <div className="min-h-screen bg-background transition-colors duration-600">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null;
};

export default App;



// import Navbar from "./components/header/Navbar"
// // import { Button } from "./components/ui/button"

// function App() {
//   return (
//     <>
//       <div className="relative w-full h-screen bg-background overflow-hidden transition-colors duration-400 ">
//         <Navbar/>
//       </div>
//     </>
//   )
// }

// export default App
