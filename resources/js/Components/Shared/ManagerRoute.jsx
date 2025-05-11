import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePage } from '@inertiajs/inertia-react';

const ManagerRoute = ({ children }) => {
    const { auth } = usePage().props;

    if (!auth.user) {
        return <Navigate to="/login" />;
    }

    if (auth.user.role_slug !== 'manager') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ManagerRoute;
