import React, { useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function User() {
  const { authData } = useAuth();
  const { isAuthenticate, profile } = authData;

  const [username, setUsername] = useState(profile ? profile.username : "");
  const navigate = useNavigate();

  return (
    <div>
      <h1>Hello! {username}</h1>
      <div>
        {/* Profile Photo */}
        <div>
          <img src="" alt="" />
          <button>Edit</button>
          <input type="text" />
        </div>

        {/* Userupdation-Form */}
        <div>
          <form action=""></form>
        </div>

        {/* Password-Updation-Form */}
        <div></div>
      </div>
      cd
    </div>
  );
}
