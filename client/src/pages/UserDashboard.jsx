import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboard from "../components/UserDashboard";
import useAuth from "../contexts/Auth";

export default function UserDashboardLayout() {
  const { authData } = useAuth();
  const { isAuthenticated, profile } = authData;
  const navigate = useNavigate();

  const userProfile = {
    username: profile?.username,
    email: profile?.email,
    phoneNumber: profile?.phoneNumber,
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:block md:w-2/5 h-full">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Dashboard background showing a modern office workspace"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-3/5 p-4 md:p-8 overflow-y-auto">
        <UserDashboard profile={userProfile} />
      </div>
    </div>
  );
}
