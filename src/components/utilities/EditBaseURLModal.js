import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import './EditBaseURLModal.css';

const EditBaseURLModal = ({ isOpen, onClose }) => {
    const { baseURL, tenantId, updateBaseURL, updateTenantId, logout } = useContext(AuthContext);
    const [newBaseURL, setNewBaseURL] = useState(baseURL || "https://");
    const [newTenantId, setNewTenantId] = useState(tenantId || "");
    const [confirmChange, setConfirmChange] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

    const handleBaseURLChange = (e) => {
        let value = e.target.value;
        if (!value.startsWith("https://")) {
            value = "https://";
        }
        if (value.endsWith("/") && value.length > 8) {
            value = value.slice(0, -1);
        }
        setNewBaseURL(value);
    };

    const handleTenantIdChange = (e) => {
        setNewTenantId(e.target.value);
    };

    const handleSave = () => {
        updateBaseURL(newBaseURL);
        updateTenantId(newTenantId);
        onClose();
        logout();
        alert("Base URL and Tenant ID updated successfully! You have been logged out.");
    };

    const handleProceedToConfirmation = () => {
        setIsConfirmationModalOpen(true);
    };

    const handleCancelConfirmation = () => {
        setIsConfirmationModalOpen(false);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="Edit-URL-modal-overlay">
                <div className="Edit-URL-modal-content">
                    <h4 className="Edit-URL-modal-title">Edit Base URL</h4>
                    <div className="Edit-URL-warning-section">
                        <p className="Edit-URL-warning-text">
                            <strong>Warning:</strong> Changing the Base URL is a critical setting. Ensure you know what
                            you are doing. Incorrect changes may disrupt the application's functionality. Proceed only
                            if absolutely necessary.
                        </p>
                        <div className="Edit-URL-confirmation-checkbox">
                            <input
                                type="checkbox"
                                id="confirmChange"
                                checked={confirmChange}
                                onChange={(e) => setConfirmChange(e.target.checked)}
                            />
                            <label htmlFor="confirmChange">
                                I understand the consequences and want to proceed
                            </label>
                        </div>
                    </div>
                    {confirmChange && (
                        <>
                        <div className="Edit-URL-input-group">
                            <label htmlFor="baseURL" className="Edit-URL-label">
                                Base URL <span>*</span>
                            </label>
                            <input
                                type="text"
                                id="baseURL"
                                value={newBaseURL}
                                onChange={handleBaseURLChange}
                                className="Edit-URL-input"
                                required
                            />
                        </div>
                        <div className="Edit-URL-input-group">
                            <label htmlFor="tenantId" className="Edit-URL-label">
                                Tenant ID <span>*</span>
                            </label>
                            <input
                                type="text"
                                id={"tenantId"}
                                value={newTenantId}
                                onChange={handleTenantIdChange}
                                className={"Edit-URL-input"}
                                required
                            />
                        </div>
                        </>
                    )}
                    <div className="Edit-URL-modal-actions">
                        <button onClick={onClose} className="Edit-URL-cancel-button">
                            Cancel
                        </button>
                        {confirmChange && (
                            <button
                                onClick={handleProceedToConfirmation}
                                className="Edit-URL-proceed-button"
                                disabled={!newBaseURL
                                    || newBaseURL === "https://" ||
                                    !newTenantId ||
                                    (newBaseURL === baseURL && newTenantId === tenantId)
                            }
                            >
                                Proceed
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isConfirmationModalOpen && (
                <div className="Edit-URL-confirm-modal-overlay">
                    <div className="Edit-URL-confirm-modal-content">
                        <h4 className="Edit-URL-modal-title">Confirm Base URL</h4>
                        <p className="Edit-URL-confirm-text">
                            You are about to set the Base URL to: <strong>{newBaseURL}</strong> and Tenant ID to: {" "}
                            <strong>{newTenantId}</strong>
                        </p>
                        <div className="Edit-URL-modal-actions">
                            <button onClick={handleCancelConfirmation} className="Edit-URL-cancel-button">
                                Edit
                            </button>
                            <button onClick={handleSave} className="Edit-URL-confirm-button">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditBaseURLModal;
