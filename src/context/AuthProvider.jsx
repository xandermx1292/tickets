import React, {createContext, useState} from "react";

export const AuthContext = createContext({
    auth: null,
    setAuth: () => {}
})


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user"))
    })
    return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}

