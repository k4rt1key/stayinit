import React, {useState, useEffect} from "react";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorElement(){

    const error = useRouteError()

    console.log("inside error router")

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-gray-100 text-gray-900">
          <p className="text-xl text-gray-600 mb-8">
            {error.message}
          </p>
          <Link to="/"
            className="inline-block px-7 py-3 rounded-lg text-lg font-semibold bg-gray-800 text-white hover:bg-gray-700"
          >
            Go back home
          </Link>
        </div>
    );
}