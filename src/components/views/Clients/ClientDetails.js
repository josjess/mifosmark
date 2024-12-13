import React, {useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import {AuthContext} from "../../../context/AuthContext";
import {useLoading} from "../../../context/LoadingContext";
import {FaUpload, FaCamera, FaTrash, FaSignature, FaEdit, FaStickyNote} from 'react-icons/fa';
import './ClientDetails.css'

const ClientDetails = ({ clientId, onClose }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();

    const [clientDetails, setClientDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [templateData, setTemplateData] = useState(null);
    const [dataTables, setDataTables] = useState([]);
    const [collaterals, setCollaterals] = useState([]);
    const [charges, setCharges] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [clientImage, setClientImage] = useState(null);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const videoRef = useRef(null);
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const [showClosedLoanAccounts, setShowClosedLoanAccounts] = useState(false);
    const [showClosedSavingsAccounts, setShowClosedSavingsAccounts] = useState(false);
    const [showClosedFixedDepositAccounts, setShowClosedFixedDepositAccounts] =
        useState(false);
    const [showClosedRecurringDepositAccounts, setShowClosedRecurringDepositAccounts] =
        useState(false);
    const [showClosedShareAccounts, setShowClosedShareAccounts] = useState(false);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [clientAddresses, setClientAddresses] = useState([]);
    const [addressTypeOptions, setAddressTypeOptions] = useState([]);
    const [stateProvinceOptions, setStateProvinceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [newAddress, setNewAddress] = useState({
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        city: '',
        stateProvinceId: '',
        countryId: '',
        postalCode: '',
    });

    const [familyMembers, setFamilyMembers] = useState([]);
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
    const [relationshipOptions, setRelationshipOptions] = useState([]);
    const [genderOptions, setGenderOptions] = useState([]);
    const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
    const [professionOptions, setProfessionOptions] = useState([]);
    const [newFamilyMember, setNewFamilyMember] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        qualification: '',
        age: '',
        isDependent: false,
        relationshipId: '',
        genderId: '',
        professionId: '',
        maritalStatusId: '',
        dateOfBirth: '',
    });

    const [identities, setIdentities] = useState([]);
    const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
    const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
    const [newIdentity, setNewIdentity] = useState({
        documentTypeId: '',
        status: '',
        documentKey: '',
        description: '',
    });

    const [documents, setDocuments] = useState([]);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const [newDocument, setNewDocument] = useState({
        fileName: '',
        description: '',
        file: null,
    });

    const [notes, setNotes] = useState([]);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    const [isChargeOverviewVisible, setIsChargeOverviewVisible] = useState(false);
    const [chargeOverviewData, setChargeOverviewData] = useState([]);

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

                    // Fetch main client details
                    const clientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, {headers});
                    setClientDetails(clientResponse.data);

                    // Fetch client image if imagePresent is true
                    if (clientResponse.data.imagePresent && clientResponse.data.imageId) {
                        const fetchedImage = await fetchClientImage(clientResponse.data.imageId, headers);
                        setClientImage(fetchedImage);
                    } else {
                        setClientImage(process.env.PUBLIC_URL + 'Images/user.jpg');
                    }

                    // Fetch template data
                    const templateResponse = await axios.get(`${API_CONFIG.baseURL}/clients/template`, {headers});
                    setTemplateData(templateResponse.data);

                    // Fetch registered datatables
                    const datatablesResponse = await axios.get(`${API_CONFIG.baseURL}/datatables?apptable=m_client`, {headers});
                    setDataTables(datatablesResponse.data);

                    // Fetch collaterals
                    const collateralsResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/collaterals/template`, {headers});
                    setCollaterals(collateralsResponse.data);

                    // Fetch charges
                    const chargesResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/charges?pendingPayment=true`, {headers});
                    setCharges(chargesResponse.data.pageItems);

                    // Fetch accounts
                    const accountsResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}/accounts`, {headers});
                    setAccounts(accountsResponse.data);

                } catch (error) {
                    console.error('Error fetching client details:', error);
                } finally {
                    stopLoading();
                }
            };
            fetchGeneralTabData();
        }
    }, [activeTab, clientId]);

    const handleViewChargesOverview = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        try {
            startLoading();

            const clientResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}`,
                { headers }
            );

            const chargesResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/charges`,
                { headers }
            );

            setChargeOverviewData(chargesResponse.data.pageItems);
            setIsChargeOverviewVisible(true);
        } catch (error) {
            console.error('Error fetching charges overview:', error);
        } finally {
            stopLoading();
        }
    };

    const handleCloseChargesOverview = () => {
        setIsChargeOverviewVisible(false);
    };

    const fetchClientImage = async (imageId, headers) => {
        try {
            const imageUrlResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/images?maxHeight=150`,
                { headers }
            );

            const imageFileResponse = await axios.get(imageUrlResponse.data, { responseType: 'blob' });

            return URL.createObjectURL(imageFileResponse.data);
        } catch (error) {
            console.error('Error fetching client image:', error);
            return process.env.PUBLIC_URL + 'Images/user.jpg';
        }
    };

    const formatDate = (dateArray) => {
        if (!dateArray) return ' ';
        return new Date(dateArray.join('-')).toLocaleDateString(undefined, { dateStyle: 'long' });
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'client-status-active';
            case 'inactive':
                return 'client-status-inactive';
            default:
                return 'client-status-default';
        }
    };

    const toggleLoanAccountsView = () => {
        setShowClosedLoanAccounts(!showClosedLoanAccounts);
    };

    const filteredLoanAccounts = accounts.loanAccounts?.filter((account) =>
        showClosedLoanAccounts
            ? account.status?.value === "Closed"
            : account.status?.value !== "Closed"
    ) || [];

    const toggleSavingsAccountsView = () => {
        setShowClosedSavingsAccounts(!showClosedSavingsAccounts);
    };

    const filteredSavingsAccounts = accounts.savingsAccounts?.filter((account) =>
        showClosedSavingsAccounts
            ? account.status?.value === "Closed" && account.timeline?.closedOnDate
            : account.status?.value !== "Closed" && account.lastActiveTransactionDate
    ) || [];

    const toggleFixedDepositAccountsView = () => {
        setShowClosedFixedDepositAccounts(!showClosedFixedDepositAccounts);
    };

    const filteredFixedDepositAccounts = accounts.fixedDepositAccounts?.filter((account) =>
            showClosedFixedDepositAccounts
                ? account.status?.value === "Closed"
                : account.status?.value !== "Closed"
    ) || [];

    const toggleRecurringDepositAccountsView = () => {
        setShowClosedRecurringDepositAccounts(!showClosedRecurringDepositAccounts);
    };

    const filteredRecurringDepositAccounts = accounts.recurringDepositAccounts?.filter(
        (account) =>
            showClosedRecurringDepositAccounts
                ? account.status?.value === "Closed"
                : account.status?.value !== "Closed"
    ) || [];

    const toggleShareAccountsView = () => {
        setShowClosedShareAccounts(!showClosedShareAccounts);
    };

    const filteredShareAccounts = accounts.shareAccounts?.filter(
        (account) =>
            showClosedShareAccounts
                ? account.status?.value === "Closed"
                : account.status?.value !== "Closed"
    ) || [];

    // Address
    useEffect(() => {
        if (activeTab === 'address') {
            const fetchAddressData = async () => {
                startLoading();
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                try {
                    const addressConfigResponse = await axios.get(`${API_CONFIG.baseURL}/fieldconfiguration/ADDRESS`, {
                        headers,
                    });
                    const addressTemplateResponse = await axios.get(`${API_CONFIG.baseURL}/client/addresses/template`, {
                        headers,
                    });
                    const clientAddressesResponse = await axios.get(
                        `${API_CONFIG.baseURL}/client/${clientId}/addresses`,
                        {headers}
                    );

                    setAddressTypeOptions(addressTemplateResponse.data.addressTypeIdOptions);
                    setStateProvinceOptions(addressTemplateResponse.data.stateProvinceIdOptions);
                    setCountryOptions(addressTemplateResponse.data.countryIdOptions);
                    setClientAddresses(clientAddressesResponse.data);
                } catch (error) {
                    console.error('Error fetching address data:', error);
                } finally {
                    stopLoading();
                }
            };

            fetchAddressData();
        }
    }, [activeTab, clientId]);

    const handleAddAddress = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        try {
            await axios.post(
                `${API_CONFIG.baseURL}/client/${clientId}/addresses`,
                newAddress,
                { headers }
            );
            setIsAddressModalOpen(false);
            const updatedAddresses = await axios.get(
                `${API_CONFIG.baseURL}/client/${clientId}/addresses`,
                { headers }
            );
            setClientAddresses(updatedAddresses.data);
        } catch (error) {
            console.error('Error adding address:', error);
        }
    };

    // Family
    useEffect(() => {
        if (activeTab === 'family') {
            const fetchFamilyData = async () => {
                startLoading();
                try {
                    const headers = {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                        'Content-Type': 'application/json',
                    };

                    const familyResponse = await axios.get(
                        `${API_CONFIG.baseURL}/clients/${clientId}/familymembers`,
                        { headers }
                    );
                    setFamilyMembers(familyResponse.data);

                    const templateResponse = await axios.get(
                        `${API_CONFIG.baseURL}/clients/template`,
                        { headers }
                    );

                    const options = templateResponse.data.familyMemberOptions;
                    setRelationshipOptions(options.relationshipIdOptions || []);
                    setGenderOptions(options.genderIdOptions || []);
                    setMaritalStatusOptions(options.maritalStatusIdOptions || []);
                    setProfessionOptions(options.professionIdOptions || []);
                } catch (error) {
                    console.error('Error fetching family data:', error);
                } finally {
                    stopLoading();
                }
            };

            fetchFamilyData();
        }
    }, [activeTab, clientId]);

    const handleAddFamilyMember = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        try {
            startLoading();
            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}/familymembers`,
                newFamilyMember,
                { headers }
            );
            setIsFamilyModalOpen(false);
            const updatedFamilyMembers = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/familymembers`,
                { headers }
            );
            setFamilyMembers(updatedFamilyMembers.data);

            setIsFamilyModalOpen(false);

            setNewFamilyMember({
                firstName: '',
                middleName: '',
                lastName: '',
                qualification: '',
                age: '',
                isDependent: false,
                relationshipId: '',
                genderId: '',
                professionId: '',
                maritalStatusId: '',
                dateOfBirth: '',
            });
        } catch (error) {
            console.error('Error adding family member:', error);
        } finally {
            stopLoading();
        }
    };

    // Identities
    useEffect(() => {
        if (activeTab === 'identities') {
            const fetchIdentityData = async () => {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };
                try {
                    startLoading();

                    const identitiesResponse = await axios.get(
                        `${API_CONFIG.baseURL}/clients/${clientId}/identifiers`,
                        { headers }
                    );
                    setIdentities(identitiesResponse.data);

                    const templateResponse = await axios.get(
                        `${API_CONFIG.baseURL}/clients/${clientId}/identifiers/template`,
                        { headers }
                    );
                    setDocumentTypeOptions(templateResponse.data.allowedDocumentTypes);
                } catch (error) {
                    console.error('Error fetching identity data:', error);
                } finally {
                    stopLoading();
                }
            };

            fetchIdentityData();
        }
    }, [activeTab, clientId, user.base64EncodedAuthenticationKey]);

    const handleAddIdentity = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };
        try {
            startLoading();

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}/identifiers`,
                newIdentity,
                { headers }
            );

            const updatedIdentities = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/identifiers`,
                { headers }
            );
            setIdentities(updatedIdentities.data);

            setIsIdentityModalOpen(false); // Close modal
            setNewIdentity({
                documentTypeId: '',
                status: '',
                documentKey: '',
                description: '',
            });
        } catch (error) {
            console.error('Error adding identity:', error);
        } finally {
            stopLoading();
        }
    };

    // Documents
    useEffect(() => {
        if (activeTab === 'documents') {
            const fetchDocuments = async () => {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                try {
                    const response = await axios.get(
                        `${API_CONFIG.baseURL}/clients/${clientId}/documents`,
                        { headers }
                    );
                    setDocuments(response.data);
                } catch (error) {
                    console.error('Error fetching documents:', error);
                }
            };

            fetchDocuments();
        }
    }, [activeTab, clientId]);

    const handleAddDocument = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'multipart/form-data',
        };

        const formData = new FormData();
        formData.append('name', newDocument.fileName);
        formData.append('description', newDocument.description);
        formData.append('file', newDocument.file);

        try {
            startLoading();
            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}/documents`,
                formData,
                { headers }
            );

            const updatedDocuments = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/documents`,
                { headers }
            );
            setDocuments(updatedDocuments.data);

            setNewDocument({ fileName: '', description: '', file: null });
            setIsDocumentsModalOpen(false);
        } catch (error) {
            console.error('Error adding document:', error);
        } finally {
            stopLoading();
        }
    };

    // Note
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
                        `${API_CONFIG.baseURL}/clients/${clientId}/notes`,
                        { headers }
                    );
                    setNotes(response.data);
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
            };

            fetchNotes();
        }
    }, [activeTab, clientId]);

    const handleSaveNote = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
            'Content-Type': 'application/json',
        };

        const endpoint = editingNoteId
            ? `${API_CONFIG.baseURL}/clients/${clientId}/notes/${editingNoteId}`
            : `${API_CONFIG.baseURL}/clients/${clientId}/notes`;

        const method = editingNoteId ? 'put' : 'post';

        try {
            startLoading();
            await axios[method](endpoint, { note: newNote }, { headers });

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/notes`,
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
                `${API_CONFIG.baseURL}/clients/${clientId}/notes/${noteId}`,
                { headers }
            );

            const updatedNotes = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/notes`,
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
                        {/* Performance History Section */}
                        <div className="general-section general-performance-history">
                            <h3 className="general-section-title">Performance History</h3>
                            <div className="general-details-columns">
                                <div className="general-details-column">
                                    <p><strong>No. of Loan
                                        Cycles:</strong> {clientDetails.performanceHistory?.loanCycles || ''}</p>
                                    <p><strong>Last Loan
                                        Amount:</strong> {clientDetails.performanceHistory?.lastLoanAmount || ''}</p>
                                    <p><strong>Total
                                        Savings:</strong> {clientDetails.performanceHistory?.totalSavings || ''}</p>
                                </div>
                                <div className="general-details-column">
                                    <p><strong>No. of Active
                                        Loans:</strong> {clientDetails.performanceHistory?.activeLoans || ''}</p>
                                    <p><strong>No. of Active
                                        Savings:</strong> {clientDetails.performanceHistory?.activeSavings || ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Charges Section */}
                        <div className="general-section general-upcoming-charges">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Upcoming Charges</h3>
                                {!isChargeOverviewVisible && (
                                    <button
                                        className="general-charges-overview-button"
                                        onClick={handleViewChargesOverview}
                                    >
                                        Charges Overview
                                    </button>
                                )}
                            </div>
                            <table className="general-charges-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Due as of</th>
                                    <th>Due</th>
                                    <th>Paid</th>
                                    <th>Waived</th>
                                    <th>Outstanding</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {charges.length > 0 ? (
                                    charges.map((charge, index) => (
                                        <tr key={index}>
                                            <td>{charge.name}</td>
                                            <td>{formatDate(charge.dueDate)}</td>
                                            <td>{charge.due}</td>
                                            <td>{charge.paid}</td>
                                            <td>{charge.waived}</td>
                                            <td>{charge.outstanding}</td>
                                            <td>
                                                <button className="general-action-button">View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No upcoming charges available</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Charges Overview */}
                        {isChargeOverviewVisible && (
                            <div className="general-section general-charges-overview">
                                <div className="general-section-header">
                                    <h3 className="general-section-title">Charges Overview</h3>
                                    <button
                                        className="general-charges-overview-button"
                                        onClick={handleCloseChargesOverview}
                                    >
                                        Close Charges Overview
                                    </button>
                                </div>
                                <table className="general-charges-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Due as of</th>
                                        <th>Due</th>
                                        <th>Paid</th>
                                        <th>Waived</th>
                                        <th>Outstanding</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {chargeOverviewData.length > 0 ? (
                                        chargeOverviewData.map((charge, index) => (
                                            <tr key={index}>
                                                <td>{charge.name}</td>
                                                <td>{formatDate(charge.dueDate)}</td>
                                                <td>{charge.due}</td>
                                                <td>{charge.paid}</td>
                                                <td>{charge.waived}</td>
                                                <td>{charge.outstanding}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">No charges available</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Loan Accounts Section */}
                        <div className="general-section general-loan-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Loan Accounts</h3>
                                <button
                                    className="general-toggle-view-button"
                                    onClick={toggleLoanAccountsView}
                                >
                                    {showClosedLoanAccounts ? "View Active Accounts" : "View Closed Accounts"}
                                </button>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    {showClosedLoanAccounts ? (
                                        <>
                                            <th>Account No.</th>
                                            <th>Loan Product</th>
                                            <th>Original Loan</th>
                                            <th>Loan Balance</th>
                                            <th>Amount Paid</th>
                                            <th>Type</th>
                                            <th>Closed Date</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Account No.</th>
                                            <th>Loan Product</th>
                                            <th>Original Loan</th>
                                            <th>Loan Balance</th>
                                            <th>Amount Paid</th>
                                            <th>Type</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredLoanAccounts.length > 0 ? (
                                    filteredLoanAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.accountNo}</td>
                                            <td>{account.loanProduct || "N/A"}</td>
                                            <td>{`${account.currency?.displaySymbol || ""} ${account.originalLoan || 0}`}</td>
                                            <td>{`${account.currency?.displaySymbol || ""} ${account.loanBalance || 0}`}</td>
                                            <td>{`${account.currency?.displaySymbol || ""} ${account.amountPaid || 0}`}</td>
                                            <td>{account.type || "N/A"}</td>
                                            {showClosedLoanAccounts ? (
                                                <td>{formatDate(account.closedDate)}</td>
                                            ) : (
                                                <td>
                                                    <button className="general-action-button">View</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showClosedLoanAccounts ? "7" : "7"}>
                                            {showClosedLoanAccounts
                                                ? "No closed loan accounts available"
                                                : "No active loan accounts available"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Saving Accounts Section */}
                        <div className="general-section general-saving-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Savings Accounts</h3>
                                <button
                                    className="general-toggle-view-button"
                                    onClick={toggleSavingsAccountsView}
                                >
                                    {showClosedSavingsAccounts ? "View Active Accounts" : "View Closed Accounts"}
                                </button>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    {showClosedSavingsAccounts ? (
                                        <>
                                            <th>Account No.</th>
                                            <th>Savings Product</th>
                                            <th>Closed Date</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Account No.</th>
                                            <th>Savings Product</th>
                                            <th>Last Active</th>
                                            <th>Balance</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredSavingsAccounts.length > 0 ? (
                                    filteredSavingsAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.accountNo}</td>
                                            <td>{account.productName}</td>
                                            {showClosedSavingsAccounts ? (
                                                <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                            ) : (
                                                <>
                                                    <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                    <td>{`${account.currency?.displaySymbol || ''} ${account.balance || 0}`}</td>
                                                    <td>
                                                        <button className="general-action-button">View</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showClosedSavingsAccounts ? "3" : "5"}>
                                            {showClosedSavingsAccounts
                                                ? "No closed savings accounts available"
                                                : "No active savings accounts available"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Fixed Deposit Accounts Section */}
                        <div className="general-section general-fixed-deposit-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Fixed Deposit Accounts</h3>
                                <button
                                    className="general-toggle-view-button"
                                    onClick={toggleFixedDepositAccountsView}
                                >
                                    {showClosedFixedDepositAccounts ? "View Active Accounts" : "View Closed Accounts"}
                                </button>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    {showClosedFixedDepositAccounts ? (
                                        <>
                                            <th>Account No.</th>
                                            <th>Fixed Deposit Product</th>
                                            <th>Closed Date</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Account No.</th>
                                            <th>Fixed Deposit Product</th>
                                            <th>Last Active</th>
                                            <th>Balance</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredFixedDepositAccounts.length > 0 ? (
                                    filteredFixedDepositAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.accountNo}</td>
                                            <td>{account.productName}</td>
                                            {showClosedFixedDepositAccounts ? (
                                                <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                            ) : (
                                                <>
                                                    <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                    <td>{`${account.currency.displaySymbol} ${account.balance || 0}`}</td>
                                                    <td>
                                                        <button className="general-action-button">View</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showClosedFixedDepositAccounts ? "3" : "5"}>
                                            {showClosedFixedDepositAccounts
                                                ? "No closed fixed deposit accounts available"
                                                : "No active fixed deposit accounts available"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Recurring Deposit Accounts Section */}
                        <div className="general-section general-recurring-deposit-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Recurring Deposit Accounts</h3>
                                <button
                                    className="general-toggle-view-button"
                                    onClick={toggleRecurringDepositAccountsView}
                                >
                                    {showClosedRecurringDepositAccounts ? "View Active Accounts" : "View Closed Accounts"}
                                </button>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    {showClosedRecurringDepositAccounts ? (
                                        <>
                                            <th>Account No.</th>
                                            <th>Recurring Deposit Product</th>
                                            <th>Closed Date</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Account No.</th>
                                            <th>Recurring Deposit Product</th>
                                            <th>Last Active</th>
                                            <th>Balance</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredRecurringDepositAccounts.length > 0 ? (
                                    filteredRecurringDepositAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.accountNo}</td>
                                            <td>{account.productName}</td>
                                            {showClosedRecurringDepositAccounts ? (
                                                <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                            ) : (
                                                <>
                                                    <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                    <td>{`${account.currency.displaySymbol} ${account.balance || 0}`}</td>
                                                    <td>
                                                        <button className="general-action-button">View</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showClosedRecurringDepositAccounts ? "3" : "5"}>
                                            {showClosedRecurringDepositAccounts
                                                ? "No closed recurring deposit accounts available"
                                                : "No active recurring deposit accounts available"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Share Accounts Section */}
                        <div className="general-section general-share-accounts">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Share Accounts</h3>
                                <button
                                    className="general-toggle-view-button"
                                    onClick={toggleShareAccountsView}
                                >
                                    {showClosedShareAccounts ? "View Active Accounts" : "View Closed Accounts"}
                                </button>
                            </div>
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    {showClosedShareAccounts ? (
                                        <>
                                            <th>Account No.</th>
                                            <th>Share Product</th>
                                            <th>Closed Date</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Account No.</th>
                                            <th>Share Product</th>
                                            <th>Approved Shares</th>
                                            <th>Pending For Approval Shares</th>
                                            <th>Actions</th>
                                        </>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredShareAccounts.length > 0 ? (
                                    filteredShareAccounts.map((account, index) => (
                                        <tr key={index}>
                                            <td>{account.accountNo}</td>
                                            <td>{account.productName}</td>
                                            {showClosedShareAccounts ? (
                                                <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                            ) : (
                                                <>
                                                    <td>{account.approvedShares || 0}</td>
                                                    <td>{account.pendingForApprovalShares || 0}</td>
                                                    <td>
                                                        <button className="general-action-button">View</button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={showClosedShareAccounts ? "3" : "5"}>
                                            {showClosedShareAccounts
                                                ? "No closed share accounts available"
                                                : "No active share accounts available"}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Collateral Data Section */}
                        <div className="general-section general-collateral-data">
                            <div className="general-section-header">
                                <h3 className="general-section-title">Collateral Data</h3>
                                <button
                                    className="general-collateral-button"
                                    disabled={!collaterals.length}
                                >
                                    View Collaterals
                                </button>
                            </div>
                            <table className="general-collateral-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Total Value</th>
                                    <th>Total Collateral Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collaterals.length > 0 ? (
                                    collaterals.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.totalValue}</td>
                                            <td>{item.totalCollateralValue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No collateral data available</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'address':
                return (
                    <div className="general-section general-address-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Address</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => setIsAddressModalOpen(true)}
                            >
                                Add Address
                            </button>
                        </div>
                        {clientAddresses.length > 0 ? (
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    <th>Address Type</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Address Line 3</th>
                                    <th>City</th>
                                    <th>State / Province</th>
                                    <th>Country</th>
                                    <th>Postal Code</th>
                                </tr>
                                </thead>
                                <tbody>
                                {clientAddresses.map((address, index) => (
                                    <tr key={index}>
                                        <td>{address.addressTypeName}</td>
                                        <td>{address.addressLine1 || ''}</td>
                                        <td>{address.addressLine2 || ''}</td>
                                        <td>{address.addressLine3 || ''}</td>
                                        <td>{address.city || ''}</td>
                                        <td>{address.stateProvinceName || ''}</td>
                                        <td>{address.countryName || ''}</td>
                                        <td>{address.postalCode || ''}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No addresses available</p>
                        )}

                        {isAddressModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Add Client Address</h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="addressType" className="create-provisioning-criteria-label">
                                                Address Type <span>*</span>
                                            </label>
                                            <select
                                                id="addressType"
                                                value={newAddress.addressType}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        addressType: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Address Type</option>
                                                {addressTypeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="addressLine1"
                                                   className="create-provisioning-criteria-label">
                                                Address Line 1 <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="addressLine1"
                                                value={newAddress.addressLine1}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        addressLine1: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="addressLine2" className="create-provisioning-criteria-label">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                id="addressLine2"
                                                value={newAddress.addressLine2}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        addressLine2: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="addressLine3" className="create-provisioning-criteria-label">
                                                Address Line 3
                                            </label>
                                            <input
                                                type="text"
                                                id="addressLine3"
                                                value={newAddress.addressLine3}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        addressLine3: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="city" className="create-provisioning-criteria-label">
                                                City <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                value={newAddress.city}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        city: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="stateProvince" className="create-provisioning-criteria-label">
                                                State / Province
                                            </label>
                                            <select
                                                id="stateProvince"
                                                value={newAddress.stateProvinceId}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        stateProvinceId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                            >
                                                <option value="">Select State / Province</option>
                                                {stateProvinceOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="country" className="create-provisioning-criteria-label">
                                                Country <span>*</span>
                                            </label>
                                            <select
                                                id="country"
                                                value={newAddress.countryId}
                                                onChange={(e) =>
                                                    setNewAddress((prev) => ({
                                                        ...prev,
                                                        countryId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Country</option>
                                                {countryOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="postalCode" className="create-provisioning-criteria-label">
                                            Postal Code
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            value={newAddress.postalCode}
                                            onChange={(e) =>
                                                setNewAddress((prev) => ({
                                                    ...prev,
                                                    postalCode: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsAddressModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddAddress}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={
                                                !newAddress.addressType ||
                                                !newAddress.addressLine1 ||
                                                !newAddress.city ||
                                                !newAddress.stateProvinceId ||
                                                !newAddress.countryId
                                            }
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'family':
                return (
                    <div className="general-section general-family-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Family Members</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => setIsFamilyModalOpen(true)}
                            >
                                Add Family Member
                            </button>
                        </div>
                        {familyMembers.length > 0 ? (
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Relationship</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Marital Status</th>
                                    <th>Profession</th>
                                    <th>Is Dependent</th>
                                </tr>
                                </thead>
                                <tbody>
                                {familyMembers.map((member, index) => (
                                    <tr key={index}>
                                        <td>{member.firstName}</td>
                                        <td>{member.middleName || ''}</td>
                                        <td>{member.lastName}</td>
                                        <td>{member.relationshipName || ''}</td>
                                        <td>{member.genderName || ''}</td>
                                        <td>{member.age || ''}</td>
                                        <td>{member.maritalStatusName || ''}</td>
                                        <td>{member.professionName || ''}</td>
                                        <td>{member.isDependent ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No family members available</p>
                        )}
                        {isFamilyModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Add Family Member</h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="firstName" className="create-provisioning-criteria-label">
                                                First Name <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={newFamilyMember.firstName}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        firstName: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="middleName" className="create-provisioning-criteria-label">
                                                Middle Name
                                            </label>
                                            <input
                                                type="text"
                                                id="middleName"
                                                value={newFamilyMember.middleName}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        middleName: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="lastName" className="create-provisioning-criteria-label">
                                                Last Name <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={newFamilyMember.lastName}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        lastName: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="qualification"
                                                   className="create-provisioning-criteria-label">
                                                Qualification <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="qualification"
                                                value={newFamilyMember.qualification}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        qualification: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="age" className="create-provisioning-criteria-label">
                                                Age <span>*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="age"
                                                value={newFamilyMember.age}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        age: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="isDependent" className="create-provisioning-criteria-label">
                                                <input
                                                    type="checkbox"
                                                    id="isDependent"
                                                    checked={newFamilyMember.isDependent}
                                                    onChange={(e) =>
                                                        setNewFamilyMember((prev) => ({
                                                            ...prev,
                                                            isDependent: e.target.checked,
                                                        }))
                                                    }
                                                /> {"   "}Is Dependent
                                            </label>
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="relationship"
                                                   className="create-provisioning-criteria-label">
                                                Relationship <span>*</span>
                                            </label>
                                            <select
                                                id="relationship"
                                                value={newFamilyMember.relationshipId}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        relationshipId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Relationship</option>
                                                {relationshipOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="gender" className="create-provisioning-criteria-label">
                                                Gender <span>*</span>
                                            </label>
                                            <select
                                                id="gender"
                                                value={newFamilyMember.genderId}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        genderId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                {genderOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="profession" className="create-provisioning-criteria-label">
                                                Profession
                                            </label>
                                            <select
                                                id="profession"
                                                value={newFamilyMember.professionId}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        professionId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                            >
                                                <option value="">Select Profession</option>
                                                {professionOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="maritalStatus" className="create-provisioning-criteria-label">
                                                Marital Status
                                            </label>
                                            <select
                                                id="maritalStatus"
                                                value={newFamilyMember.maritalStatusId}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        maritalStatusId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                            >
                                                <option value="">Select Marital Status</option>
                                                {maritalStatusOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="dateOfBirth" className="create-provisioning-criteria-label">
                                                Date of Birth <span>*</span>
                                            </label>
                                            <input
                                                type="date"
                                                id="dateOfBirth"
                                                value={newFamilyMember.dateOfBirth}
                                                onChange={(e) =>
                                                    setNewFamilyMember((prev) => ({
                                                        ...prev,
                                                        dateOfBirth: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsFamilyModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddFamilyMember}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={
                                                !newFamilyMember.firstName ||
                                                !newFamilyMember.lastName ||
                                                !newFamilyMember.qualification ||
                                                !newFamilyMember.age ||
                                                !newFamilyMember.relationshipId ||
                                                !newFamilyMember.genderId ||
                                                !newFamilyMember.dateOfBirth
                                            }
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'identities':
                return (
                    <div className="general-section general-identities-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Identities</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => setIsIdentityModalOpen(true)}
                            >
                                Add Identity
                            </button>
                        </div>
                        {identities.length > 0 ? (
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    <th>ID Description</th>
                                    <th>Type</th>
                                    <th>Document Key</th>
                                    <th>Identity Documents</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {identities.map((identity, index) => (
                                    <tr key={index}>
                                        <td>{identity.description || 'N/A'}</td>
                                        <td>{identity.documentTypeName || 'N/A'}</td>
                                        <td>{identity.documentKey || 'N/A'}</td>
                                        <td>
                                            {identity.identityDocuments && identity.identityDocuments.length > 0 ? (
                                                <button className="view-documents-button">
                                                    View Documents
                                                </button>
                                            ) : (
                                                'No Documents'
                                            )}
                                        </td>
                                        <td>{identity.status || 'N/A'}</td>
                                        <td>
                                            <button className="general-action-button">Edit</button>
                                            <button className="general-action-button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No identities available</p>
                        )}
                        {isIdentityModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Add Identity</h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="documentType" className="create-provisioning-criteria-label">
                                                Document Type <span>*</span>
                                            </label>
                                            <select
                                                id="documentType"
                                                value={newIdentity.documentTypeId}
                                                onChange={(e) =>
                                                    setNewIdentity((prev) => ({
                                                        ...prev,
                                                        documentTypeId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Document Type</option>
                                                {documentTypeOptions.map((option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="status" className="create-provisioning-criteria-label">
                                                Status <span>*</span>
                                            </label>
                                            <select
                                                id="status"
                                                value={newIdentity.status}
                                                onChange={(e) =>
                                                    setNewIdentity((prev) => ({
                                                        ...prev,
                                                        status: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="documentKey" className="create-provisioning-criteria-label">
                                                Document Key <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="documentKey"
                                                value={newIdentity.documentKey}
                                                onChange={(e) =>
                                                    setNewIdentity((prev) => ({
                                                        ...prev,
                                                        documentKey: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="description" className="create-provisioning-criteria-label">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                id="description"
                                                value={newIdentity.description}
                                                onChange={(e) =>
                                                    setNewIdentity((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsIdentityModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddIdentity}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={
                                                !newIdentity.documentTypeId ||
                                                !newIdentity.status ||
                                                !newIdentity.documentKey
                                            }
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'documents':
                return (
                    <div className="general-section general-documents-section">
                        <div className="general-section-header">
                            <h3 className="general-section-title">Documents</h3>
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => setIsDocumentsModalOpen(true)}
                            >
                                Add Document
                            </button>
                        </div>
                        {documents.length > 0 ? (
                            <table className="general-accounts-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>File Name</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {documents.map((doc, index) => (
                                    <tr key={index}>
                                        <td>{doc.name}</td>
                                        <td>{doc.description || ''}</td>
                                        <td>{doc.fileName}</td>
                                        <td>
                                            {/*<button*/}
                                            {/*    className="general-action-button"*/}
                                            {/*    onClick={() => handleViewDocument(doc.id)}*/}
                                            {/*>*/}
                                            {/*    View*/}
                                            {/*</button>*/}
                                            {/*<button*/}
                                            {/*    className="general-action-button"*/}
                                            {/*    onClick={() => handleDeleteDocument(doc.id)}*/}
                                            {/*>*/}
                                            {/*    Delete*/}
                                            {/*</button>*/}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No documents available</p>
                        )}
                        {isDocumentsModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Upload Documents</h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="fileName" className="create-provisioning-criteria-label">
                                                File Name <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="fileName"
                                                value={newDocument.fileName}
                                                onChange={(e) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        fileName: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="description" className="create-provisioning-criteria-label">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                id="description"
                                                value={newDocument.description}
                                                onChange={(e) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        description: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="file" className="create-provisioning-criteria-label">
                                                Upload <span>*</span>
                                            </label>
                                            <input
                                                type="file"
                                                id="file"
                                                onChange={(e) =>
                                                    setNewDocument((prev) => ({
                                                        ...prev,
                                                        file: e.target.files[0],
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsDocumentsModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddDocument}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={!newDocument.fileName || !newDocument.file}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                                Created By: {note.createdBy || 'Unknown'} |{' '}
                                                {new Date(note.createdOn).toLocaleDateString(undefined, {
                                                    dateStyle: 'long',
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
            case 'testing':
                return (
                    <div>
                        <h3>Testing</h3>
                        <p>This tab is for testing purposes.</p>
                    </div>
                );
            default:
                return <div>Content Not Found</div>;
        }
    };

    //  Upload Image
    const handleImageSelect = (file) => {
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const clearImageSelection = () => {
        setSelectedImage(null);
        setPreviewImage(null);
    };

    const handleUploadClientImage = async () => {
        if (!selectedImage) return;

        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
        };

        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('filename', selectedImage.name);

        try {
            startLoading();
            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}/images`,
                formData,
                { headers }
            );

            const updatedClientData = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}`,
                { headers }
            );
            setClientDetails(updatedClientData.data);

            if (updatedClientData.data.imageId) {
                const fetchedImage = await fetchClientImage(updatedClientData.data.imageId, headers);
                setClientImage(fetchedImage);
            } else {
                console.warn("No image ID found in client details.");
                setClientImage(process.env.PUBLIC_URL + 'Images/user.jpg');
            }

            setIsUploadModalOpen(false);
            clearImageSelection();
        } catch (error) {
            console.error('Error uploading client image:', error);
        } finally {
            stopLoading();
        }
    };

    const handleDeleteClientImage = async () => {
        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
        };

        if (!window.confirm("Are you sure you want to delete this client image?")) {
            return;
        }

        try {
            startLoading();

            await axios.delete(`${API_CONFIG.baseURL}/clients/${clientId}/images`, { headers });

            const updatedClientData = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });
            setClientDetails(updatedClientData.data);

            setClientImage(process.env.PUBLIC_URL + 'Images/user.jpg');

        } catch (error) {
            console.error("Error deleting client image:", error);
        } finally {
            stopLoading();
        }
    };

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setCameraStream(stream);
            setIsCameraModalOpen(true);
        } catch (error) {
            console.error("Error accessing the camera:", error);
            alert("No camera detected or access denied.");
            setIsCameraModalOpen(false);
        }
    };

    const captureImage = (videoElement) => {
        if (!videoElement) {
            console.error("Video element not found");
            return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);

        stopCamera();
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
            setCameraStream(null);
        }
    };

    const handleUploadCapturedImage = async () => {
        if (!capturedImage) return;

        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
        };

        const formData = new FormData();
        const blob = await fetch(capturedImage).then((res) => res.blob());
        formData.append('file', blob, 'captured_image.jpg');
        formData.append('filename', 'captured_image.jpg');

        try {
            startLoading();
            await axios.post(`${API_CONFIG.baseURL}/clients/${clientId}/images`, formData, { headers });

            const updatedClientData = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });
            setClientDetails(updatedClientData.data);

            const updatedImage = await fetchClientImage(clientId, headers);
            setClientImage(updatedImage);

            setIsCameraModalOpen(false);
            setCapturedImage(null);
        } catch (error) {
            console.error('Error uploading captured image:', error);
            alert("Failed to upload image. Please try again.");
        } finally {
            stopLoading();
        }
    };

    if (!clientDetails) {
        return <div>Reload... </div>;
    }

    return (
        <div className="client-details-container">
            {/* Header Section */}
            <div className="client-details-header">
                {/* Left Section */}
                <div className="client-image-section">
                    <img
                        src={clientImage}
                        alt="Client"
                        className="client-image"
                    />

                    <div className="client-image-actions">
                        <button
                            className="icon-button"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <FaUpload color="#F94" size={20}/>
                        </button>
                        {/*<button className="icon-button" onClick={openCamera}>*/}
                        <button className="icon-button">
                            <FaCamera color="#F94" size={20}/>
                        </button>
                        <button className="icon-button" onClick={handleDeleteClientImage}>
                            <FaTrash color="#F94" size={20}/>
                        </button>
                    </div>
                    <button className="view-signature-button">
                        <FaSignature/> View Signature
                    </button>
                </div>

                {/* Middle Section */}
                <div className="client-info-section">
                    <h2 className={`client-name ${getStatusClass(clientDetails.status.value)}`}>
                        {clientDetails.displayName} ({clientDetails.status.value})
                    </h2>
                    <ul className="client-info-list">
                        <li><strong>Office:</strong> {clientDetails.officeName || ''}</li>
                        <li><strong>Client Number:</strong> {clientDetails.accountNo || ''}</li>
                        <li><strong>External ID:</strong> {clientDetails.externalId || ''}</li>
                        <li><strong>Activation Date:</strong> {formatDate(clientDetails.activationDate)}</li>
                    </ul>
                </div>

                {/* Right Section */}
                <div className="client-actions-section">
                    <button className="client-action-button">Edit</button>

                    <div className="client-dropdown">
                        <button className="client-action-button">Applications</button>
                        <div className="client-dropdown-content">
                            <button>New Loan Account</button>
                            <button>New Savings Account</button>
                            <button>New Share Account</button>
                            <button>New Recurring Deposit Account</button>
                            <button>New Fixed Deposits Account</button>
                        </div>
                    </div>

                    <div className="client-dropdown">
                        <button className="client-action-button">Actions</button>
                        <div className="client-dropdown-content">
                            <button>Close</button>
                            <button>Transfer Client</button>
                        </div>
                    </div>

                    <button className="client-action-button">Assign Staff</button>

                    <div className="client-dropdown">
                        <button className="client-action-button">More</button>
                        <div className="client-dropdown-content">
                            <button>Add Charge</button>
                            <button>Create Collateral</button>
                            <button>Survey</button>
                            <button>Update Default Savings</button>
                            <button>Upload Signature</button>
                            <button>Delete Signature</button>
                            <button>Client Screen Reports</button>
                            <button>Create Standing Instructions</button>
                            <button>View Standing Instructions</button>
                            <button>Create Self Service User</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="client-details-tabs">
                {['general', 'address', 'family', 'identities', 'documents', 'notes', 'testing'].map((tab) => (
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

            {/* Upload Image content  */}
            {isUploadModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Upload Client Image</h4>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="clientImageUpload" className="create-provisioning-criteria-label">
                                Select Image
                            </label>
                            <input
                                type="file"
                                id="clientImageUpload"
                                accept="image/*"
                                onChange={(e) => handleImageSelect(e.target.files[0])}
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        {selectedImage && (
                            <div className="image-preview">
                                <img src={previewImage} alt="Selected Preview" className="preview-thumbnail" />
                                <button
                                    onClick={clearImageSelection}
                                    className="delete-image-button"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => {
                                    setIsUploadModalOpen(false);
                                    clearImageSelection();
                                }}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadClientImage}
                                className="create-provisioning-criteria-confirm"
                                disabled={!selectedImage}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCameraModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Capture Client Image</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                {capturedImage ? (
                                    <div className="create-image-preview">
                                        <img src={capturedImage} alt="Captured Preview" className="preview-image" />
                                        <button
                                            onClick={() => setCapturedImage(null)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Retake
                                        </button>
                                    </div>
                                ) : (
                                    <div className="create-video-container">
                                        <video
                                            autoPlay
                                            playsInline
                                            ref={videoRef}
                                            className="camera-video"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => {
                                    stopCamera();
                                    setIsCameraModalOpen(false);
                                    setCapturedImage(null);
                                }}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            {!capturedImage && (
                                <button
                                    onClick={() => captureImage(videoRef.current)}
                                    className="create-provisioning-criteria-confirm"
                                >
                                    Capture
                                </button>
                            )}
                            {capturedImage && (
                                <button
                                    onClick={handleUploadCapturedImage}
                                    className="create-provisioning-criteria-confirm"
                                >
                                    Upload
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetails;
