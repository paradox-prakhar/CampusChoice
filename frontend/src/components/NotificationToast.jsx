import React, { useEffect } from 'react';

const NotificationToast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto hide after 5s
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 1000,
            animation: 'slideIn 0.3s ease-out'
        }}>
            <span style={{ fontSize: '1.2em' }}>🔔</span>
            <div>
                <strong style={{ display: 'block', fontSize: '0.9em', color: 'var(--color-primary)' }}>Notification</strong>
                <span style={{ fontSize: '0.9em' }}>{message}</span>
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1.2em',
                    marginLeft: '10px'
                }}
            >
                ×
            </button>
        </div>
    );
};

export default NotificationToast;
