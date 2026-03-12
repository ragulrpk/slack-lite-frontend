import React from "react";

const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white shadow-xl animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-lg font-semibold text-red-600">Access Denied</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5 text-gray-700">
          {message}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-4 py-3">
          {/* <button
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-1.5 text-sm hover:bg-gray-300"
          >
            Cancel
          </button> */}
          {/* <button
            onClick={onClose}
            className="rounded-md bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700"
          >
            OK
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default ErrorPopup;
