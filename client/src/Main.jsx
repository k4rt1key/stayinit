import "./Main.css";
import React from "react";
import ReactDOM from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";

import Home from "./pages/Home";
import PropertyPage from "./pages/PropertyPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Test from "./pages/Test";
import Layout from "./pages/Layout";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Listing from "./pages/Listing";
import Likes from "./pages/Likes";

import propertyPageLoader from "./loaders/propertyPageLoader";

import ErrorElement from "./components/ErrorElement";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorElement />}>
      <Route index element={<Home />} />

      <Route path="/listing/:type" element={<Listing />} />

      <Route path="/listing/:type/:propertyname" element={<PropertyPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/login/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/reset-password" element={<ResetPassword />} />
      <Route path="/user/likes" element={<Likes />} />

      <Route path="/test" element={<Test />} />

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

export default function App() {
  return (
    <ThemeProvider>
      <ToastContainer position="bottom-right" />
      <GoogleOAuthProvider clientId={"123"}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
