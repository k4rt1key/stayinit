import React from "react";
import { Edit, Trash2, Eye, MapPin } from "lucide-react";

const DashboardCards = ({ hostel, onDelete, onEdit, onView }) => {
  return (
    <div className="relative h-[28rem] sm:h-80 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl mb-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${hostel.images[0] || "/images/property.png"})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl sm:text-3xl font-1 text-white mb-2">
              {hostel.uniqueName}
            </h2>
            <div className="flex items-center text-white/80">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {hostel.city}, {hostel.locality}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full">
            {hostel.priceAndSharing ? hostel.priceAndSharing[0]?.sharing : 0}{" "}
            Sharing
          </span>
        </div>
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline">
              <span className="text-3xl font-bold text-white">
                ₹
                {hostel.priceAndSharing ? hostel.priceAndSharing[0]?.price : -1}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onView(hostel.uniqueName);
                }}
                className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="View details"
              >
                <Eye className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
              </button>
              <button
                onClick={(hostel) => onEdit(hostel._id)}
                className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                aria-label="Edit flat"
              >
                <Edit className="w-6 h-6 sm:w-5 sm:h-5 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(hostel._id);
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
