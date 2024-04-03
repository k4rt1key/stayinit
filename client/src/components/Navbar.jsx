"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/Auth";

export default function Navbar() {
  // toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // authentication states
  const { authData, logoutContextFunction } = useAuth();
  const { isAuthenticate, profile } = authData;

  // navbar items list
  const navbarItems = [];
  if (isAuthenticate) {
    navbarItems.push({
      key: "Logout",
      link: window.location,
      icon: "login.png",
      text: "Logout",
      onClick: logoutContextFunction,
    });
    navbarItems.push({
      key: "Likes",
      link: "/user/likes",
      icon: "heart.png",
      text: "Likes",
      onClick: () => {},
    });
    navbarItems.push({
      key: "User",
      icon: "user.png",
      link: "/",
      target: "_blank",
      text: profile ? profile.username : "User",
      onClick: () => {},
    });
  } else {
    navbarItems.push({
      key: "Login",
      link: `/login?returnUrl=${window.location.pathname}${window.location.search}`,
      icon: "login.png",
      text: "Login",
      state: { returnUrl: window.location.pathname },
      onClick: () => {},
    });
    navbarItems.push({
      key: "Register",
      link: "/register",
      target: "_blank",
      icon: "user.png",
      text: "Signup",
      onClick: () => {},
    });
  }

  const navbarItemsList = navbarItems.map((item) => {
    return (
      <div key={item.key} onClick={item.onClick}>
        <Link to={item.link} target={`${item.target || ""}`} className="">
          <div className="text-xl flex flex-row gap-3 py-3 px-6 items-center hover:bg-color1 rounded-[0.5rem]">
            <img src={`/icons/${item.icon}`} className="w-5 h-5" alt="" />{" "}
            <span>{item.text}</span>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <div
      className="w-full px-[2rem] lg:px-[10rem] py-[0.5rem] 
                bg-[#FFFBF2] 
                sticky top-0 z-20"
    >
      <div
        className="flex items-center justify-between 
                   max-w-7xl py-1"
      >
        {/* logo */}
        <div className="inline-flexoverflow-hidden h-[2rem]">
          <Link
            to="/"
            className="h-full w-full flex  justify-center items-center cursor-pointer "
          >
            <img src="/stayinit.svg" className=" h-[8rem] w-[8rem] " />
          </Link>
        </div>

        {/* navbar items list for large screen */}
        <div className="hidden lg:block">
          <div className="inline-flex space-x-6">{navbarItemsList}</div>
        </div>

        {/* toggle menu */}
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>

        {/* mobile view */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-color1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex flex-row items-center justify-center">
                  {/* logo */}
                  <div className="inline-flexoverflow-hidden h-[2rem]">
                    <Link
                      to="/"
                      className="h-full w-full flex  justify-center items-center cursor-pointer "
                    >
                      <img
                        src="/stayinit.svg"
                        className=" h-[8rem] w-[8rem] "
                      />
                    </Link>
                  </div>

                  {/* close button */}
                  <div className="-mr-2 absolute top-8 right-8">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-8 w-8" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                {/* navbar items */}
                <div className="mt-6">
                  <nav className="">
                    <div className="flex flex-col gap-4 items-center">
                      {navbarItemsList}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
