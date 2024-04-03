import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [email, setEmail] = useState("");

  async function sendMail(email) {
    try {
      setLoading(() => true);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      };

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/auth/user/send-reset-password-token`,
        requestOptions
      );
      const jsonResponse = await response.json();

      if (jsonResponse.success === true) {
        toast.success(jsonResponse.message);
        setIsValidEmail(() => true);
        setError(() => "");
      } else {
        toast.error(jsonResponse.message);
        setError(() => jsonResponse.message);
      }

      setLoading(() => false);
    } catch (error) {
      toast.error(error.message);
      throw new Error(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-color1 ">
      {isValidEmail ? (
        <div className="flex flex-col gap-6">
          <h1 className="text-xl">
            Follow the link send to {email} for reset password...{" "}
          </h1>
          <Link
            to="/"
            className="text-white text-center rounded-[3rem] p-3 bg-colorG"
          >
            Go Back Home
          </Link>
          <Link
            to="/login"
            className="text-white text-center rounded-[3rem] p-3 bg-colorG"
          >
            {" "}
            Go Back to Login{" "}
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMail(email);
          }}
          className="flex flex-col gap-8 items-center w-[20rem]"
        >
          <div>
            <h1 className="text-3xl font-1">Reset Password</h1>
            <h6>Enter the email registerd with your account</h6>
            <p className="text-red-500 mt-2">
              {error !== "" ? error.toLocaleUpperCase() : ""}
            </p>
          </div>

          <input
            type="text"
            value={email}
            placeholder="Enter your email registered with us"
            className="flex w-full rounded-[3rem] border-2 border-[#d5bf9f] hover:bg-color1 px-3 py-3 text-sm placeholder:text-[#073937] focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="bg-colorG w-full flex justify-center cursor-pointer text-[#FFFBF2] px-4 py-4 rounded-[3rem] md-down: my-5"
          >
            {loading ? <Spinner color="white" size="sm" /> : "Verify Email"}
          </button>
        </form>
      )}

      {error !== "" && (
        <div>
          <h1 className="mt-6 px-3 w-full py-[1rem] bg-red-200 text-white rounded-[3rem]">
            {error}
          </h1>
        </div>
      )}
    </div>
  );
}
