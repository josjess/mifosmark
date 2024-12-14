import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import {AuthContext} from "../../../context/AuthContext";
import {useLoading} from "../../../context/LoadingContext";
import { FaTrash, FaEdit, FaStickyNote} from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const CenterDetails = ({ centerId, onClose }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [CenterImage, setCenterImage] = useState(null);
    const [centersDetails, setCentersDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    const [notes, setNotes] = useState([]);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    useEffect(() => {
        setCenterImage(process.env.PUBLIC_URL + 'Images/centers.png');
    }, []);

    const handleGroupRowClick = (group) => {
        navigate('/groups', {
            state: { openGroupDetails: group },
        });
    };
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

                    // Fetch center details
                    const centerResponse = await axios.get(
                        `${API_CONFIG.baseURL}/centers/${centerId}?associations=groupMembers,collectionMeetingCalendar`,
                        { headers }
                    );
                    setCentersDetails(centerResponse.data);

                    // Fetch group summary counts
                    const summaryResponse = await axios.get(
                        `${API_CONFIG.baseURL}/runreports/GroupSummaryCounts?R_groupId=${centerId}&genericResultSet=false`,
                        { headers }
                    );
                    const summaryData = summaryResponse.data[0] || {};
                    setCentersDetails((prevDetails) => ({
                        ...prevDetails,
                        groupSummaryCounts: summaryData,
                    }));

                    // Fetch group accounts
                    const accountsResponse = await axios.get(
                        `${API_CONFIG.baseURL}/centers/${centerId}/accounts`,
                        { headers }
                    );
                    setCentersDetails((prevDetails) => ({
                        ...prevDetails,
                        groupAccounts: accountsResponse.data,
                    }));
                } catch (error) {
                    console.error('Error fetching center details:', error);
                } finally {
                    stopLoading();
                }
            };
            fetchGeneralTabData();
        }
    }, [activeTab, centerId]);

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
                        `${API_CONFIG.baseURL}/groups/${centerId}/notes`,
                        { headers }
                    );
                    setNotes(response.data);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            };

            fetchNotes();
        }
    }, [activeTab, centerId]);

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
            ? `${API_CONFIG.baseURL}/groups/${centerId}/notes/${editingNoteId}`
            : `${API_CONFIG.baseURL}/groups/${centerId}/notes`;

        const method = editingNoteId ? 'put' : 'post';

        try {
            startLoading();
            await axios[method](endpoint, { note: newNote }, { headers });

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/groups/${centerId}/notes`,
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
                `${API_CONFIG.baseURL}/groups/${centerId}/notes/${noteId}`,
                { headers }
            );

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/groups/${centerId}/notes`,
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="general-tab">
                        {/* Summary Details Section */}
                        <div className="general-section general-summary-details">
                            <h3 className="general-section-title">Summary Details</h3>
                            <div className="general-details-columns">
                                <div className="general-details-column">
                                    <p><strong>Active Clients:</strong> {centersDetails?.groupSummaryCounts?.activeClients ?? '-'}</p>
                                    <p><strong>Active Client Loans:</strong> {centersDetails?.groupSummaryCounts?.activeClientLoans ?? '-'}</p>
                                    <p><strong>Active Client Borrowers:</strong> {centersDetails?.groupSummaryCounts?.activeClientBorrowers ?? '-'}</p>
                                    <p><strong>Active Overdue Client Loans:</strong> {centersDetails?.groupSummaryCounts?.overdueClientLoans ?? '-'}</p>
                                </div>

                                <div className="general-details-column">
                                    <p><strong>Active Group Loans:</strong> {centersDetails?.groupSummaryCounts?.activeGroupLoans ?? '-'}</p>
                                    <p><strong>Active Group Borrowers:</strong> {centersDetails?.groupSummaryCounts?.activeGroupBorrowers ?? '-'}</p>
                                    <p><strong>Active Overdue Group Loans:</strong> {centersDetails?.groupSummaryCounts?.overdueGroupLoans ?? '-'}</p>
                                    <p><strong>Active Loans:</strong> {centersDetails?.groupSummaryCounts?.activeLoans ?? '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Groups Section */}
                        <div className="general-section general-groups-section">
                            <h3 className="general-section-title">Groups</h3>
                            <table className="general-charges-table">
                                <thead>
                                <tr>
                                    <th>Account Number</th>
                                    <th>Group Name</th>
                                    <th>Office Name</th>
                                    <th>Submitted On</th>
                                </tr>
                                </thead>
                                <tbody>
                                {centersDetails?.groupMembers?.length > 0 ? (
                                    centersDetails.groupMembers.map((group, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleGroupRowClick(group)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <td>{group.accountNo}</td>
                                            <td>{group.name}</td>
                                            <td>{group.officeName}</td>
                                            <td>
                                                {group.timeline?.submittedOnDate
                                                    ? new Date(group.timeline.submittedOnDate.join('-')).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No groups available</td>
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
                        src={CenterImage}
                        alt="Center"
                        className="client-image"
                    />
                </div>

                {/* Middle Section 1 */}
                <div className="client-info-section">
                    <h2 className={`client-name ${getStatusClass(centersDetails?.status?.value || '')}`}>
                        {centersDetails?.name} ({centersDetails?.status?.value || 'Unknown'})
                    </h2>
                    <ul className="client-info-list">
                        <li><strong>Account:</strong> {centersDetails?.accountNo || 'N/A'}</li>
                        <li><strong>Office:</strong> {centersDetails?.officeName || 'N/A'}</li>
                        <li><strong>External Id:</strong> {centersDetails?.externalId || 'N/A'}</li>
                        <li><strong>Staff:</strong> {centersDetails?.staffName || 'Unassigned'}</li>
                        <li>
                            <strong>Activation Date:</strong>{' '}
                            {centersDetails?.activationDate
                                ? new Date(centersDetails.activationDate.join('-')).toLocaleDateString(undefined, {
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
                        <li><strong>Next Meeting On:</strong> {centersDetails?.nextMeetingDate || 'N/A'}</li>
                        <li><strong>Meeting Frequency:</strong> {centersDetails?.meetingFrequency || 'N/A'}</li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="client-actions-section">
                    <button className="client-action-button">Edit</button>
                    <button className="client-action-button">Add Group</button>
                    <button className="client-action-button">Manage Groups</button>
                    <button className="client-action-button">Center Saving Application</button>

                    <div className="client-dropdown">
                        <button className="client-action-button">More</button>
                        <div className="client-dropdown-content">
                            <button>Unassign Staff</button>
                            <button>Attach Meeting</button>
                            <button>Staff Assignment History</button>
                            <button>Close</button>
                            <button>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="client-details-tabs">
                {['general', 'notes'].map((tab) => (
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

export default CenterDetails;
