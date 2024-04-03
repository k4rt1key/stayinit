import React, { useState, useEffect } from "react";
import { Auth } from "../contexts/Auth";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <Auth>
      <div className="font-2 h-screen w-auto m-0 p-0 bg-color1 flex flex-col justify-between gap-2">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </Auth>
  );
}
