import { createContext, useState } from "react";
export const AuthContext = createContext();
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedInState] = useState(Cookies.get("isLoggedIn") === "true");
    const [isSkippedLoggedIn, setSkippedLoggedInState] = useState(Cookies.get("userSkipped") === "true");
    const isAuthenticated = (isLoggedIn || isSkippedLoggedIn) ? true : false;

    const setLoggedIn = (value) => {
        setLoggedInState(value);
        Cookies.set("isLoggedIn", value.toString(), { expires: 7 }); // Store in cookies
    };

    const setSkippedLoggedIn = (value) => {
        setSkippedLoggedInState(value);
        Cookies.set("userSkipped", value.toString(), { expires: 7 }); // Store in cookies
    };

    const setLogOut = () => {
        setIsLoggedIn(false);
        setUserSkipped(false);
        Cookies.remove("isLoggedIn");
        Cookies.remove("userSkipped");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoggedIn, isSkippedLoggedIn, setLoggedIn, setSkippedLoggedIn, setLogOut }}>
            {children}
        </AuthContext.Provider>
    );

};
