import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MyPost from "@/pages/MyPost";
import AddPost from "@/pages/AddPost";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/my-posts" element={<ProtectedRoute><MyPost /></ProtectedRoute>} />
        <Route path="/add-post" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
