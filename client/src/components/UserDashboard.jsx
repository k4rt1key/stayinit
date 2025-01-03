import React from "react";
import { UserCircle, Building, Home, Plus, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ profile }) => {
  const navigate = useNavigate();
  return (
    <div className=" bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-3xl overflow-hidden">
          {/* User Profile Section */}
          <div className="px-8 py-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="User profile"
                className="w-24 h-24 rounded-full"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-1 font-bold">
                  {profile.username}
                </h2>
                <p className="text-indigo-500 mt-2">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Property Management Section */}
          <div className="px-8 py-12">
            <h3 className="text-2xl font-1 font-semibold text-gray-900 mb-8">
              Manage Your Properties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Flats Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-medium text-gray-700">Flats</h4>
                <button
                  onClick={() => navigate("/dashboard/add-flat")}
                  className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 transition-colors duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your Flat
                </button>
                <button
                  onClick={() => navigate("/dashboard/flatlist")}
                  className="w-full flex items-center justify-center px-6 py-3 text-base  font-medium rounded-full text-black bg-white hover:bg-gray-100 transition-colors duration-300 border border-gray-200"
                >
                  <List className="w-5 h-5 mr-2" />
                  View Your Flats
                </button>
              </div>

              {/* Hostels Section */}
              <div className="space-y-6">
                <h4 className="text-xl font-1 font-medium text-gray-700">
                  Hostels
                </h4>
                <button
                  onClick={() => navigate("/dashboard/add-hostel")}
                  className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                >
                  <Plus className="w-10 h-5 mr-2" />
                  Add Your Hostel
                </button>
                <button
                  onClick={() => navigate("/dashboard/hostellist")}
                  className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-300 border border-indigo-200"
                >
                  <List className="w-5 h-5 mr-2" />
                  View Your Hostels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
