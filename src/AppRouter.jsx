import React, { useContext } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/public/Login"
import SignUp from "./pages/public/SignUp"
import { AuthContext } from "./context/AuthProvider"
import Home from "./pages/private/Home"
import BaseLayout from "./layout/BaseLayout"
import Notices from "./pages/private/Notices"
import Setting from "./pages/private/Setting"
import Tickets from "./pages/private/Tickets"
import { ROUTES } from "./utils/const"

export const AppRouter = () => {
    const { auth } = useContext(AuthContext)
    // Manejo del enrutamiento en función si el usuario inició o no sesión
    // Todos lo que esta aquí se entenderá mejor si revisa las constantes
    return (
        <BrowserRouter>
            <Routes>

                {!auth.token && (
                    <>
                        <Route path={ROUTES.MAIN} element={<Navigate to={ROUTES.LOGIN} replace />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
                    </>
                )}

                {auth.token && (
                    <Route element={<BaseLayout />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.NOTICES} element={<Notices />} />
                        <Route path={ROUTES.SETTINGS} element={<Setting />} />
                        <Route path={ROUTES.TICKETS} element={<Tickets />} />
                        <Route path={ROUTES.REDIRECT} element={<Navigate to={ROUTES.MAIN} replace />} />
                    </Route>
                )}

                <Route path={ROUTES.ROUTE_404} element={<h1>Página no encontrada</h1>} />
                <Route path={ROUTES.REDIRECT} element={<Navigate to={ROUTES.ROUTE_404} replace />} />
            </Routes>
        </BrowserRouter>
    )

} 