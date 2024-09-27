import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  async function handleEmailSubmit(event) {
    event.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auth/register/send-verification-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        setIsOtpSent(true);
        setError("");
      } else {
        setIsOtpSent(false);
        setError(jsonResponse.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, email }),
        }
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        setIsUserVerified(true);
        setError("");
      } else {
        setIsUserVerified(false);
        setError(jsonResponse.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSignupInput(event) {
    const { name, value } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: signupData.username,
            email: email,
            phoneNumber: signupData.phoneNumber,
            password: signupData.password,
            confirmPassword: signupData.confirmPassword,
          }),
        }
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        searchParams.set("returnUrl", window.location.pathname);
        setSearchParams(searchParams);
        navigate("/login");
        setError("");
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
            Create your account
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your account
            </Link>
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded p-2">
              {error}
            </div>
          )}

          {!isOtpSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : !isUserVerified ? (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent an OTP to {email}. Please enter it below.
                </p>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  value={signupData.username}
                  onChange={handleSignupInput}
                />
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  value={signupData.phoneNumber}
                  onChange={handleSignupInput}
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
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  value={signupData.password}
                  onChange={handleSignupInput}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm"
                  value={signupData.confirmPassword}
                  onChange={handleSignupInput}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80"
          alt="Background"
        />
      </div>
    </div>
  );
}
