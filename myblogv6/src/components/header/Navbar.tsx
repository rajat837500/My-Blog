import { useState, useRef,useEffect } from "react";
import { Button, Logo, DarkModeToggle} from "../index";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "@/services/appwrite/authService";
import { logout } from "@/store/authSlice";

export default function Navbar() {
  const authStatus = useAppSelector((state) => state.auth.status);
  const user = useAppSelector((state) => state.auth.userData);
  // const userAvatar = useAppSelector((state) => state.auth.avatarUrl);
  // console.log("User Avatar URL:", userAvatar);
  const navigate = useNavigate();
  const location = useLocation();

  //Logout Button
  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // State for dropdown menu
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

    // Close dropdown when authentication status changes (fix for logout issue)
    useEffect(() => {
      setIsOpen(false);
    }, [authStatus]);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
      setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);   

  const navItems = [
    { name: "Home", slug: "/", show:  authStatus },
    { name: "Login", slug: "/login", show: !authStatus },
    { name: "Signup", slug: "/signup", show: !authStatus },
    { name: "My Posts", slug: "/my-posts", show: authStatus },
    { name: "Add Post", slug: "/add-post", show: authStatus },
  ];

  return (

    <nav className="fixed top-0 left-0 w-full h-16 bg-background shadow-md z-10 flex items-center border-b transition-colors duration-400">
  <div className="container mx-auto flex justify-between items-center h-full px-4">
    
    {/* Left Side - Logo */}
    <Link to="/" className="flex items-center space-x-2">
      <Logo width="50px" />
      <span className="text-lg font-bold">My Blog</span>
    </Link>

    {/* Right Side - Navigation & Actions */}
    <div className="flex items-center gap-6 ml-auto">
      
      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex items-center gap-6">
        {navItems.filter((item) => item.show).map((item) => (
          <li
          //            className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted cursor-pointer"
            key={item.name}
            onClick={() => navigate(item.slug)}
            className={`inline-block px-6 py-2 duration-200 rounded-full 
                      ${
                        location.pathname === item.slug
                          ? "text-primary font-bold border-b-2 border-primary" // Highlight active page
                          : "text-foreground hover:text-primary"
                      }`


              
            }
          >
            {item.name}
          </li>
        ))}
      </ul>

      {/* User Profile Dropdown (Only Visible When Logged In) */}
      {authStatus && user && (
        <div className="relative flex items-center" ref={dropdownRef}>
          {/* Avatar Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center rounded-full focus:outline-none transition duration-200 hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50"
          >
            <img
              src={ user.avatarUrl || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          </button>

          {/* Dropdown Menu */}
          <div

          className={`dropdown ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}

            // className={`absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md transition-all duration-200 ${
            //   isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            // }`}
          >

          <div className="dropdownArrow">
          </div>

            <p className="text-sm font-semibold text-center mb-2 border-b border-gray-300 pb-2 uppercase" title={user.email}>
              {user.name.toUpperCase()}
            </p>

            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 rounded mt-2"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Mobile Menu Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[var(--card)]">
          {navItems.filter((item) => item.show).map((item) => (
            <DropdownMenuItem key={item.name} onClick={() => navigate(item.slug)}>
              {item.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</nav>


    // <nav className = 'fixed top-0 left-0 w-full h-16 bg-background shadow-md z-3 flex items-center border-b'>
    // {/* // <nav className="bg-background text-foreground border-b shadow-md z-1 transition-colors duration-400"> */}



    // {/* // <nav className="bg-background text-foreground border-b shadow-md z-10 transition-colors duration-400 h-12"> */}
    //   {/* <div className="container mx-auto flex justify-between items-center "> */}
    //   {/* <div className="container mx-auto flex justify-between items-center p-4"> */}
    //   <div className="flex items-center justify-between container">


    //     {/* Left Side - Logo */}
    //     <Link to="/" className="flex items-center space-x-2 mr-4">
    //         <Logo width="50px" />
    //         <span className="text-lg font-bold">My Blog</span>
    //     </Link>

    //     {/* Right Side - Navigation + Dark Mode Toggle */}
    //     <div className="flex items-center gap-4 ml-auto">
    //       {/* Desktop Navigation Links */}
    //       <ul className="hidden md:flex gap-6">
    //         {navItems.filter((item) => item.show).map((item) => (
    //           <li
    //             key={item.name}
    //             className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted cursor-pointer"
    //             onClick={() => navigate(item.slug)}
    //           >
    //             {item.name}
    //           </li>
    //         ))}
    //       {/* User Profile Dropdown (Only Visible When Logged In) */}
    //           {authStatus && user && (
    //           <li className="relative flex items-center cursor-pointer" ref={dropdownRef}>
    //             {/* Avatar Button */}
    //             <button
    //               onClick={() => setIsOpen(!isOpen)}
    //               className="relative flex items-center rounded-full focus:outline-none transition duration-200 transform hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50"
    //             >
    //               <img
    //                 src={userAvatar || "/default-avatar.png"}
    //                 alt="User Avatar"
    //                 className="w-10 h-10 rounded-full border-2 border-white"
    //               />
    //             </button>

    //             {/* Dropdown Menu */}
    //             <div
    //               className={`dropdown
    //                 ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
    //             >
    //               <div className="dropdownArrow">
    //               </div>

    //               {/* Display User Name with Email Tooltip */}
    //               <p className="text-sm font-semibold text-center mb-2 border-b border-gray-600 pb-2 uppercase" title={user.email}>
    //                 {user.name}
    //               </p>

    //               {/* Logout Button */}
    //               <button
    //                 className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1 rounded mt-2"
    //                 onClick={logoutHandler}
    //                 />
    //             </div>
    //           </li>
    //         )}

    //       </ul>

    //       {/* Dark Mode Toggle Button */}
    //       <DarkModeToggle />

    //       {/* Mobile Menu Dropdown */}
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" size="icon" className="md:hidden">
    //             <Menu className="h-5 w-5" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end" className="bg-[var(--card)]">
    //           {navItems.filter((item) => item.show).map((item) => (
    //             <DropdownMenuItem key={item.name} onClick={() => navigate(item.slug)}>
    //               {item.name}
    //             </DropdownMenuItem>
    //           ))}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     </div>
    //   </div>
    // </nav>
  );
}

// import { Button } from "../components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Menu } from "lucide-react";
// import DarkModeToggle from "./DarkModeToggle";
// import { useAppSelector } from "../store/hooks";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const authStatus = useAppSelector((state) => state.auth.loading);
//   const user = useAppSelector((state) => state.auth.user);
//   const navigate = useNavigate();

//   const navItems = [
//     { name: "Home", slug: "/", show: authStatus },
//     { name: "Login", slug: "/login", show: !authStatus },
//     { name: "Signup", slug: "/signup", show: !authStatus },
//     { name: "My Posts", slug: "/all-posts", show: authStatus },
//     { name: "Add Post", slug: "/add-post", show: authStatus },
//   ];

//   return (
//     <nav className="bg-background text-foreground border-b border-border shadow-md z-10 transition-colors duration-400">
//       <div className="container mx-auto flex justify-between items-center p-4">
//         {/* Left Side - Logo */}
//         <h1 className="text-lg font-bold">My App</h1>

//         {/* Right Side - Navigation + Dark Mode Toggle */}
//         <div className="flex items-center gap-4">
//           {/* Desktop Navigation Links */}
//           <ul className="hidden md:flex gap-6">
//             {navItems.filter((item) => item.show).map((item) => (
//               <li
//                 key={item.name}
//                 className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted cursor-pointer"
//                 onClick={() => navigate(item.slug)}
//               >
//                 {item.name}
//               </li>
//             ))}
//           </ul>

//           {/* Dark Mode Toggle Button */}
//           <DarkModeToggle />

//           {/* Mobile Menu Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-[var(--card)]">
//               {navItems.filter((item) => item.show).map((item) => (
//                 <DropdownMenuItem key={item.name} onClick={() => navigate(item.slug)}>
//                   {item.name}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }


// import { Button } from "../components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Menu } from "lucide-react";
// import DarkModeToggle from "./DarkModeToggle";

// export default function Navbar() {
//   return (
//     <nav className="bg-background text-foreground border-b border-border shadow-md z-10 transition-colors duration-400">
//       <div className="container mx-auto flex justify-between items-center p-4">
//         {/* Left Side - Logo */}
//         <h1 className="text-lg font-bold">My App</h1>

//         {/* Right Side - Navigation + Dark Mode Toggle */}
//         <div className="flex items-center gap-4">
//           {/* Desktop Navigation Links */}
//           <ul className="hidden md:flex gap-6">
//             <li className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted">
//               Home
//             </li>
//             <li className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted">
//               About
//             </li>
//             <li className="px-3 py-1 rounded transition-colors duration-100 hover:text-foreground hover:bg-muted">
//               Contact
//             </li>
//           </ul>

//           {/* Dark Mode Toggle Button */}
//           <DarkModeToggle />

//           {/* Mobile Menu Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-[var(--card)]">
//               <DropdownMenuItem>Home</DropdownMenuItem>
//               <DropdownMenuItem>About</DropdownMenuItem>
//               <DropdownMenuItem>Contact</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }
