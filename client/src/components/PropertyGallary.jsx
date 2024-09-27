import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PropertyGallery({ images }) {
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openFullScreen = (index) => {
    setCurrentImageIndex(index);
    setShowFullScreen(true);
  };

  const closeFullScreen = () => {
    setShowFullScreen(false);
  };

  const navigateImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === "prev") {
        return prevIndex > 0 ? prevIndex - 1 : images.length - 1;
      } else {
        return prevIndex < images.length - 1 ? prevIndex + 1 : 0;
      }
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 relative">
          {images[0] ? (
            <img
              src={images[0]}
              alt="Main property image"
              className="w-full h-[400px] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-[400px] bg-gray-200 rounded-lg"></div>
          )}
          <button
            onClick={() => openFullScreen(0)}
            className="absolute bottom-4 left-4 bg-white bg-opacity-80 text-black px-4 py-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            View all
          </button>
        </div>
        <div className="hidden md:block space-y-4">
          {images[1] ? (
            <img
              src={images[1]}
              alt="Property image 2"
              className="w-full h-[192px] object-cover rounded-lg cursor-pointer"
              onClick={() => openFullScreen(1)}
            />
          ) : (
            <div className="w-full h-[192px] bg-gray-200 rounded-lg"></div>
          )}
          {images[2] ? (
            <img
              src={images[2]}
              alt="Property image 3"
              className="w-full h-[192px] object-cover rounded-lg cursor-pointer"
              onClick={() => openFullScreen(2)}
            />
          ) : (
            <div className="w-full h-[192px] bg-gray-200 rounded-lg"></div>
          )}
        </div>
      </div>

      {showFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            aria-label="Close fullscreen view"
          >
            <X size={24} />
          </button>
          <button
            onClick={() => navigateImage("prev")}
            className="absolute left-4 text-white hover:text-gray-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigateImage("next")}
            className="absolute right-4 text-white hover:text-gray-300"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute top-4 left-4 text-white text-sm">
            {currentImageIndex + 1} of {images.length}
          </div>
          <img
            src={images[currentImageIndex]}
            alt={`Property image ${currentImageIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
