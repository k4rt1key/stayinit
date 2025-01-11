import React from "react";
import { Edit, Trash2, Eye, MapPin } from "lucide-react";

const DashboardCards = ({ flat, onEdit, onDelete, onView }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onView(flat.uniqueName);
      }}
      className="relative h-[28rem] sm:h-80 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl mb-6"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${flat.images[0] || "/images/property.png"})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-2 justify-between items-start">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-1 text-white mb-2">
              {flat.uniqueName}
            </h2>
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {flat.city}, {flat.locality}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
            {flat.sqft} sqft
          </span>
        </div>
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <span className="text-3xl font-bold text-white">
                ₹{flat.price}
              </span>
              <span className="text-sm text-white/80 sm:ml-2 mt-1 sm:mt-0">
                {flat.bhk} BHK
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onView(flat.uniqueName);
                }}
                className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="View details"
              >
                <Eye className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
              </button>
              {/* <button
                onClick={() => onEdit(flat)}
                className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Edit flat"
              >
                <Edit className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
              </button> */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(flat._id);
                }}
                className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Delete flat"
              >
                <Trash2 className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
