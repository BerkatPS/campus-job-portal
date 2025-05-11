import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePage } from '@inertiajs/inertia-react';

const AdminRoute = ({ children }) => {
    const { auth } = usePage().props;

    if (!auth.user) {
        return <Navigate to="/login" />;
    }

    if (auth.user.role_id !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default AdminRoute;
