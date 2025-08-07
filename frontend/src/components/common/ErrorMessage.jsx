// Component hiển thị thông báo lỗi
import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <XCircleIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;