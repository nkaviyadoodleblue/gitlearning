import { useAppSelector } from '@/hooks/use-selector';
import { Navigate, Outlet } from 'react-router-dom';

export default function Protected() {

    const isAuthenticated = !!useAppSelector(state => state?.auth?.user);

    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}
