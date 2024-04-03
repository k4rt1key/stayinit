import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-color1">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600">Page not found</p>
        <p className="text-lg text-gray-600 mt-4 mb-8">
          The page you are looking for might be under construction or does not
          exist.
        </p>
        <Link
          to="/"
          className="bg-colorG text-white font-bold py-2 px-4 rounded"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
