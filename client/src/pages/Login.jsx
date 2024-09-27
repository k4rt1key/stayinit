import React, { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../contexts/Auth";
import { Spinner } from "@material-tailwind/react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginContextFunction, authData } = useAuth();
  const { isAuthenticate } = authData;
  const location = useLocation();
  const { returnUrl } = location.state || {
      returnUrl: searchParams.get("returnUrl"),
    } || { returnUrl: "/" };

  if (isAuthenticate) {
    navigate("/");
  }

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLoginInput(event) {
    const { name, value } = event.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginData.email.toLowerCase(),
            password: loginData.password,
          }),
        }
      );

      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        loginContextFunction(jsonResponse, returnUrl);
        navigate(returnUrl || "/");
      } else {
        setError(jsonResponse.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-1 text-gray-900 mb-6">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                value={loginData.email}
                onChange={handleLoginInput}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                value={loginData.password}
                onChange={handleLoginInput}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/login/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt="Background"
        />
      </div>
    </div>
  );
}
