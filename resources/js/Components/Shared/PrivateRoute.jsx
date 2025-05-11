import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePage } from '@inertiajs/inertia-react';

const PrivateRoute = ({ children }) => {
    const { auth } = usePage().props;

    if (!auth.user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
