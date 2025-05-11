import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePage } from '@inertiajs/inertia-react';

const CandidateRoute = ({ children }) => {
    const { auth } = usePage().props;

    if (!auth.user) {
        return <Navigate to="/login" />;
    }

    if (auth.user.role_slug !== 'candidate') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default CandidateRoute;
