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
// import Prediction from './pages/Prediction'om
import Test from './pages/Test'
import Layout from "./pages/Layout"
import HostelsListing from './pages/HostelsListing';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FlatListing from './pages/FlatsListing';
import Likes from './pages/Likes';

import ErrorElement from "./components/ErrorElement"

import { flatsLoader } from './loaders/flatListingLoader'; 
import { flatLoader } from './loaders/flatLoader'; 
import { hostelsLoader } from './loaders/hostelListingLoader'; 
import { hostelLoader } from './loaders/hostelLoader'; 
import { likesLoader } from './loaders/likesLoader'; 


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />} errorElement={<ErrorElement/>}>
    <Route index element={<Home />} />

    <Route path="/hostels" element={<HostelsListing />} loader={hostelsLoader}/>
    <Route path="/hostels/:hostelname" element={<Hostel />} loader={hostelLoader}/>
    <Route path="/flats" element={<FlatListing />} loader={flatsLoader}/>
    <Route path="/flats/:flatname" element={<Flat />} loader={flatLoader}/>

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/login/forgot-password" element={<ForgotPassword />} />
    <Route path="/user/reset-password" element={<ResetPassword />} />
    <Route path="/user/likes" element={<Likes />} loader={likesLoader}/>


    <Route path="/test" element={<Test />} />
    
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
