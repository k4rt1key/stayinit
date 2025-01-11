import React, { useState, useEffect } from "react";
import DashboardCardsForHostel from "../components/DashboardCardsForHostel";
import { useNavigate } from "react-router-dom";
import deleteHostel from "../BackendUtils/deleteHostel";
import { UserCircle, Building, Home, Plus, List } from "lucide-react";
import { toast } from "react-toastify";


const OwnedHostels = ({ hostels, setHostels }) => {
  const navigate = useNavigate();

  async function onDelete(id) {
    console.log("ONDELETE", id);
    const token = localStorage.getItem("token");
    await deleteHostel(id, token);
    setHostels(hostels.filter((h) => h._id !== id));
    toast.success(`flat deleted successfully !!!`)

    navigate('/dashboard/hostellist')
  }

  const onEdit = async (id) => {
    console.log("Edit hostel with id: ", id);
  };

  const onView = async (uniqueName) => {
    return navigate("/listing/hostel/" + uniqueName);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 flex-wrap">
      {hostels.length == 0 && (
        <div className="flex flex-col gap-8">
          <div className="p-6 text-2xl">No Hostels found!!!</div>
          <div className="flex gap-8">
            <button
              onClick={() => navigate("/dashboard/add-flat")}
              className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-indigo-600 transition-colors duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your Flat
            </button>
            <button
              onClick={() => navigate("/dashboard/add-hostel")}
              className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-indigo-600 bg-gray-200 transition-colors duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your Hostel
            </button>
          </div>
        </div>
      )}
      {hostels.map((h) => {
        return (
          <>
            <DashboardCardsForHostel
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
              hostel={h}
            />
          </>
        );
      })}
    </div>
  );
};

export default OwnedHostels;
