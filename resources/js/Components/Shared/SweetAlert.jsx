// resources/js/Components/Shared/SweetAlert.jsx
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const SweetAlert = ({
                        title,
                        text,
                        icon,
                        showConfirmButton = true,
                        confirmButtonText = 'Oke',
                        showCancelButton = false,
                        cancelButtonText = 'Batal',
                        onConfirm,
                        onCancel,
                        onClose
                    }) => {
    useEffect(() => {
        if (title && text) {
            Swal.fire({
                title,
                text,
                icon: icon || 'info',
                showConfirmButton,
                confirmButtonText,
                showCancelButton,
                cancelButtonText,
                confirmButtonColor: '#14B8A6', // Match your primary color
                cancelButtonColor: '#6B7280', // Gray color for cancel
                reverseButtons: true,
                allowOutsideClick: icon !== 'success', // Prevent closing by clicking outside for success alerts
            }).then((result) => {
                if (result.isConfirmed) {
                    if (onConfirm) onConfirm();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    if (onCancel) onCancel();
                }

                if (onClose) onClose();
            });
        }
    }, [title, text, icon, showConfirmButton, confirmButtonText, showCancelButton, cancelButtonText, onConfirm, onCancel, onClose]);

    return null;
};

export default SweetAlert;
