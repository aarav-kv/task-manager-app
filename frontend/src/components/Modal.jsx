import React from 'react';
import { X, Mail, UserPlus, Copy, Check } from 'lucide-react';
import '../styles/InviteMemberModal.css';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (


        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96 shadow-lg">

                    <div>{children}</div>
                    <div className="flex justify-end mt-4">

                        <button onClick={() => { onClose(); /* Add delete logic here */ }} className="bg-red-600 text-white px-4 py-2 rounded">Confirm</button>
                    </div>
                </div>
            </div>

            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <h2 className="text-lg font-bold mb-4">Delete</h2>
                        <button onClick={onClose} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-content">
                        <h3 style={{ marginBottom: "10px" }}>{title}</h3>
                        <div>
                            <button
                                onClick={() => { }}
                                className="secondary-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { }}
                                className="delete-btn"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
