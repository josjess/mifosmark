import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BulkImport.css';
import axios from 'axios';

const BulkImport = () => {
    const { entityType } = useParams(); // Get the entity type from the URL
    const [offices, setOffices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [legalForm, setLegalForm] = useState('');
    const [file, setFile] = useState(null);
    const [uploadHistory, setUploadHistory] = useState([]);

    // Map entityType to human-readable titles and additional fields
    const entityConfig = {
        offices: { title: 'Office' },
        users: { title: 'User', fields: ['office', 'staff'] },
        groups: { title: 'Group', fields: ['office', 'staff'] },
        loanaccounts: { title: 'Loan Account', fields: ['office', 'staff'] },
        savingsaccounts: { title: 'Savings Account', fields: ['office', 'staff'] },
        fixeddepositaccounts: { title: 'Fixed Deposit Account', fields: ['office', 'staff'] },
        chartofaccounts: { title: 'Chart of Accounts', fields: ['office', 'staff'] },
        centers: { title: 'Center', fields: ['office', 'staff'] },
        clients: { title: 'Client', fields: ['office', 'staff', 'legalForm'] },
        employes: { title: 'Employee', fields: ['office'] },
        loanrepayments: { title: 'Loan Repayment', fields: ['office'] },
        savingstransactions: { title: 'Savings Transaction', fields: ['office'] },
        fixeddeposittransactions: { title: 'Fixed Deposit Transaction', fields: ['office'] },
        recurringdeposittransactions: { title: 'Recurring Deposit Transaction', fields: ['office'] },
        journalentries: { title: 'Journal Entry', fields: ['office'] },
        guarantors: { title: 'Guarantor', fields: ['office'] },
    };

    const config = entityConfig[entityType.toLowerCase()] || { title: 'Import' };

    // Fetch offices on component mount
    useEffect(() => {
        const fetchOffices = async () => {
            const response = await axios.get('https://test.meysa.co.ke/fineract-provider/api/v1/offices');
            setOffices(response.data);
        };
        fetchOffices();
    }, []);

    // Fetch staff when an office is selected
    useEffect(() => {
        if (selectedOffice) {
            const fetchStaff = async () => {
                const response = await axios.get(
                    `https://test.meysa.co.ke/fineract-provider/api/v1/staff?officeId=${selectedOffice}`
                );
                setStaff(response.data);
            };
            fetchStaff();
        }
    }, [selectedOffice]);

    // Fetch upload history
    useEffect(() => {
        const fetchUploadHistory = async () => {
            const response = await axios.get(
                `https://test.meysa.co.ke/fineract-provider/api/v1/imports?entityType=${entityType}`
            );
            setUploadHistory(response.data);
        };
        fetchUploadHistory();
    }, [entityType]);

    const handleFileUpload = async () => {
        // Upload logic here
        if (!file) return;
        console.log('Uploading file:', file);
    };

    const handleDownloadTemplate = async () => {
        // Download template logic
        console.log('Downloading template for:', entityType);
    };

    return (
        <div className="bulk-import-page">
            <h2 className="page-title">{config.title} Import</h2>

            {/* Form for Download Template */}
            <div className="form-section">
                <h3>{config.title} Template</h3>
                <div className="form-fields">
                    {config.fields?.includes('office') && (
                        <div className="form-group">
                            <label>Office</label>
                            <select
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>
                                        {office.nameDecorated}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {config.fields?.includes('staff') && (
                        <div className="form-group">
                            <label>Staff</label>
                            <select
                                value={selectedStaff}
                                onChange={(e) => setSelectedStaff(e.target.value)}
                                disabled={!selectedOffice}
                            >
                                <option value="">Select Staff</option>
                                {staff.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {config.fields?.includes('legalForm') && (
                        <div className="form-group">
                            <label>Legal Form</label>
                            <select
                                value={legalForm}
                                onChange={(e) => setLegalForm(e.target.value)}
                            >
                                <option value="">Select Legal Form</option>
                                <option value="Entity">Entity</option>
                                <option value="Person">Person</option>
                            </select>
                        </div>
                    )}
                </div>
                <button onClick={handleDownloadTemplate}>Download Template</button>
            </div>

            {/* Form for Upload */}
            <div className="form-section">
                <h3>Upload {config.title}</h3>
                <div className="form-group">
                    <label>Select File</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <button onClick={handleFileUpload} disabled={!file}>
                    Upload
                </button>
            </div>

            {/* Upload History Table */}
            <div className="table-section">
                <h3>Upload History</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Import Time</th>
                        <th>End Time</th>
                        <th>Completed</th>
                        <th>Total Records</th>
                        <th>Success Count</th>
                        <th>Failure Count</th>
                        <th>Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    {uploadHistory.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.name}</td>
                            <td>{entry.importTime}</td>
                            <td>{entry.endTime}</td>
                            <td>{entry.completed ? 'Yes' : 'No'}</td>
                            <td>{entry.totalRecords}</td>
                            <td>{entry.successCount}</td>
                            <td>{entry.failureCount}</td>
                            <td>
                                <button>Download</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BulkImport;
