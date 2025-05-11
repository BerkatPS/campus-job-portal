// resources/js/Components/Shared/Toast.jsx
import React, { useEffect } from 'react';
import { ToastContainer as ReactToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Komponen Toast Container yang harus ditempatkan di layout atau halaman
export const ToastContainerWrapper = () => (
    <ReactToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
    />
);

// Fungsi helper untuk menampilkan toast
export const showToast = (message, type = 'success') => {
    const options = {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    switch (type) {
        case 'success':
            toast.success(message, options);
            break;
        case 'error':
            toast.error(message, options);
            break;
        case 'warning':
            toast.warning(message, options);
            break;
        case 'info':
            toast.info(message, options);
            break;
        default:
            toast(message, options);
    }
};

// Komponen Toast yang bisa langsung digunakan dalam JSX
const Toast = ({ message, type = 'success', show = false }) => {
    useEffect(() => {
        if (show && message) {
            showToast(message, type);
        }
    }, [show, message, type]);

    return null;
};

export default Toast;
