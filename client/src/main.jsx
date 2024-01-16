import './main.css';
import React from 'react';
import ReactDOM from "react-dom/client"

import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

import { ThemeProvider } from "@material-tailwind/react";

import Home from './pages/Home'
import Hostel from './pages/Hostel';
import Flat from './pages/Flat';
import Login from './pages/Login'
import Register from './pages/Register'
// import Prediction from './pages/Prediction'
import Layout from "./pages/Layout"
import HostelsListing from './pages/HostelsListing';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FlatListing from './pages/FlatsListing';
import Likes from './pages/Likes';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    {/* <Route path="/prediction" element={<Prediction />} /> */}

    <Route path="/hostels" element={<HostelsListing />} />
    <Route path="/hostels/:id" element={<Hostel />} />
    <Route path="/flats" element={<FlatListing />} />
    <Route path="/flats/:id" element={<Flat />} />

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/login/forgot-password" element={<ForgotPassword />} />
    <Route path="/user/reset-password" element={<ResetPassword />} />
    <Route path="/user/likes" element={<Likes />} />

    <Route path="*" element={<NotFound />} />
  </Route>
))

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />)
