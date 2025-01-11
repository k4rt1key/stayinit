import React, { useState, useEffect } from "react";
import DashboardCards from "../components/DashboardCards";
import { useNavigate } from "react-router-dom";
import deleteFlat from "../BackendUtils/deleteFlat";
import { UserCircle, Building, Home, Plus, List } from "lucide-react";
import { useAuth } from "../contexts/Auth";
import { toast } from "react-toastify";

const OwnedFlats = ({ flats, setFlats }) => {
  const navigate = useNavigate();

  async function onDelete(id) {
    const token = localStorage.getItem("token");
    await deleteFlat(id, token);
    setFlats(flats.filter((f) => f._id !== id));
    toast.success(`flat deleted successfully !!!`)
    navigate('/dashboard/flatlist')
  }

  const onEdit = async (id) => {
    console.log("Edit flat with id: ", id);
  };

  const onView = async (uniqueName) => {
    return navigate("/listing/flat/" + uniqueName);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 flex-wrap">
      {flats.length == 0 && (
        <div className="flex flex-col gap-8">
          <div className="p-6 text-2xl">No flats found!!!</div>
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
      {flats.map((f) => {
        return (
          <>
            <DashboardCards
              flat={f}
              onDelete={onDelete}
              onEdit={onEdit}
              onView={onView}
              setFlats={setFlats}
            />
          </>
        );
      })}
    </div>
  );
};

export default OwnedFlats;
