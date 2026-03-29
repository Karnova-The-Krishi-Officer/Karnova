import React from 'react';
import { useAppStore } from '../store/appStore';

const ToastContainer = () => {
  const notifications = useAppStore((s) => s.notifications);

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {notifications.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default React.memo(ToastContainer);
