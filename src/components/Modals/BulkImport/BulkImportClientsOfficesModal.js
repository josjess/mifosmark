import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const BulkImportClientsModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [bulkImportFile, setBulkImportFile] = useState(null);
    const [importType, setImportType] = useState('clients'); // Default to 'clients'
    const [uploadStatus, setUploadStatus] = useState(null); // For tracking upload progress/status

    const handleFileChange = (e) => {
        setBulkImportFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bulkImportFile) {
            showNotification('Please upload a file before submitting.', 'error');
            return;
        }

        const API_BASE_URL = API_CONFIG.baseURL;
        const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

        const headers = {
            'Authorization': `Basic ${AUTH_TOKEN}`,
            'Fineract-Platform-TenantId': 'default',
        };

        const formData = new FormData();
        formData.append('file', bulkImportFile);

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/bulkimport/${importType}`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
                setUploadStatus('Failed');
            } else {
                showNotification('File imported successfully!', 'success');
                setUploadStatus('Success');
                closeModal();
            }
        } catch (error) {
            showNotification('Error connecting to API', 'error');
            console.error('Error:', error);
            setUploadStatus('Failed');
        } finally {
            stopLoading();
        }
    };

    return (
        <div>
            <h2 className="modal-title">Bulk Import Clients/Offices</h2>
            <form onSubmit={handleSubmit}>
                <label>Import Type</label>
                <select
                    name="importType"
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    required
                >
                    <option value="clients">Clients</option>
                    <option value="offices">Offices</option>
                </select>

                <label>Upload File</label>
                <input
                    type="file"
                    name="bulkImportFile"
                    onChange={handleFileChange}
                    required
                />

                <button type="submit">Submit</button>

                {uploadStatus && <p>Upload Status: {uploadStatus}</p>}
            </form>
        </div>
    );
};

export default BulkImportClientsModal;
