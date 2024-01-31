import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";


export default function ResetPassword() {


    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handlePasswordsSubmit() {
        try {

            setLoading(() => true)
            const resetToken = searchParams.get("token")
            const email = searchParams.get("email")
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password,
                    confirmPassword,
                    token: resetToken,
                    email: email
                }),
            }
            const response = await fetch('http://localhost:5000/api/v1/auth/user/verify-reset-password-token', requestOptions);
            const jsonResponse = await response.json()

            if (jsonResponse.success === true) {
                toast.success(jsonResponse.message)
                navigate("/login")
            }

            else {
                toast.error(jsonResponse.message);
                setError(() => jsonResponse.message);
            }

            setLoading(() => false)

        } catch (error) {
            toast.error(error.message);
            throw new Error(error.message);
        }

    };

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-colorY">
            <div className='w-[20rem]'>

                <form onSubmit={(event) => {
                    event.preventDefault();
                    handlePasswordsSubmit();
                }}
                    className="flex flex-col gap-4"
                >
                    <h1 className="mb-4 text-3xl text-center font-Classy">Reset Password</h1>

                    <p className='text-red-500'>{error !== "" ? error.toLocaleUpperCase() : ""}</p>


                    <input
                        type="password"
                        placeholder="New Password"
                        className="flex w-full rounded-[3rem] border-2 border-[#d5bf9f] hover:bg-colorY2H px-3 py-3 text-sm placeholder:text-[#073937] focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="flex w-full rounded-[3rem] border-2 border-[#d5bf9f] hover:bg-colorY2H px-3 py-3 text-sm placeholder:text-[#073937] focus:outline-nones"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button type="submit" className="bg-colorG w-full text-[#FFFBF2] px-4 py-3 rounded-[3rem]">
                        Send
                    </button>

                </form>

            </div>
        </div>
    );
};
