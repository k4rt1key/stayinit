import React, { useState, useEffect } from "react";
import { useRouteError, Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Auth } from "../contexts/Auth";

export default function ErrorElement() {

    const error = useRouteError();
    const str = "adhasd"

    return (
        <Auth>
            <Navbar />
            <div className="flex items-center justify-center h-screen bg-colorY">
                <div className="text-center flex flex-col gap-10">
                    <h1 className="text-6xl font-bold text-gray-800">{error.message.charAt(0).toUpperCase() + str.slice(1)}</h1>
                    <p className="text-xl text-gray-600">This might be internal server error</p>
                    <Link to="/" className="bg-colorG text-white font-bold py-2 px-4 rounded">
                        Go Home
                    </Link>
                </div>
            </div>
            <Footer />
        </Auth>
    );
}