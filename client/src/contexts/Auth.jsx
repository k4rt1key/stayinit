import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

async function getAccessTokenFromRefreshToken() {
  // check if user has refresh token --> if yes then generate new token based on refresh token
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      "http://localhost:5000/api/v1/auth/validate-refresh-token",
      requestOptions
    );
    const jsonResponse = await response.json();

    if (jsonResponse.success) {
      localStorage.setItem("token", jsonResponse.token);
      localStorage.setItem("refreshToken", jsonResponse.refreshToken);

      const isAuthenticate = jsonResponse.success;
      const profile = jsonResponse.data;

      setAuthData({ isAuthenticate, profile });
    } else {
      localStorage.removeItem("token");
      setAuthData({ isAuthenticate: false, profile: undefined });
    }
  } else {
    localStorage.removeItem("token");
    setAuthData({ isAuthenticate: false, profile: undefined });
    navigate("/login");
  }
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function Auth({ children }) {
  const [authData, setAuthData] = React.useState({
    isAuthenticate: false,
    profile: undefined,
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem("token");

      if (token) {
        const requestOptions = {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const response = await fetch(
          "http://localhost:5000/api/v1/auth/is-authenticate",
          requestOptions
        );
        const jsonResponse = await response.json();
        const data = jsonResponse.data;

        const isAuthenticate = jsonResponse.success;

        if (isAuthenticate) {
          const profile = data;
          setAuthData({
            isAuthenticate: isAuthenticate,
            profile: profile,
          });
        } else {
          getAccessTokenFromRefreshToken();
        }
      } else {
        getAccessTokenFromRefreshToken();
      }
    }

    verifyUser();
  }, []);

  function loginContextFunction(jsonResponse) {
    localStorage.setItem("token", jsonResponse.token);
    localStorage.setItem("refreshToken", jsonResponse.refreshToken);

    const isAuthenticate = jsonResponse.success;
    const profile = jsonResponse.data;

    setAuthData({ isAuthenticate, profile });
  }

  function logoutContextFunction() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")} `,
      },
    };

    async function logout() {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/logout",
        requestOptions
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        setAuthData({ isAuthenticate: false, profile: undefined });
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    }

    logout();
  }

  return (
    <AuthContext.Provider
      value={{ authData, loginContextFunction, logoutContextFunction }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, Auth };
