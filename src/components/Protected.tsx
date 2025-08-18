import { useAppSelector } from '@/hooks/use-selector';
import React, { ReactNode, useEffect } from 'react'
import { Navigate, Outlet, redirect, useNavigate } from 'react-router-dom';

interface ProtectedProps {
    isAuthenticated: boolean;
}

export default function Protected() {

    // const navigate = useNavigate();

    const isAuthenticated = !!useAppSelector(state => state?.auth?.user);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (!token)
    //         navigate("/login")
    // }, [isAuthenticated])


    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}
