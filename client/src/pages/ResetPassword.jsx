import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handlePasswordsSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const resetToken = searchParams.get("token");
      const email = searchParams.get("email");
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auth/user/verify-reset-password-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
            token: resetToken,
            email: email,
          }),
        }
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        searchParams.set("returnUrl", window.location.pathname);
        setSearchParams(searchParams);
        navigate("/login");
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-indigo-600">
        <img
          src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt="Reset Password Illustration"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full  max-w-md space-y-8">
          <div className="">
            <h2 className="mt-6 text-center text-3xl text-gray-900 font-1">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
          <form onSubmit={handlePasswordsSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="text-sm text-red-600 bg-red-100 border border-red-400 rounded p-2">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-4 rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loading size={"small"} />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
