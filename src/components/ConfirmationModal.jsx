import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">Are you sure you want to delete this entry?</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
