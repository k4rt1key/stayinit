import React, { useState, useEffect } from "react";
import { Auth } from "../contexts/Auth";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <Auth>
      <div className="font-2 h-screen m-0 p-2 md:p-0 flex flex-col justify-between gap-2">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </Auth>
  );
}
