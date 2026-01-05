import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
    studentName: string;
    onClose: () => void;
    autoClose?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
    studentName,
    onClose,
    autoClose = 10000,
}) => {
    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(onClose, autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    return (
        <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 animate-bounce">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">⚠️ 졸음 감지!</p>
                        <p className="mt-1 text-sm text-gray-500">
                            <span className="font-semibold">{studentName}</span> 학생에게서 졸음이 감지되었습니다.
                        </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;
