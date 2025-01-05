import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
    
import { useAuth } from "../contexts/Auth";
import { useNavigate } from "react-router-dom";


export default function Layout() {

    const { authData, loginContextFunction, logoutContextFunction } = useAuth();
    const { isAuthenticate } = authData;
    const navigate = useNavigate();
    
    React.useEffect(() => {
        if (!isAuthenticate) {
            navigate("/login");
        }
    }, [isAuthenticate, navigate]);
    

    return (
        <Outlet />
    );
}
