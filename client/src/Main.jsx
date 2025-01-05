import "./Main.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../src/components/DashboardLayout"

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";

import Home from "./pages/Home";
import Property from "./pages/Property";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Listing from "./pages/Listing";
import Likes from "./pages/Likes";

import ErrorElement from "./components/ErrorElement";
import AddFlat from "../src/admin/AddFlat";
import UserDashboard from "./pages/UserDashboard";
import FlatManager from "../src/admin/FlatManager";
import HostelManager from "./admin/HostelManager";
import AddHostel from "./admin/AddHostel";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorElement />}>
      <Route index element={<Home />} />

      <Route path="/listing/:type" element={<Listing />} />

      <Route path="/listing/:type/:propertyname" element={<Property />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/login/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/reset-password" element={<ResetPassword />} />
      <Route path="/user/likes" element={<Likes />} />

      <Route path="/test" element={<Test />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="add-flat" element={<AddFlat />} />
        <Route path="flatlist" element={<FlatManager />} />
        <Route path="hostellist" element={<HostelManager />} />
        <Route path="add-hostel" element={<AddHostel />} /> 
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return (
    <ThemeProvider>
      <ToastContainer position="top-center" />
      <GoogleOAuthProvider clientId={"123"}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
