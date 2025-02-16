import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const TimeoutSettingsModal = ({ isOpen, onClose }) => {
    const { inactivityTimeout, updateInactivityTimeout } = useContext(AuthContext);
    const [timeoutValue, setTimeoutValue] = useState(inactivityTimeout / 60000);

    const handleSave = () => {
        updateInactivityTimeout(timeoutValue);
        onClose();
    };

    const isInvalid = !timeoutValue || isNaN(timeoutValue) || timeoutValue < 5;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="Edit-URL-modal-title">Inactivity Timeout Settings</h2>
                <div className="Edit-URL-input-group">
                    <label>Auto logout after? (minutes) minimum - 5:</label>
                    <input
                        type="number"
                        value={timeoutValue}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setTimeoutValue(newValue > 0 ? newValue : "");
                        }}
                        min="5"
                        className="Edit-URL-input"
                    />
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="Edit-URL-cancel-button">Cancel</button>
                    <button
                        onClick={handleSave}
                        className="Edit-URL-proceed-button"
                        disabled={isInvalid}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimeoutSettingsModal;
