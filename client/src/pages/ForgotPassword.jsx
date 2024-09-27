import React, { useState } from "react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [email, setEmail] = useState("");

  async function sendMail(email) {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auth/user/send-reset-password-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success) {
        setIsValidEmail(true);
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

  function handleSubmit(e) {
    e.preventDefault();
    sendMail(email);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80"
          alt="Forgot Password Illustration"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 font-1">
            Reset your password
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your account
            </a>
          </p>

          <div className="mt-8">
            {isValidEmail ? (
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-4">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your email to reset your password.
                </p>
                <div className="space-y-4">
                  <a
                    href="/"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go Back Home
                  </a>
                  <a
                    href="/login"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Go Back to Login
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="text-sm text-red-600 bg-red-100 border border-red-400 rounded p-2"
                    role="alert"
                  >
                    {error}
                  </div>
                )}
                <div className="space-y-2">
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your email registered with us"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
