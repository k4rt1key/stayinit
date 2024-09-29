import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

async function getAccessTokenFromRefreshToken(setAuthData, navigate) {
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
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/validate-refresh-token`,
      requestOptions
    );
    const jsonResponse = await response.json();

    if (jsonResponse.success) {
      localStorage.setItem("token", jsonResponse.token);
      localStorage.setItem("refreshToken", jsonResponse.refreshToken);

      window.location.reload();

      const isAuthenticate = jsonResponse.success;
      const profile = jsonResponse.data;

      setAuthData({ isAuthenticate, profile });
    } else {
      //   searchParams.set("return-url", window.location.pathname);
      // navigate("/login", { state: { returnUrl: window.location.pathname } });

      localStorage.removeItem("token");
      setAuthData({ isAuthenticate: false, profile: undefined });
    }
  } else {
    localStorage.removeItem("token");
    setAuthData({ isAuthenticate: false, profile: undefined });
    //   searchParams.set("return-url", window.location.pathname);

    // navigate("/login", { state: { returnUrl: window.location.pathname } });
  }
}

export default function useAuth() {
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
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/is-authenticate`,
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
          getAccessTokenFromRefreshToken(setAuthData, navigate);
        }
      } else {
        getAccessTokenFromRefreshToken(setAuthData, navigate);
      }
    }

    verifyUser();
  }, []);

  function loginContextFunction(jsonResponse, returnUrl) {
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        requestOptions
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        setAuthData({ isAuthenticate: false, profile: undefined });
        searchParams.set("return-url", window.location.pathname);
        setSearchParams({ returnUrl: window.location.pathname });
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
