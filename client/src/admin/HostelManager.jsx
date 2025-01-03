import React, { useState, useEffect } from "react";
import OwnedHostels from "./YourHostels";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import getHostels from "../BackendUtils/getHostels";

const HostelManager = () => {
  const [hostels, setHostels] = useState([]);
  const [rerender, setRerender] = useState(true);
  const { authData, loginContextFunction, logoutContextFunction } = useAuth();
  const { isAuthenticate, profile } = authData;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHostels() {
      const token = localStorage.getItem("token");
      const response = await getHostels(token);
      if (response.success) {
        setHostels(response.data);
      }
    }

    fetchHostels();
  }, [rerender]);

  if (!isAuthenticate) {
    // return navigate("/login?returnUrl=/dashboard/hostellist");
  }

  return (
    <div className="flex gap-10 px-[1.5rem] lg:px-[10rem] py-[2rem]">
      <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center p-6 w-[97%] rounded-2xl bg-gray-100">
        <h1 className="text-lg md:text-3xl text-center font-1">
          Your Hostels
        </h1>
      </div>
        <OwnedHostels setHostels={setHostels} hostels={hostels} />
      </div>
    </div>
  );
};

export default HostelManager;
