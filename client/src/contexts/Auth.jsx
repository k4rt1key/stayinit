import React, { createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

function Auth({ children }) {

    const [authData, setAuthData] = React.useState({ isAuthenticate: false, profile: undefined })
    const navigate = useNavigate()

    React.useEffect(() => {
        async function verifyUser() {

            const token = localStorage.getItem('token')

            if (token) {

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }

                const response = await fetch("http://localhost:5000/api/v1/auth/is-authenticate", requestOptions);
                const jsonResponse = await response.json()
                const data = jsonResponse.data;

                const isAuthenticate = jsonResponse.success;

                if (isAuthenticate) {
                    const profile = data;
                    setAuthData({
                        isAuthenticate: isAuthenticate,
                        profile: profile
                    })
                }
            }
        }

        verifyUser()
    }, [])

    function loginContextFunction(jsonResponse) {

        localStorage.setItem('token', jsonResponse.token)
        const isAuthenticate = jsonResponse.success;
        const profile = jsonResponse.data.profile;

        setAuthData({ isAuthenticate, profile })
    }

    function logoutContextFunction() {

        localStorage.removeItem('token')
        setAuthData({ isAuthenticate: false, profile: undefined })
        navigate('/login');

    }

    return (
        <AuthContext.Provider value={{ authData, loginContextFunction, logoutContextFunction }}>
            {children}
        </AuthContext.Provider >
    );
}

export { useAuth, Auth };