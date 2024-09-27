"use client";

import React, { useState } from "react";
import { Link, NavLink, useRoutes } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Heart, User, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/Auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authData, logoutContextFunction } = useAuth();
  const { isAuthenticate, profile } = authData;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navbarItems = isAuthenticate
    ? [
        {
          key: "Logout",
          link: window.location,
          icon: <LogOut size={20} />,
          text: "Logout",
          onClick: logoutContextFunction,
        },
        {
          key: "Likes",
          link: "/user/likes",
          icon: <Heart size={20} />,
          text: "Likes",
          onClick: () => {},
        },
        {
          key: "User",
          icon: <User size={20} />,
          link: "/",
          text: profile ? profile.username : "User",
          onClick: () => {},
        },
      ]
    : [
        {
          key: "Login",
          link: `/login?returnUrl=${window.location.pathname}${window.location.search}`,
          icon: <LogIn size={20} />,
          text: "Login",
          state: { returnUrl: window.location.pathname },
          onClick: () => {},
        },
        {
          key: "Register",
          link: "/register",
          icon: <UserPlus size={20} />,
          text: "Signup",
          onClick: () => {},
        },
      ];

  const NavbarItem = ({ item }) => (
    <Link
      to={item.link}
      onClick={item.onClick}
      className={`p-2 px-4 text-lg rounded-full hover:bg-gray-100 transition-colors duration-200 flex gap-4 items-center justify-center`}
      title={item.text}
    >
      {item.icon}
      {item.text}
      <span className="sr-only">{item.text}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className={`max-w-6xl mx-auto px-4`}>
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="font-1 text-2xl">Stayinit</div>
            </Link>
          </div>

          <div className="hidden sm:flex gap-3 sm:items-center">
            {navbarItems.map((item) => (
              <NavbarItem key={item.key} item={item} />
            ))}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 text-center space-y-1">
            {navbarItems.map((item) => (
              <Link
                key={item.key}
                to={item.link}
                onClick={() => {
                  item.onClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center text-center px-6 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {item.icon}
                <span className="ml-3">{item.text}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
