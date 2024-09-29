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
      <div className="flex flex-col w-full">
        <div className="font-1 text-3xl mb-8">Your Hostels</div>
        <OwnedHostels setHostels={setHostels} hostels={hostels} />
      </div>
    </div>
  );
};

export default HostelManager;
