import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import {AuthContext} from "../../../context/AuthContext";
import {useLoading} from "../../../context/LoadingContext";
import {FaEdit, FaStickyNote, FaTrash} from "react-icons/fa";

const GroupDetails = ({ groupId, onClose }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const [GroupImage, setGroupImage] = useState(null);
    const [groupDetails, setGroupDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    const [notes, setNotes] = useState([]);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    const [committeeMembers, setCommitteeMembers] = useState([]);
    const [clientOptions, setClientOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [isCommitteeModalOpen, setIsCommitteeModalOpen] = useState(false);
    const [editingCommitteeMemberId, setEditingCommitteeMemberId] = useState(null);

    useEffect(() => {
        setGroupImage(process.env.PUBLIC_URL + 'Images/group.png');
    }, []);

    // General
    useEffect(() => {
        if (activeTab === 'general') {
            const fetchGeneralTabData = async () => {
                startLoading();
                try {
                    const headers = {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    };

                    // Fetch group details
                    const groupResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}?associations=all`, { headers });
                    setGroupDetails(groupResponse.data);

                    // Fetch group summary counts
                    const summaryResponse = await axios.get(`${API_CONFIG.baseURL}/runreports/GroupSummaryCounts?R_groupId=${groupId}&genericResultSet=false`, { headers });
                    const summaryData = summaryResponse.data[0] || {};
                    setGroupDetails((prevDetails) => ({
                        ...prevDetails,
                        groupSummaryCounts: summaryData,
                    }));

                    // Fetch group accounts
                    const accountsResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}/accounts`, { headers });
                    setGroupDetails((prevDetails) => ({
                        ...prevDetails,
                        groupAccounts: accountsResponse.data,
                    }));

                    // Fetch GSIM accounts
                    const gsimAccountsResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}/gsimaccounts`, { headers });
                    setGroupDetails((prevDetails) => ({
                        ...prevDetails,
                        gsimAccounts: gsimAccountsResponse.data,
                    }));

                    // Fetch GLIM accounts
                    const glimAccountsResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}/glimaccounts`, { headers });
                    setGroupDetails((prevDetails) => ({
                        ...prevDetails,
                        glimAccounts: glimAccountsResponse.data,
                    }));

                } catch (error) {
                    console.error('Error fetching client details:', error);
                } finally {
                    stopLoading();
                }
            };
            fetchGeneralTabData();
        }
    }, [activeTab, groupId]);

    useEffect(() => {
        if (activeTab === 'notes') {
            const fetchNotes = async () => {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                try {
                    const response = await axios.get(
                        `${API_CONFIG.baseURL}/groups/${groupId}/notes`,
                        { headers }
                    );
                    setNotes(response.data);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            };

            fetchNotes();
        }
    }, [activeTab, groupId]);

    useEffect(() => {
        if (activeTab === 'committee') {
            const fetchCommitteeData = async () => {
                startLoading();
                try {
                    const headers = {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    };

                    // Fetch group details with template data
                    const response = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}?associations=all&template=true`, { headers });
                    const groupData = response.data;

                    setClientOptions(groupData.staffOptions || []);
                    setRoleOptions(groupData.availableRoles || []);
                    setCommitteeMembers(groupData.committeeMembers || []);
                } catch (error) {
                    console.error('Error fetching committee data:', error);
                } finally {
                    stopLoading();
                }
            };

            fetchCommitteeData();
        }
    }, [activeTab, groupId]);

    const getStatusClass = (status) => {
        if (!status) return 'client-status-default';

        switch (status.toLowerCase()) {
            case 'active':
                return 'client-status-active';
            case 'inactive':
                return 'client-status-inactive';
            case 'pending':
                return 'client-status-pending';
            case 'closed':
                return 'client-status-closed';
            default:
                return 'client-status-default';
        }
    };

    const handleSaveNote = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        const endpoint = editingNoteId
            ? `${API_CONFIG.baseURL}/groups/${groupId}/notes/${editingNoteId}`
            : `${API_CONFIG.baseURL}/groups/${groupId}/notes`;

        const method = editingNoteId ? 'put' : 'post';

        try {
            startLoading();
            await axios[method](endpoint, { note: newNote }, { headers });

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/groups/${groupId}/notes`,
                { headers }
            );
            setNotes(updatedNotes.data);

            setNewNote('');
            setEditingNoteId(null);
            setIsNotesModalOpen(false);
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            stopLoading();
        }
    };

    const handleDeleteNote = async (noteId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this note?');

        if (!confirmDelete) return;

        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        try {
            startLoading();
            await axios.delete(
                `${API_CONFIG.baseURL}/groups/${groupId}/notes/${noteId}`,
                { headers }
            );

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/groups/${groupId}/notes`,
                { headers }
            );
            setNotes(updatedNotes.data);
        } catch (error) {
            console.error('Error deleting note:', error);
        } finally {
            stopLoading();
        }
    };

    const handleEditNote = (note) => {
        setEditingNoteId(note.id);
        setNewNote(note.note);
        setIsNotesModalOpen(true);
    };

    const handleSaveCommitteeMember = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            if (editingCommitteeMemberId) {
                await axios.put(
                    `${API_CONFIG.baseURL}/groups/${groupId}/associations/${editingCommitteeMemberId}`,
                    { clientId: selectedClient, roleId: selectedRole },
                    { headers }
                );
            } else {
                await axios.post(`${API_CONFIG.baseURL}/groups/${groupId}/associations`, { clientId: selectedClient, roleId: selectedRole }, { headers });
            }

            const updatedResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}?associations=all&template=true`, { headers });
            setCommitteeMembers(updatedResponse.data.committeeMembers || []);

            setSelectedClient('');
            setSelectedRole('');
            setEditingCommitteeMemberId(null);
            setIsCommitteeModalOpen(false);
        } catch (error) {
            console.error('Error saving committee member:', error);
        } finally {
            stopLoading();
        }
    };

    const handleDeleteCommitteeMember = async (memberId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this committee member?');

        if (!confirmDelete) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            await axios.delete(`${API_CONFIG.baseURL}/groups/${groupId}/associations/${memberId}`, { headers });

            const updatedResponse = await axios.get(`${API_CONFIG.baseURL}/groups/${groupId}?associations=all&template=true`, { headers });
            setCommitteeMembers(updatedResponse.data.committeeMembers || []);
        } catch (error) {
            console.error('Error deleting committee member:', error);
        } finally {
            stopLoading();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="general-tab">
                        {/* Performance History Section */}
                        <div className="general-section general-performance-history">
                            <h3 className="general-section-title">Group Details</h3>
                            <div className="general-details-columns">
                                <div className="general-details-column">
                                    <p><strong>Active
                                        Clients:</strong> {groupDetails?.groupSummaryCounts?.activeClients ?? '-'}</p>
                                    <p><strong>Active Client
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.activeClientLoans ?? '-'}</p>
                                    <p><strong>Active Client
                                        Borrowers:</strong> {groupDetails?.groupSummaryCounts?.activeClientBorrowers ?? '-'}
                                    </p>
                                    <p><strong>Overdue Client
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.overdueClientLoans ?? '-'}
                                    </p>
                                </div>

                                <div className="general-details-column">
                                    <p><strong>Active Group
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.activeGroupLoans ?? '-'}</p>
                                    <p><strong>Active Group
                                        Borrowers:</strong> {groupDetails?.groupSummaryCounts?.activeGroupBorrowers ?? '-'}
                                    </p>
                                    <p><strong>Overdue Group
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.overdueGroupLoans ?? '-'}</p>
                                    <p><strong>Overdue
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.overdueLoans ?? '-'}</p>
                                </div>

                                <div className="general-details-column">
                                    <p><strong>Active
                                        Loans:</strong> {groupDetails?.groupSummaryCounts?.activeLoans ?? '-'}</p>
                                    <p><strong>Active
                                        Borrowers:</strong> {groupDetails?.groupSummaryCounts?.activeBorrowers ?? '-'}
                                    </p>
                                </div>
                            </div>


                        </div>

                        {/* GSIM Account Overview */}
                        <div className="general-section general-upcoming-charges">
                            <div className="general-section-header">
                                <h3 className="general-section-title">GSIM Account Overview</h3>
                            </div>
                            <table className="general-charges-table">
                                <thead>
                                <tr>
                                    <th>GSIM Id</th>
                                    <th>Account Number</th>
                                    <th>Product</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupDetails?.gsimAccounts?.length > 0 ? (
                                    groupDetails.gsimAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.id}</td>
                                            <td>{account.accountNumber}</td>
                                            <td>{account.productName}</td>
                                            <td>{account.balance || 0}</td>
                                            <td>{account.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No GSIM Accounts available</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* GLIM Loans Accounts Overview */}
                        <div className="general-section general-loan-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">GLIM Loans Accounts Overview</h3>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    <th>GLIM Id</th>
                                    <th>Account Number</th>
                                    <th>Product</th>
                                    <th>Original Loan</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {groupDetails?.glimAccounts?.length > 0 ? (
                                    groupDetails.glimAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.id}</td>
                                            <td>{account.accountNumber}</td>
                                            <td>{account.productName}</td>
                                            <td>{account.originalLoanAmount || 0}</td>
                                            <td>{account.loanBalance || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No GLIM Accounts available</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'notes':
                return (
                    <div className="general-section general-notes-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Notes</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => {
                                    setIsNotesModalOpen(true);
                                    setEditingNoteId(null);
                                    setNewNote('');
                                }}
                            >
                                Add Note
                            </button>
                        </div>
                        {notes.length > 0 ? (
                            <div className="notes-list">
                                {notes.map((note) => (
                                    <div key={note.id} className="note-item">
                                        <div className="note-icon">
                                            < FaStickyNote/>
                                        </div>
                                        <div className="note-content">
                                            <p>{note.note}</p>
                                            <small>
                                                Created By: {note.createdByUsername || 'Unknown'} |{' '}
                                                {new Date(note.createdOn).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </small>
                                        </div>
                                        <div className="note-actions">
                                            <button
                                                className="note-general-action-button"
                                                onClick={() => handleEditNote(note)}
                                            >
                                                <FaEdit  color={"#56bc23"} size={20}/>
                                            </button>
                                            <button
                                                className="note-general-action-button"
                                                onClick={() => handleDeleteNote(note.id)}
                                            >
                                                <FaTrash color={"#e13a3a"} size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No notes available</p>
                        )}
                        {isNotesModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">
                                        {editingNoteId ? 'Edit Note' : 'Add Note'}
                                    </h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="note" className="create-provisioning-criteria-label">
                                                Write Note
                                            </label>
                                            <textarea
                                                id="note"
                                                value={newNote}
                                                placeholder={"Write Note..."}
                                                onChange={(e) => setNewNote(e.target.value)}
                                                className="create-provisioning-criteria-input"
                                                rows="4"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsNotesModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveNote}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={!newNote.trim()}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'committee':
                return (
                    <div className="general-section general-committee-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Client Members</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => {
                                    setIsCommitteeModalOpen(true);
                                    setSelectedClient('');
                                    setSelectedRole('');
                                    setEditingCommitteeMemberId(null);
                                }}
                            >
                                Add Member
                            </button>
                        </div>
                        {committeeMembers.length > 0 ? (
                            <div className="committee-list">
                                {committeeMembers.map((member) => (
                                    <div key={member.id} className="committee-item">
                                        <div className="committee-content">
                                        <p><strong>Client:</strong> {member.clientName}</p>
                                            <p><strong>Role:</strong> {member.role}</p>
                                        </div>
                                        <div className="committee-actions">
                                            <button
                                                className="committee-action-button"
                                                onClick={() => {
                                                    setSelectedClient(member.clientId);
                                                    setSelectedRole(member.roleId);
                                                    setEditingCommitteeMemberId(member.id);
                                                    setIsCommitteeModalOpen(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="committee-action-button"
                                                onClick={() => handleDeleteCommitteeMember(member.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No client members available</p>
                        )}
                        {isCommitteeModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">
                                        {editingCommitteeMemberId ? 'Edit Client Member' : 'Add Client Member'}
                                    </h4>
                                    <div className="create-holiday-row">
                                        {/* Client Dropdown */}
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="client" className="create-provisioning-criteria-label">
                                                Client <span>*</span>
                                            </label>
                                            <select
                                                id="client"
                                                value={selectedClient}
                                                onChange={(e) => setSelectedClient(e.target.value)}
                                                className="create-provisioning-criteria-input"
                                                required
                                            >
                                                <option value="">Select Client</option>
                                                {clientOptions.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.displayName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Role Dropdown */}
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="role" className="create-provisioning-criteria-label">
                                                Role <span>*</span>
                                            </label>
                                            <select
                                                id="role"
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="create-provisioning-criteria-input"
                                                required
                                            >
                                                <option value="">Select Role</option>
                                                {roleOptions.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsCommitteeModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveCommitteeMember}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={!selectedClient || !selectedRole}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return <div>Content Not Found</div>;
        }
    };


    return (
        <div className="client-details-container">
            <div className="client-details-header">
                {/* Left Section */}
                <div className="client-image-section">
                    <img
                        src={GroupImage}
                        alt="Group"
                        className="client-image"
                    />
                </div>

                {/* Middle Section 1 */}
                <div className="client-info-section">
                    <h2 className={`client-name ${getStatusClass(groupDetails?.status?.value || '')}`}>
                        {groupDetails?.name} ({groupDetails?.status?.value || 'Unknown'})
                    </h2>
                    <ul className="client-info-list">
                        <li><strong>Center Name:</strong> {groupDetails?.centerName || 'N/A'}</li>
                        <li><strong>Staff:</strong> {groupDetails?.staffName || 'Unassigned'}</li>
                        <li><strong>Office:</strong> {groupDetails?.officeName || 'N/A'}</li>
                        <li>
                            <strong>Activation Date:</strong>{' '}
                            {groupDetails?.activationDate
                                ? new Date(groupDetails.activationDate.join('-')).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : 'N/A'}
                        </li>
                    </ul>
                </div>

                {/* Middle Section 2 */}
                <div className="client-info-section">
                    <ul className="client-info-list">
                        <li><strong>Next Meeting On:</strong> {groupDetails?.nextMeetingDate || 'N/A'}</li>
                        <li><strong>Meeting Frequency:</strong> {groupDetails?.meetingFrequency || 'N/A'}</li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="client-actions-section">
                    <button className="client-action-button">Edit</button>
                    <button className="client-action-button">Add Clients</button>
                    <button className="client-action-button">Transfer Clients</button>
                    <button className="client-action-button">Manage Members</button>

                    <div className="client-dropdown">
                        <button className="client-action-button">Applications</button>
                        <div className="client-dropdown-content">
                            <button>Group Saving Application</button>
                            <button>Group Loan Application</button>
                            <button>GLIM Loan Application</button>
                            <button>GSIM Application</button>
                        </div>
                    </div>

                    <div className="client-dropdown">
                        <button className="client-action-button">More</button>
                        <div className="client-dropdown-content">
                            <button>Assign Staff</button>
                            <button>Close</button>
                            <button>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="client-details-tabs">
                {['general', 'notes', 'committee'].map((tab) => (
                    <button
                        key={tab}
                        className={`client-tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="client-tab-content">{renderTabContent()}</div>

        </div>
    );
};

export default GroupDetails;
