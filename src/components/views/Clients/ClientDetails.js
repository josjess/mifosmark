import React, {useContext, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import { API_CONFIG } from '../../../config';
import {AuthContext} from "../../../context/AuthContext";
import {useLoading} from "../../../context/LoadingContext";
import {FaUpload, FaCamera, FaTrash, FaSignature, FaEdit, FaStickyNote, FaMoneyBill} from 'react-icons/fa';
import './ClientDetails.css'
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import {format} from "date-fns";

const ClientDetails = ({ clientId, onClose }) => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [clientDetails, setClientDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [templateData, setTemplateData] = useState(null);
    const [dataTables, setDataTables] = useState([]);
    const [collaterals, setCollaterals] = useState([]);
    const [charges, setCharges] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [clientImage, setClientImage] = useState(null);

    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentName, setDocumentName] = useState("clientSignature");
    const [documentDescription, setDocumentDescription] = useState("client signature");

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

    const [isCloseClientModalOpen, setIsCloseClientModalOpen] = useState(false);
    const [closeClientData, setCloseClientData] = useState(null);
    const [closeOnDate, setCloseOnDate] = useState('');
    const [closureReason, setClosureReason] = useState('');
    const [closureReasonOptions, setClosureReasonOptions] = useState([]);

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferOffice, setTransferOffice] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [transferNote, setTransferNote] = useState('');
    const [offices, setOffices] = useState([]);

    const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
    const [clientData, setClientData] = useState(null);
    const [staffOptions, setStaffOptions] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");

    const [isUnassignStaffModalOpen, setIsUnassignStaffModalOpen] = useState(false);
    const [staffIdToUnassign, setStaffIdToUnassign] = useState(null);

    const [isUndoTransferModalOpen, setIsUndoTransferModalOpen] = useState(false);
    const [undoTransferNote, setUndoTransferNote] = useState('');
    const [undoTransferDate, setUndoTransferDate] = useState(null);

    const [isAcceptTransferModalOpen, setIsAcceptTransferModalOpen] = useState(false);
    const [acceptTransferDate, setAcceptTransferDate] = useState(null);
    const [acceptTransferNote, setAcceptTransferNote] = useState('');
    const [destinationGroupId, setDestinationGroupId] = useState('');
    const [availableGroups, setAvailableGroups] = useState([]);
    const [currentGroupId, setCurrentGroupId] = useState(null);

    const [rejectTransferDate, setRejectTransferDate] = useState('');
    const [rejectTransferNote, setRejectTransferNote] = useState('');
    const [isRejectTransferModalOpen, setIsRejectTransferModalOpen] = useState(false);

    // Charge Modal state
    const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);

    // Charge-related states
    const [availableCharges, setAvailableCharges] = useState([]);
    const [selectedChargeId, setSelectedChargeId] = useState('');
    const [appliedCharges, setAppliedCharges] = useState([]);

    const [isAddCollateralModalOpen, setIsAddCollateralModalOpen] = useState(false);
    const [collateralOptions, setCollateralOptions] = useState([]);
    const [selectedCollateralId, setSelectedCollateralId] = useState('');
    const [collateralDetails, setCollateralDetails] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [total, setTotal] = useState(0);
    const [totalCollateralValue, setTotalCollateralValue] = useState(0);

    const [isUpdateSavingsModalOpen, setIsUpdateSavingsModalOpen] = useState(false);
    const [defaultSavingsAccountId, setDefaultSavingsAccountId] = useState('');
    const [savingAccountOptions, setSavingAccountOptions] = useState([]);

    const [isClientReportsModalOpen, setIsClientReportsModalOpen] = useState(false);
    const [availableReports, setAvailableReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [generatedReport, setGeneratedReport] = useState(null);
    const [isReportLoading, setIsReportLoading] = useState(false);

    // Modal visibility
    const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);

// Loan repayment details
    const [transactionDate, setTransactionDate] = useState(new Date());
    const [principal, setPrincipal] = useState(0);
    const [interest, setInterest] = useState(0);
    const [fees, setFees] = useState(0);
    const [penalties, setPenalties] = useState(0);
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [externalId, setExternalId] = useState("");
    const [selectedPaymentType, setSelectedPaymentType] = useState("");
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

// Payment details fields
    const [accountNumber, setAccountNumber] = useState("");
    const [chequeNumber, setChequeNumber] = useState("");
    const [routingCode, setRoutingCode] = useState("");
    const [receiptNumber, setReceiptNumber] = useState("");
    const [bankNumber, setBankNumber] = useState("");
    const [note, setNote] = useState("");

// Selected loan
    const [selectedLoan, setSelectedLoan] = useState(null);

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositTransactionDate, setDepositTransactionDate] = useState(new Date());
    const [depositTransactionAmount, setDepositTransactionAmount] = useState('');
    const [depositPaymentType, setDepositPaymentType] = useState('');
    const [depositPaymentDetailsVisible, setDepositPaymentDetailsVisible] = useState(false);
    const [depositAccountNumber, setDepositAccountNumber] = useState('');
    const [depositChequeNumber, setDepositChequeNumber] = useState('');
    const [depositRoutingCode, setDepositRoutingCode] = useState('');
    const [depositReceiptNumber, setDepositReceiptNumber] = useState('');
    const [depositBankNumber, setDepositBankNumber] = useState('');
    const [depositNote, setDepositNote] = useState('');

    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawTransactionDate, setWithdrawTransactionDate] = useState(new Date());
    const [withdrawTransactionAmount, setWithdrawTransactionAmount] = useState('');
    const [withdrawPaymentType, setWithdrawPaymentType] = useState('');
    const [withdrawPaymentDetailsVisible, setWithdrawPaymentDetailsVisible] = useState(false);
    const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
    const [withdrawChequeNumber, setWithdrawChequeNumber] = useState('');
    const [withdrawRoutingCode, setWithdrawRoutingCode] = useState('');
    const [withdrawReceiptNumber, setWithdrawReceiptNumber] = useState('');
    const [withdrawBankNumber, setWithdrawBankNumber] = useState('');
    const [withdrawNote, setWithdrawNote] = useState('');

    const [activeSection, setActiveSection] = useState('performance-history');
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);

    // General
    useEffect(() => {
        if (activeTab === 'general') {
            fetchGeneralTabData();
        }
    }, [activeTab, clientId]);

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

    const filteredRecurringDepositAccounts = accounts.recurringDepositAccounts?.filter((account) => showClosedRecurringDepositAccounts
                ? account.status?.value === "Closed"
                : account.status?.value !== "Closed"
    ) || [];

    const toggleShareAccountsView = () => {
        setShowClosedShareAccounts(!showClosedShareAccounts);
    };

    const filteredShareAccounts = accounts.shareAccounts?.filter((account) => showClosedShareAccounts
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
                    <div className="general-tab general-tab-container">
                        <div
                            className={`sidebar-toggle-handle ${isSidebarHidden ? 'collapsed' : ''}`}
                            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
                            title={isSidebarHidden ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            <div className="toggle-bar"></div>
                            <div className="toggle-bar"></div>
                            <div className="toggle-bar"></div>
                        </div>
                        <div className={`general-sidebar-container ${isSidebarHidden ? 'hidden' : ''}`}>
                            <div className="general-sidebar">
                                <ul>
                                    <li
                                        className={activeSection === 'performance-history' ? 'active' : ''}
                                        onClick={() => setActiveSection('performance-history')}
                                    >
                                        Performance History
                                    </li>
                                    <li
                                        className={activeSection === 'upcoming-charges' ? 'active' : ''}
                                        onClick={() => setActiveSection('upcoming-charges')}
                                    >
                                        Upcoming Charges
                                    </li>
                                    <li
                                        className={activeSection === 'loan-accounts' ? 'active' : ''}
                                        onClick={() => setActiveSection('loan-accounts')}
                                    >
                                        Loan Accounts
                                    </li>
                                    <li
                                        className={activeSection === 'saving-accounts' ? 'active' : ''}
                                        onClick={() => setActiveSection('saving-accounts')}
                                    >
                                        Savings Accounts
                                    </li>
                                    {/*<li*/}
                                    {/*    className={activeSection === 'fixed-deposit-accounts' ? 'active' : ''}*/}
                                    {/*    onClick={() => setActiveSection('fixed-deposit-accounts')}*/}
                                    {/*>*/}
                                    {/*    Fixed Deposit Accounts*/}
                                    {/*</li>*/}
                                    {/*<li*/}
                                    {/*    className={activeSection === 'recurring-deposit-accounts' ? 'active' : ''}*/}
                                    {/*    onClick={() => setActiveSection('recurring-deposit-accounts')}*/}
                                    {/*>*/}
                                    {/*    Recurring Deposit Accounts*/}
                                    {/*</li>*/}
                                    {/*<li*/}
                                    {/*    className={activeSection === 'share-accounts' ? 'active' : ''}*/}
                                    {/*    onClick={() => setActiveSection('share-accounts')}*/}
                                    {/*>*/}
                                    {/*    Share Accounts*/}
                                    {/*</li>*/}
                                    <li
                                        className={activeSection === 'collateral-data' ? 'active' : ''}
                                        onClick={() => setActiveSection('collateral-data')}
                                    >
                                        Collateral Data
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="general-tab-content">
                            {/* Performance History Section */}
                            {activeSection === 'performance-history' && (
                                <div id="performance-history" className="general-section general-performance-history">
                                    <h3 className="general-section-title">Performance History</h3>
                                    <div className="general-details-columns">
                                        <div className="general-details-column">
                                            <p><strong>No. of Loan
                                                Cycles:</strong> {clientDetails.performanceHistory?.loanCycles || ''}
                                            </p>
                                            <p><strong>Last Loan
                                                Amount:</strong> {clientDetails.performanceHistory?.lastLoanAmount || ''}
                                            </p>
                                            <p><strong>Total
                                                Savings:</strong> {clientDetails.performanceHistory?.totalSavings || ''}
                                            </p>
                                        </div>
                                        <div className="general-details-column">
                                            <p><strong>No. of Active
                                                Loans:</strong> {clientDetails.performanceHistory?.activeLoans || ''}
                                            </p>
                                            <p><strong>No. of Active
                                                Savings:</strong> {clientDetails.performanceHistory?.activeSavings || ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Charges Section */}
                            {activeSection === 'upcoming-charges' && (
                                <div id="upcoming-charges" className="general-section general-upcoming-charges">
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
                                                <tr
                                                    key={index}
                                                    onClick={() => handleUpcomingChargeRowClick(charge)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{charge.name}</td>
                                                    <td>{formatDate(charge.dueDate)}</td>
                                                    <td>{charge.due}</td>
                                                    <td>{charge.paid}</td>
                                                    <td>{charge.waived}</td>
                                                    <td>{charge.outstanding}</td>
                                                    <td>
                                                        <button className="general-action-button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent row click from triggering
                                                                }}
                                                        >View
                                                        </button>
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
                                                        <tr key={index}
                                                            onClick={() => handleChargeRowClick(charge)}
                                                            style={{cursor: "pointer"}}
                                                        >
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
                                </div>
                            )}

                            {/* Loan Accounts Section */}
                            {activeSection === 'loan-accounts' && (
                                <div id={'loan-accounts'} className="general-section general-loan-accounts">
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
                                                <tr key={index}
                                                    onClick={() => handleLoanRowClick(account)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{account.accountNo || "N/A"}</td>
                                                    <td>{account.productName || "N/A"}</td>
                                                    <td>{`${account.currency?.displaySymbol || ""} ${(account.originalLoan || 0).toLocaleString()}`}</td>
                                                    <td>{`${account.currency?.displaySymbol || ""} ${(account.loanBalance || 0).toLocaleString()}`}</td>
                                                    <td>{`${account.currency?.displaySymbol || ""} ${(account.amountPaid || 0).toLocaleString()}`}</td>
                                                    <td>{account.loanType?.value || "N/A"}</td>
                                                    {showClosedLoanAccounts ? (
                                                        <td>{account.closedDate ? formatDate(account.closedDate) : "N/A"}</td>
                                                    ) : (
                                                        <td>
                                                            <button
                                                                className="general-action-button"
                                                                title="Repay Loan"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedLoan(account);
                                                                    setIsRepaymentModalOpen(true);
                                                                    fetchLoanRepaymentDetails(account.id)
                                                                }}
                                                            >
                                                                Repay
                                                            </button>
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
                            )}

                            {/* Saving Accounts Section */}
                            {activeSection === 'saving-accounts' && (
                                <div id={'saving-accounts'} className="general-section general-saving-accounts">
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
                                                <tr key={index}
                                                    onClick={() => handleSavingsRowClick(account)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{account.accountNo}</td>
                                                    <td>{account.productName}</td>
                                                    {showClosedSavingsAccounts ? (
                                                        <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                                    ) : (
                                                        <>
                                                            <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                            <td>{`${account.currency?.displaySymbol || ""} ${(account.accountBalance || 0).toLocaleString()}`}</td>
                                                            <td>
                                                                <button
                                                                    className="general-action-button"
                                                                    onClick={() => handleOpenDepositModal()}
                                                                >
                                                                    Deposit
                                                                </button>
                                                                <button
                                                                    className="general-action-button"
                                                                    onClick={() => handleOpenWithdrawModal()}
                                                                >
                                                                    Withdraw
                                                                </button>
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
                            )}

                            {/* Fixed Deposit Accounts Section */}
                            {activeSection === 'fixed-deposit-accounts' && (
                                <div id={'fixed-deposit-accounts'}
                                     className="general-section general-fixed-deposit-accounts">
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
                                                <tr
                                                    key={index}
                                                    onClick={() => handleFixedDepositAccountRowClick(account)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{account?.accountNo}</td>
                                                    <td>{account?.productName}</td>
                                                    {showClosedFixedDepositAccounts ? (
                                                        <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                                    ) : (
                                                        <>
                                                            <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                            <td>{`${account.currency.displaySymbol} ${account.balance || 0}`}</td>
                                                            <td>
                                                                <button
                                                                    className="general-action-button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Prevent row click
                                                                    }}
                                                                >
                                                                    View
                                                                </button>
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
                            )}

                            {/* Recurring Deposit Accounts Section */}
                            {activeSection === 'recurring-deposit-accounts' && (
                                <div id={'recurring-deposit-accounts'}
                                     className="general-section general-recurring-deposit-accounts">
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
                                                <tr
                                                    key={index}
                                                    onClick={() => handleRecurringDepositAccountRowClick(account)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{account.accountNo}</td>
                                                    <td>{account.productName}</td>
                                                    {showClosedRecurringDepositAccounts ? (
                                                        <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                                    ) : (
                                                        <>
                                                            <td>{formatDate(account.lastActiveTransactionDate)}</td>
                                                            <td>{`${account.currency.displaySymbol} ${account.balance || 0}`}</td>
                                                            <td>
                                                                <button className="general-action-button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Prevent row click
                                                                        }}
                                                                >
                                                                    View
                                                                </button>
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
                            )}

                            {/* Share Accounts Section */}
                            {activeSection === 'share-accounts' && (
                                <div id={'share-accounts'} className="general-section general-share-accounts">
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
                                                <tr
                                                    key={index}
                                                    onClick={() => handleShareAccountRowClick(account)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{account.accountNo}</td>
                                                    <td>{account.productName}</td>
                                                    {showClosedShareAccounts ? (
                                                        <td>{formatDate(account.timeline?.closedOnDate)}</td>
                                                    ) : (
                                                        <>
                                                            <td>{account.approvedShares || 0}</td>
                                                            <td>{account.pendingForApprovalShares || 0}</td>
                                                            <td>
                                                                <button
                                                                    className="general-action-button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                    }}
                                                                >View
                                                                </button>
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
                            )}

                            {/* Collateral Data Section */}
                            {activeSection === 'collateral-data' && (
                                <div id={'collateral-data'} className="general-section general-collateral-data">
                                    <div className="general-section-header">
                                        <h3 className="general-section-title">Collateral Data</h3>
                                        <button
                                            className="general-collateral-button"
                                            disabled={!clientDetails?.clientCollateralManagements?.length}
                                        >
                                            View Collaterals
                                        </button>
                                    </div>
                                    <table className="general-collateral-table">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Percent To Base</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total Value</th>
                                            <th>Total Collateral Value</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {clientDetails?.clientCollateralManagements?.length > 0 ? (
                                            clientDetails.clientCollateralManagements.map((item, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleCollateralRowClick(item)}
                                                    style={{cursor: "pointer"}}
                                                >
                                                    <td>{item.id || "N/A"}</td>
                                                    <td>{item.name || "N/A"}</td>
                                                    <td>{item.pctToBase ? `${item.pctToBase}%` : "N/A"}</td>
                                                    <td>{item.quantity || "N/A"}</td>
                                                    <td>{item.unitPrice ? item.unitPrice.toLocaleString() : "N/A"}</td>
                                                    <td>{item.total ? item.total.toLocaleString() : "N/A"}</td>
                                                    <td>{item.totalCollateral ? item.totalCollateral.toLocaleString() : "N/A"}</td>
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
                            )}
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
            default:
                return <div>Content Not Found</div>;
        }
    };

    const handleSavingsRowClick = (account) => {
        navigate(`/client/${clientId}/savings-account/${account.savingsAccountId}`, { state: { account } });
    };

    const handleLoanRowClick = (loan) => {
        navigate(`/client/${clientId}/loan-details/${loan.id}`, { state: { loan } });
    };

    const handleChargeRowClick = (charge) => {
        console.log("Charge clicked:", charge);
    };

    const handleUpcomingChargeRowClick = (charge) => {
        console.log("Upcoming charge clicked:", charge);
    };

    const handleFixedDepositAccountRowClick = (account) => {
        console.log("Fixed deposit account row clicked:", account);
    };

    const handleRecurringDepositAccountRowClick = (account) => {
        console.log("Recurring deposit account row clicked:", account);
    };

    const handleShareAccountRowClick = (account) => {
        console.log("Share account row clicked:", account);
    };

    const handleCollateralRowClick = (item) => {
        navigate(`/client/${clientId}/collaterals/${item.id}`, { state: { collateral: item } });
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

    useEffect(() => {
        if (isCameraModalOpen) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    setCameraStream(stream);
                })
                .catch((error) => console.error("Error accessing camera:", error));
        }

        return () => {
            stopCamera();
        };
    }, [isCameraModalOpen]);

    const captureImage = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopCamera();
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            videoRef.current.srcObject = null;
        }

        setCameraStream(null);

    };

    const handleUploadCapturedImage = async () => {
        if (!capturedImage) return;

        const headers = {
            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
            'Fineract-Platform-TenantId': 'default',
        };

        const formData = new FormData();
        const blob = await fetch(capturedImage).then(res => res.blob());
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

    const fetchAndInitializeSignatureModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/documents`,
                { headers }
            );

            // Check if the signature document exists
            const signatureDocument = response.data.find(
                (doc) => doc.name === 'clientSignature'
            );

            if (signatureDocument) {
                setSignatureData({
                    id: signatureDocument.id,
                    name: signatureDocument.fileName,
                    description: signatureDocument.description,
                });
            } else {
                setSignatureData(null);
            }

            setIsSignatureModalOpen(true);
        } catch (error) {
            console.error('Error fetching signature documents:', error);
            setSignatureData(null);
            setIsSignatureModalOpen(true);
        }
    };

    const handleDeleteSignature = async () => {
        if (!signatureData || !signatureData.id) {
            alert("No signature to delete.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this signature?")) {
            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                await axios.delete(
                    `${API_CONFIG.baseURL}/clients/${clientId}/documents/${signatureData.id}`,
                    { headers }
                );

                alert("Signature deleted successfully.");
                setSignatureData(null);
                setIsSignatureModalOpen(false);
            } catch (error) {
                console.error('Error deleting signature:', error);
                alert("Failed to delete the signature. Please try again.");
            }
        }
    };

    const handleUploadDocument = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.doc,.docx";
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setSelectedDocument(file);
            }
        };
        input.click();
    };

    // const handleDownloadDocument = async () => {
    //     try {
    //         // Construct the URL for downloading the document
    //         const downloadUrl = `${API_CONFIG.baseURL}/clients/${clientId}/documents/${signatureData.id}/content`;
    //         const headers = {
    //             Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
    //             'Fineract-Platform-TenantId': 'default',
    //         };
    //
    //         // Fetch the actual document content
    //         const response = await axios.get(downloadUrl, { headers, responseType: 'blob' });
    //         const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //
    //         // Trigger the download
    //         const anchor = document.createElement('a');
    //         const objectUrl = URL.createObjectURL(blob);
    //         anchor.href = objectUrl;
    //         anchor.download = signatureData.fileName || 'downloaded_document';
    //         document.body.appendChild(anchor);
    //         anchor.click();
    //
    //         // Clean up
    //         document.body.removeChild(anchor);
    //         URL.revokeObjectURL(objectUrl);
    //     } catch (error) {
    //         console.error('Error downloading document:', error);
    //         alert('Failed to download the document. Please ensure the API supports this functionality.');
    //     }
    // };

    const handleSubmitDocument = async () => {
        if (!selectedDocument) {
            alert("Please select a document before submitting.");
            return;
        }

        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const formData = new FormData();
            formData.append("name", documentName);
            formData.append("description", documentDescription);
            formData.append("file", selectedDocument);

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}/documents`,
                formData,
                { headers }
            );

            alert("Document uploaded successfully!");
            setSelectedDocument(null);
            setIsSignatureModalOpen(false);
        } catch (error) {
            console.error("Error uploading document:", error);
            alert("Failed to upload the document. Please try again.");
        } finally {
            stopLoading();
        }
    };

    const handleEditClient = () => {
        navigate(`/clients/edit/${clientId}`);
    };

    const fetchCloseClientData = async () => {
        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            // Fetch client details
            const clientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });
            setCloseClientData(clientResponse.data);

            // Fetch closure reasons
            const templateResponse = await axios.get(`${API_CONFIG.baseURL}/clients/template?commandParam=close`, { headers });
            setClosureReasonOptions(templateResponse.data.narrations || []);

            setIsCloseClientModalOpen(true);
        } catch (error) {
            console.error('Error fetching close client data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleCloseClient = async () => {
        if (!closeOnDate || !closureReason) {
            alert('Both fields are required.');
            return;
        }

        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                dateFormat: 'yyyy-MM-dd',
                locale: 'en',
                closureDate: closeOnDate,
                closureReason: closureReason,
            };

            await axios.post(`${API_CONFIG.baseURL}/clients/${clientId}?command=close`, payload, { headers });

            alert('Client successfully closed.');
            setIsCloseClientModalOpen(false);
        } catch (error) {
            console.error('Error closing client:', error);
            alert('Failed to close client. Please try again.');
        } finally {
            stopLoading();
        }
    };

    const fetchOffices = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const officesResponse = await axios.get(`${API_CONFIG.baseURL}/offices`, { headers });
            const currentClientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });

            const currentOfficeId = currentClientResponse.data?.officeId;
            const filteredOffices = officesResponse.data?.filter((office) => office.id !== currentOfficeId);

            setOffices(filteredOffices || []);
        } catch (error) {
            console.error('Error fetching offices or client data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenTransferModal = async () => {
        await fetchOffices();
        setIsTransferModalOpen(true);
    };

    const handleTransferClient = async () => {
        if (!transferOffice || !transferDate) {
            alert('Please fill in all mandatory fields.');
            return;
        }

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Format the transfer date to "dd MMMM yyyy"
            const formattedTransferDate = format(new Date(transferDate), 'dd MMMM yyyy');

            // Adjusted payload with the correct format
            const payload = {
                destinationOfficeId: transferOffice,
                transferDate: formattedTransferDate,
                note: transferNote || '',
                dateFormat: 'dd MMMM yyyy',
                locale: 'en',
            };

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}?command=proposeTransfer`,
                payload,
                { headers }
            );

            setIsTransferModalOpen(false);
            fetchGeneralTabData();
        } catch (error) {
            console.error('Error proposing client transfer:', error);
            if (error.response?.data?.defaultUserMessage) {
                alert(error.response.data.defaultUserMessage);
            }
        } finally {
            stopLoading();
        }
    };

    const fetchAssignStaffData = async (clientId) => {
        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };

            const [clientResponse, staffTemplateResponse] = await Promise.all([
                axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers }),
                axios.get(
                    `${API_CONFIG.baseURL}/clients/${clientId}?template=true&staffInSelectedOfficeOnly=true`,
                    { headers }
                ),
            ]);

            setClientData(clientResponse.data);
            setStaffOptions(staffTemplateResponse.data.staffOptions || []);
        } catch (error) {
            console.error("Error fetching assign staff data:", error);
        } finally {
            stopLoading();
        }
    };

    const handleAssignStaff = async () => {
        if (!selectedStaff) {
            alert("Please select a staff member.");
            return;
        }

        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };

            const payload = {
                staffId: selectedStaff,
            };

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientData.id}?command=assignStaff`,
                payload,
                { headers }
            );

            setIsAssignStaffModalOpen(false);
            await fetchGeneralTabData();
        } catch (error) {
            console.error("Error assigning staff:", error);
            alert("Failed to assign staff. Please try again.");
        } finally {
            stopLoading();
        }
    };

    const openAssignStaffModal = () => {
        fetchAssignStaffData(clientId)
            .then(() => setIsAssignStaffModalOpen(true))
            .catch((error) => {
                console.error("Error fetching data for Assign Staff:", error);
            });
    };

    const openUnassignStaffModal = () => {
        if (clientDetails?.staffId) {
            setStaffIdToUnassign(clientDetails.staffId);
            setIsUnassignStaffModalOpen(true);
        }
    };

    const closeUnassignStaffModal = () => {
        setIsUnassignStaffModalOpen(false);
        setStaffIdToUnassign(null);
    };

    const handleUnassignStaff = async () => {
        if (!staffIdToUnassign) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                staffId: staffIdToUnassign,
            };

            await axios.post(`${API_CONFIG.baseURL}/clients/${clientId}?command=unassignStaff`, payload, { headers });

            await fetchGeneralTabData();
            closeUnassignStaffModal();
        } catch (error) {
            console.error('Error unassigning staff:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchUndoTransferData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const transferDateResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/transferproposaldate`,
                { headers }
            );

            if (transferDateResponse.status === 204 || !transferDateResponse.data) {
                console.warn('No transfer proposal date found for the client.');
                setUndoTransferDate(null);
            } else {
                setUndoTransferDate(transferDateResponse.data);
            }
        } catch (error) {
            console.error('Error fetching undo transfer data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenUndoTransferModal = () => {
        setIsUndoTransferModalOpen(true);
        fetchUndoTransferData();
    };

    const handleUndoTransfer = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}?command=withdrawTransfer`,
                { note: undoTransferNote },
                { headers }
            );

            fetchGeneralTabData();

            setIsUndoTransferModalOpen(false);
        } catch (error) {
            console.error('Error undoing transfer:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenAcceptTransferModal = () => {
        setIsAcceptTransferModalOpen(true);
        fetchAcceptTransferData();
    };

    const fetchAcceptTransferData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Fetch transfer proposal date
            const transferDateResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/transferproposaldate`,
                { headers }
            );
            const fetchedDate = transferDateResponse.data;

            if (transferDateResponse.status === 204 || !fetchedDate) {
                console.warn('No transfer proposal date found for the client.');
                setAcceptTransferDate(null);
            } else {
                const formattedDate = new Date(fetchedDate[0], fetchedDate[1] - 1, fetchedDate[2]);
                setAcceptTransferDate(formattedDate);
            }

            // Fetch all groups
            const allGroupsResponse = await axios.get(`${API_CONFIG.baseURL}/groups`, { headers });
            const allGroups = allGroupsResponse.data;

            // Fetch client details to identify the current group
            const clientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });
            const clientGroups = clientResponse.data.groups || [];
            const currentGroup = clientGroups.length > 0 ? clientGroups[0] : null;

            // Mark the current group with a special label
            const groupsWithLabel = allGroups.map((group) => ({
                ...group,
                label: currentGroup && group.id === currentGroup.id ? `${group.name} (Current Group)` : group.name,
            }));

            setAvailableGroups(groupsWithLabel);
            setCurrentGroupId(currentGroup ? currentGroup.id : null);
        } catch (error) {
            console.error('Error fetching accept transfer data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleAcceptTransfer = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                note: acceptTransferNote,
                destinationGroupId: parseInt(destinationGroupId, 10),
            };

            console.log("Payload being sent:", payload);

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}?command=acceptTransfer`,
                payload,
                { headers }
            );

            fetchGeneralTabData();
            setIsAcceptTransferModalOpen(false);
        } catch (error) {
            console.error('Error accepting transfer:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenRejectTransferModal = () => {
        setIsRejectTransferModalOpen(true);
        fetchRejectTransferData();
    };

    const fetchRejectTransferData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Fetch transfer proposal date
            const transferDateResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/transferproposaldate`,
                { headers }
            );
            const fetchedDate = transferDateResponse.data;
            if (transferDateResponse.status === 204 || !fetchedDate) {
                console.warn('No transfer proposal date found for the client.');
                setRejectTransferDate(null);
            } else {
                // Format fetchedDate into a valid Date object
                const formattedDate = new Date(fetchedDate[0], fetchedDate[1] - 1, fetchedDate[2]);
                setRejectTransferDate(formattedDate);
            }

        } catch (error) {
            console.error('Error fetching reject transfer data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleRejectTransfer = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                note: rejectTransferNote,
            };

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}?command=rejectTransfer`,
                payload,
                { headers }
            );

            setIsRejectTransferModalOpen(false);
            fetchGeneralTabData();
        } catch (error) {
            console.error('Error rejecting transfer:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchAddChargeData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Fetch charge options
            const chargeTemplateResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}/charges/template`,
                { headers }
            );
            setAvailableCharges(chargeTemplateResponse.data.chargeOptions || []);
        } catch (error) {
            console.error('Error fetching add charge data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleSelectCharge = (chargeId) => {
        if (!chargeId) return;

        // Find the selected charge details
        const selectedCharge = availableCharges.find(charge => charge.id === parseInt(chargeId, 10));
        if (selectedCharge) {
            // Add charge to appliedCharges and remove it from availableCharges
            setAppliedCharges(prev => [...prev, selectedCharge]);
            setAvailableCharges(prev => prev.filter(charge => charge.id !== selectedCharge.id));
            setSelectedChargeId(''); // Reset the dropdown selection
        }
    };

    const handleRemoveCharge = (chargeId) => {
        // Find the removed charge details
        const removedCharge = appliedCharges.find(charge => charge.id === chargeId);
        if (removedCharge) {
            // Remove charge from appliedCharges and add it back to availableCharges
            setAppliedCharges(prev => prev.filter(charge => charge.id !== chargeId));
            setAvailableCharges(prev => [...prev, removedCharge]);
        }
    };

    const handleOpenAddChargeModal = () => {
        setIsAddChargeModalOpen(true);
        fetchAddChargeData();
    };

    const handleOpenCreateCollateraModal = () => {
        setIsAddCollateralModalOpen(true);
        fetchCollateralOptions();
    };

    const fetchCollateralOptions = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const response = await axios.get(`${API_CONFIG.baseURL}/collateral-management`, { headers });
            setCollateralOptions(response.data);
        } catch (error) {
            console.error('Error fetching collateral options:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchCollateralDetails = async (collateralId) => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const response = await axios.get(`${API_CONFIG.baseURL}/collateral-management/${collateralId}?template=false`, {
                headers,
            });
            setCollateralDetails(response.data);
        } catch (error) {
            console.error('Error fetching collateral details:', error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (quantity && collateralDetails) {
            const calculatedTotal = quantity * collateralDetails.basePrice;
            setTotal(calculatedTotal);
            setTotalCollateralValue(calculatedTotal * (collateralDetails.pctToBase / 100));
        } else {
            setTotal(0);
            setTotalCollateralValue(0);
        }
    }, [quantity, collateralDetails]);

    const handleSubmitCollateral = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                collateralId: collateralDetails.id,
                quantity: quantity,
                locale: 'en',
            };

            await axios.post(`${API_CONFIG.baseURL}/clients/${clientId}/collaterals`, payload, { headers });

            // Refetch client data after successful submission
            fetchGeneralTabData();
            setIsAddCollateralModalOpen(false);
        } catch (error) {
            console.error('Error submitting collateral:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchUpdateSavingsData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Fetch client data
            const clientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });
            const currentSavingsAccountId = clientResponse.data.savingsAccountId || '';

            // Fetch template data
            const templateResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}?template=true&staffInSelectedOfficeOnly=true`,
                { headers }
            );
            const accountOptions = templateResponse.data.savingAccountOptions || [];

            setDefaultSavingsAccountId(currentSavingsAccountId);
            setSavingAccountOptions(accountOptions);
        } catch (error) {
            console.error('Error fetching update savings data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenUpdateSavingsModal = () => {
        setIsUpdateSavingsModalOpen(true);
        fetchUpdateSavingsData();
    };

    const handleUpdateSavings = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const payload = {
                savingsAccountId: defaultSavingsAccountId,
            };

            await axios.post(
                `${API_CONFIG.baseURL}/clients/${clientId}?command=updateSavingsAccount`,
                payload,
                { headers }
            );

            // Refetch client data to reflect the updated savings account
            fetchGeneralTabData();
            setIsUpdateSavingsModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating default savings:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchClientReportsData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            const clientResponse = await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });

            const templatesResponse = await axios.get(`${API_CONFIG.baseURL}/templates?entityId=0&typeId=0`, { headers });
            const reports = templatesResponse.data;

            setAvailableReports(reports);
        } catch (error) {
            console.error('Error fetching client reports data:', error);
        } finally {
            stopLoading();
        }
    };

    const handleOpenClientReportsModal = () => {
        setIsClientReportsModalOpen(true);
        fetchClientReportsData();
    };

    const handleGenerateReport = async () => {
        if (!selectedReportId) {
            alert('Please select a report to generate.');
            return;
        }

        setIsReportLoading(true);
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            const response = await axios.post(
                `${API_CONFIG.baseURL}/templates?clientId=${clientId}`,
                { reportId: selectedReportId },
                { headers }
            );

            setGeneratedReport(response.data);
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setIsReportLoading(false);
        }
    };

    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>Client Report</title></head><body>${generatedReport}</body></html>`);
        printWindow.document.close();
        printWindow.print();
    };

    const fetchLoanRepaymentDetails = async (loanId) => {
        try {
            startLoading();

            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };

            // Fetch repayment template data
            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=repayment`,
                { headers }
            );

            const data = response.data;

            setPrincipal(data.principalPortion || 0);
            setInterest(data.interestPortion || 0);
            setFees(data.feeChargesPortion || 0);
            setPenalties(data.penaltyChargesPortion || 0);
            setTransactionAmount(
                (data.principalPortion || 0) +
                (data.interestPortion || 0) +
                (data.feeChargesPortion || 0) +
                (data.penaltyChargesPortion || 0)
            );
            setPaymentTypeOptions(data.paymentTypeOptions || []);
        } catch (error) {
            console.error("Error fetching loan repayment details:", error);
            alert("Failed to fetch loan repayment details. Please try again.");
        } finally {
            stopLoading();
        }
    };

    const handleLoanRepayment = async () => {
        try {
            startLoading();

            const payload = {
                dateFormat: "dd MMMM yyyy",
                locale: "en",
                transactionDate: transactionDate
                    .toISOString()
                    .split("T")[0],
                transactionAmount,
                paymentTypeId: selectedPaymentType,
                externalId: externalId || null,
                note: note || null,
            };

            if (showPaymentDetails) {
                payload.accountNumber = accountNumber || null;
                payload.chequeNumber = chequeNumber || null;
                payload.routingCode = routingCode || null;
                payload.receiptNumber = receiptNumber || null;
                payload.bankNumber = bankNumber || null;
            }

            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${selectedLoan.id}/transactions?command=repayment`,
                payload,
                { headers }
            );

            alert("Loan repayment successful.");
            setIsRepaymentModalOpen(false);
            fetchGeneralTabData(); // Refresh loan accounts list
        } catch (error) {
            console.error("Error processing loan repayment:", error);
            alert("Loan repayment failed. Please try again.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenDepositModal = async () => {
        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });

            const transactionResponse = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${clientId}/transactions/template`,
                { headers }
            );

            setPaymentTypeOptions(transactionResponse.data.paymentTypeOptions || []);
            setIsDepositModalOpen(true);
        } catch (error) {
            console.error('Error fetching deposit details:', error);
            alert('Failed to load deposit details. Please try again.');
        } finally {
            stopLoading();
        }
    };

    const handleDepositSubmit = async () => {
        try {
            startLoading();

            const payload = {
                transactionDate: depositTransactionDate.toISOString().split('T')[0],
                transactionAmount: depositTransactionAmount,
                paymentTypeId: depositPaymentType,
                note: depositNote,
                accountNumber: depositPaymentDetailsVisible ? depositAccountNumber : undefined,
                chequeNumber: depositPaymentDetailsVisible ? depositChequeNumber : undefined,
                routingCode: depositPaymentDetailsVisible ? depositRoutingCode : undefined,
                receiptNumber: depositPaymentDetailsVisible ? depositReceiptNumber : undefined,
                bankNumber: depositPaymentDetailsVisible ? depositBankNumber : undefined,
                dateFormat: 'yyyy-MM-dd',
                locale: 'en',
            };

            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            await axios.post(`${API_CONFIG.baseURL}/savingsaccounts/${clientId}/transactions`, payload, { headers });

            setIsDepositModalOpen(false);
        } catch (error) {
            console.error('Error making deposit:', error);
            alert('Deposit failed. Please try again.');
        } finally {
            stopLoading();
        }
    };

    const handleOpenWithdrawModal = async () => {
        try {
            startLoading();
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
            };

            // Fetch client details
            await axios.get(`${API_CONFIG.baseURL}/clients/${clientId}`, { headers });

            // Fetch transaction template
            const transactionResponse = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${clientId}/transactions/template`,
                { headers }
            );

            setPaymentTypeOptions(transactionResponse.data.paymentTypeOptions || []);
            setIsWithdrawModalOpen(true);
        } catch (error) {
            console.error('Error fetching withdrawal details:', error);
            alert('Failed to load withdrawal details. Please try again.');
        } finally {
            stopLoading();
        }
    };

    const handleWithdrawSubmit = async (accountId) => {
        try {
            startLoading();

            const payload = {
                transactionDate: withdrawTransactionDate.toISOString().split('T')[0],
                transactionAmount: withdrawTransactionAmount,
                paymentTypeId: withdrawPaymentType,
                note: withdrawNote,
                accountNumber: withdrawPaymentDetailsVisible ? withdrawAccountNumber : undefined,
                chequeNumber: withdrawPaymentDetailsVisible ? withdrawChequeNumber : undefined,
                routingCode: withdrawPaymentDetailsVisible ? withdrawRoutingCode : undefined,
                receiptNumber: withdrawPaymentDetailsVisible ? withdrawReceiptNumber : undefined,
                bankNumber: withdrawPaymentDetailsVisible ? withdrawBankNumber : undefined,
                dateFormat: 'yyyy-MM-dd',
                locale: 'en',
            };

            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                'Fineract-Platform-TenantId': 'default',
                'Content-Type': 'application/json',
            };

            await axios.post(`${API_CONFIG.baseURL}/savingsaccounts/${accountId}/transactions`, payload, { headers });

            setIsWithdrawModalOpen(false);
        } catch (error) {
            console.error('Error making withdrawal:', error);
            alert('Withdrawal failed. Please try again.');
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
                            title={"Upload client Image"}
                            className="icon-button"
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <FaUpload color="#F94" size={20}/>
                        </button>
                        <button className="icon-button"
                                onClick={() => {
                                    setIsCameraModalOpen(true);
                                }}
                                title={"Take Client's picture"}
                        >
                            <FaCamera color="#F94" size={20}/>
                        </button>
                        <button className="icon-button" title={"Delete Client Image"} onClick={handleDeleteClientImage}>
                            <FaTrash color="#F94" size={20}/>
                        </button>
                    </div>
                    <button
                        className="view-signature-button"
                        onClick={fetchAndInitializeSignatureModal}
                    >
                        <FaSignature/> View Signature
                    </button>
                </div>

                {/* Middle Section */}
                <div className="client-info-section">
                    <h2 className={`client-name ${getStatusClass(clientDetails.status.value)}`}>
                        {clientDetails.displayName} ({clientDetails.status.value})
                    </h2>
                    <ul className="client-info-list">
                        <li>
                            {clientDetails.status.code === 'clientStatusType.transfer.in.progress' ? (
                                <>
                                    <span className="client-info-label">Current Office:</span>
                                    <span className="client-info-value">{clientDetails.officeName || ''}</span>
                                    <span className="client-info-label">Transfer To:</span>
                                    <span
                                        className="client-info-value">{clientDetails.transferToOfficeName || ''}</span>
                                </>
                            ) : (
                                <>
                                    <span className="client-info-label">Office:</span>
                                    <span className="client-info-value">{clientDetails.officeName || ''}</span>
                                </>
                            )}
                        </li>
                        <li>
                            <span className="client-info-label">Client Number:</span>
                            <span className="client-info-value">{clientDetails.accountNo || ''}</span>
                        </li>
                        {clientDetails.staffName && (
                            <li>
                                <span className="client-info-label">Staff:</span>
                                <span className="client-info-value">{clientDetails.staffName}</span>
                            </li>
                        )}
                        <li>
                            <span className="client-info-label">External ID:</span>
                            <span className="client-info-value">{clientDetails.externalId || ''}</span>
                        </li>
                        <li>
                            <span className="client-info-label">Activation Date:</span>
                            <span
                                className="client-info-value">{formatDate(clientDetails.timeline?.submittedOnDate)}</span>
                        </li>
                        {clientDetails.groups?.length > 0 && (
                            <li>
                                <span className="client-info-label">Member of:</span>
                                <span className="client-info-value">
                                    {clientDetails.groups.map((group, index) => (
                                        <span className="client-group-name" key={group.id}>
                                            {group.name}
                                            {index < clientDetails.groups.length - 1 && ', '}
                                        </span>
                                    ))}
                                </span>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="client-actions-section">
                    <button className="client-action-button" onClick={handleEditClient}>Edit</button>

                    {!clientDetails?.status?.code.includes('transfer.in.progress') &&
                        !clientDetails?.status?.code.includes('transfer.on.hold') && (
                            <div className="client-dropdown">
                                <button className="client-action-button">Applications</button>
                                <div className="client-dropdown-content">
                                    <button onClick={() => navigate(`/client/${clientId}/applications/loan`)}>New Loan
                                        Account
                                    </button>
                                    <button onClick={() => navigate(`/client/${clientId}/applications/savings`)}>New
                                        Savings
                                        Account
                                    </button>
                                    <button onClick={() => navigate(`/client/${clientId}/applications/share`)}>New Share
                                        Account
                                    </button>
                                    <button
                                        onClick={() => navigate(`/client/${clientId}/applications/recurring-deposit`)}>New
                                        Recurring Deposit Account
                                    </button>
                                    <button
                                        onClick={() => navigate(`/client/${clientId}/applications/fixed-deposit`)}>New
                                        Fixed
                                        Deposits Account
                                    </button>
                                </div>
                            </div>
                        )}

                    <div className="client-dropdown">
                        <button className="client-action-button">Actions</button>
                        <div className="client-dropdown-content">
                            <button onClick={fetchCloseClientData}>Close</button>
                            <button onClick={handleOpenTransferModal}>Transfer Client</button>
                            {clientDetails?.status?.code.includes('transfer.in.progress') && (
                                <>
                                    <button onClick={handleOpenUndoTransferModal}>Undo Transfer</button>
                                    <button onClick={handleOpenAcceptTransferModal}>Accept Transfer</button>
                                    <button onClick={handleOpenRejectTransferModal}>Reject Transfer</button>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        className="client-action-button"
                        onClick={clientDetails?.staffId ? openUnassignStaffModal : openAssignStaffModal}
                    >
                        {clientDetails?.staffId ? 'Unassign Staff' : 'Assign Staff'}
                    </button>

                    <div className="client-dropdown">
                        <button className="client-action-button">More</button>
                        <div className="client-dropdown-content">
                            <button onClick={handleOpenAddChargeModal}>Add Charge</button>
                            <button onClick={handleOpenCreateCollateraModal}>Create Collateral</button>
                            <button>Survey</button>
                            <button onClick={handleOpenUpdateSavingsModal}>Update Default Savings</button>
                            <button onClick={fetchAndInitializeSignatureModal}>Upload Signature</button>
                            <button onClick={fetchAndInitializeSignatureModal}>Delete Signature</button>
                            <button onClick={handleOpenClientReportsModal}>Client Screen Reports</button>
                            <button onClick={() => navigate(`/client/${clientId}/create-standing-instructions`)}>Create Standing Instructions</button>
                            <button onClick={() => navigate(`/client/${clientId}/view-standing-instructions`)}>View Standing Instructions</button>
                            {/*<button>Create Self Service User</button>*/}
                        </div>
                    </div>
                </div>

            </div>
            <div className="client-details-tabs">
            {['general', 'address', 'family', 'identities', 'documents', 'notes'].map((tab) => (
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
                                    setIsCameraModalOpen(false);
                                    stopCamera();
                                    setCapturedImage(null);
                                }}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            {capturedImage && (
                                <button
                                    onClick={() => {
                                        stopCamera();
                                        setIsCameraModalOpen(false);
                                        setCapturedImage(null);

                                        // Reopen the modal and restart the camera after a short delay
                                        setTimeout(() => setIsCameraModalOpen(true), 100);
                                    }}
                                    className="create-provisioning-criteria-cancel"
                                >
                                    Retake
                                </button>
                            )}
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
            {isSignatureModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Client Signature</h4>
                        {selectedDocument ? (
                            // Section for previewing the newly selected document before submission
                            <div className="create-document-preview-section">
                                <p>Selected Document: {selectedDocument.name}</p>
                                <div className="create-provisioning-criteria-modal-actions">
                                    <button
                                        onClick={handleSubmitDocument}
                                        className="create-provisioning-criteria-confirm"
                                    >
                                        Confirm and Submit
                                    </button>
                                    <button
                                        onClick={() => setSelectedDocument(null)}
                                        className="create-provisioning-criteria-cancel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : signatureData ? (
                            // Section for viewing, downloading, and deleting the existing document
                            <div className="create-document-preview-section">
                                <p className={"create-provisioning-criteria-label"}>
                                    <strong>File:</strong> {signatureData.name}
                                </p>
                                <div className="create-provisioning-criteria-modal-actions">
                                    {/*<button*/}
                                    {/*    onClick={() =>*/}
                                    {/*        window.open(*/}
                                    {/*            `${API_CONFIG.baseURL}/clients/${clientId}/documents/${signatureData.id}`,*/}
                                    {/*            '_blank'*/}
                                    {/*        )*/}
                                    {/*    }*/}
                                    {/*    className="create-provisioning-criteria-confirm"*/}
                                    {/*>*/}
                                    {/*    View*/}
                                    {/*</button>*/}
                                    {/*<button*/}
                                    {/*    onClick={handleDownloadDocument}*/}
                                    {/*    className="create-provisioning-criteria-confirm"*/}
                                    {/*>*/}
                                    {/*    Download*/}
                                    {/*</button>*/}
                                    <button
                                        onClick={handleDeleteSignature}
                                        className="create-provisioning-criteria-cancel"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setIsSignatureModalOpen(false)}
                                        className="create-provisioning-criteria-cancel"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Section when no document is uploaded
                            <div className="create-no-document-section">
                                <p>No document uploaded.</p>
                                <div className="create-provisioning-criteria-modal-actions">
                                    <button
                                        onClick={handleUploadDocument}
                                        className="create-provisioning-criteria-confirm"
                                    >
                                        Upload
                                    </button>
                                    <button
                                        onClick={() => setIsSignatureModalOpen(false)}
                                        className="create-provisioning-criteria-cancel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {isCloseClientModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Close Client</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="closeOnDate" className="create-provisioning-criteria-label">
                                    Closed On Date <span>*</span>
                                </label>
                                <DatePicker
                                    id="closeOnDate"
                                    selected={closeOnDate ? new Date(closeOnDate) : null}
                                    onChange={(date) => setCloseOnDate(date.toISOString().split('T')[0])}
                                    className="create-provisioning-criteria-input"
                                    placeholderText="Select Closed On Date"
                                    dateFormat="MMMM d, yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    required
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="closureReason" className="create-provisioning-criteria-label">
                                    Closure Reason <span>*</span>
                                </label>
                                <select
                                    id="closureReason"
                                    value={closureReason}
                                    onChange={(e) => setClosureReason(e.target.value)}
                                    className="create-provisioning-criteria-select"
                                    required
                                >
                                    <option value="">-- Select Reason --</option>
                                    {closureReasonOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsCloseClientModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCloseClient}
                                className="create-provisioning-criteria-confirm"
                                disabled={!closeOnDate || !closureReason}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isTransferModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Transfer Client</h4>

                        {/* Office Selection */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="transferOffice" className="create-provisioning-criteria-label">
                                    Office <span>*</span>
                                </label>
                                <select
                                    id="transferOffice"
                                    value={transferOffice}
                                    onChange={(e) => setTransferOffice(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    required
                                >
                                    <option value="">-- Select Office --</option>
                                    {offices.map((office) => (
                                        <option key={office.id} value={office.id}>
                                            {office.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Transfer Date */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="transferDate" className="create-provisioning-criteria-label">
                                    Transfer Date <span>*</span>
                                </label>
                                <DatePicker
                                    id="transferDate"
                                    selected={transferDate ? new Date(transferDate) : null}
                                    onChange={(date) => setTransferDate(date.toISOString().split('T')[0])}
                                    className="create-provisioning-criteria-input"
                                    placeholderText="Select Transfer Date"
                                    dateFormat="MMMM d, yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    minDate={new Date(new Date().getFullYear() - 1, 0, 1)}
                                    maxDate={new Date(new Date().getFullYear() + 5, 11, 31)}
                                    scrollableYearDropdown
                                    dropdownMode="select"
                                    required
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="transferNote" className="create-provisioning-criteria-label">
                                    Note
                                </label>
                                <textarea
                                    id="transferNote"
                                    value={transferNote}
                                    onChange={(e) => setTransferNote(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    placeholder="Optional: Add a note"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsTransferModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransferClient}
                                className="create-provisioning-criteria-confirm"
                                disabled={!transferOffice || !transferDate}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAssignStaffModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Assign Staff</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="staff" className="create-provisioning-criteria-label">
                                    Staff <span>*</span>
                                </label>
                                <select
                                    id="staff"
                                    value={selectedStaff}
                                    onChange={(e) => setSelectedStaff(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    required
                                >
                                    <option value="">-- Select Staff --</option>
                                    {staffOptions.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsAssignStaffModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignStaff}
                                className="create-provisioning-criteria-confirm"
                                disabled={!selectedStaff}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isUnassignStaffModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Unassign Staff</h4>
                        <p className="create-provisioning-criteria-label">Are you sure you want to unassign the staff from this client?</p>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={closeUnassignStaffModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnassignStaff}
                                className="create-provisioning-criteria-confirm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isUndoTransferModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Undo Transfer</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="transferDate" className="create-provisioning-criteria-label">
                                    Transfer Date
                                </label>
                                <DatePicker
                                    id="transferDate"
                                    selected={
                                        undoTransferDate
                                            ? new Date(undoTransferDate[0], undoTransferDate[1] - 1, undoTransferDate[2])
                                            : null
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholderText="Select Transfer Date"
                                    dateFormat="dd MMMM yyyy"
                                    readOnly
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="undoTransferNote" className="create-provisioning-criteria-label">
                                    Note
                                </label>
                                <textarea
                                    id="undoTransferNote"
                                    value={undoTransferNote}
                                    onChange={(e) => setUndoTransferNote(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter a note (optional)"
                                />
                            </div>
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsUndoTransferModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUndoTransfer}
                                className="create-provisioning-criteria-confirm"
                                disabled={!undoTransferDate}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAcceptTransferModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Accept Transfer</h4>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="acceptTransferDate" className="create-provisioning-criteria-label">
                                    Transfer Date
                                </label>
                                <DatePicker
                                    id="acceptTransferDate"
                                    selected={acceptTransferDate}
                                    className="create-provisioning-criteria-input"
                                    placeholderText="Transfer Date"
                                    dateFormat="dd MMMM yyyy"
                                    readOnly
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="destinationGroup" className="create-provisioning-criteria-label">
                                    Destination Group
                                </label>
                                <select
                                    id="destinationGroup"
                                    value={destinationGroupId || currentGroupId}
                                    onChange={(e) => setDestinationGroupId(parseInt(e.target.value, 10))}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">-- Select Group --</option>
                                    {availableGroups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="acceptTransferNote" className="create-provisioning-criteria-label">
                                    Note
                                </label>
                                <textarea
                                    id="acceptTransferNote"
                                    value={acceptTransferNote}
                                    onChange={(e) => setAcceptTransferNote(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter a note (optional)"
                                />
                            </div>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsAcceptTransferModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAcceptTransfer}
                                className="create-provisioning-criteria-confirm"
                                disabled={!destinationGroupId}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isRejectTransferModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Reject Transfer</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="rejectTransferDate" className="create-provisioning-criteria-label">
                                    Transfer Date
                                </label>
                                <DatePicker
                                    id="rejectTransferDate"
                                    selected={rejectTransferDate}
                                    className="create-provisioning-criteria-input"
                                    placeholderText="Transfer Date"
                                    dateFormat="dd MMMM yyyy"
                                    readOnly
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="rejectTransferNote" className="create-provisioning-criteria-label">
                                    Note
                                </label>
                                <textarea
                                    id="rejectTransferNote"
                                    value={rejectTransferNote}
                                    onChange={(e) => setRejectTransferNote(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                    rows="3"
                                    placeholder="Enter a note for rejecting the transfer"
                                />
                            </div>
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsRejectTransferModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectTransfer}
                                className="create-provisioning-criteria-confirm"
                                disabled={!rejectTransferDate}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAddChargeModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Add Charge</h4>

                        {/* Charge Selection Dropdown */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="chargeDropdown" className="create-provisioning-criteria-label">
                                    Select Charge <span>*</span>
                                </label>
                                <select
                                    id="chargeDropdown"
                                    value={selectedChargeId}
                                    onChange={(e) => handleSelectCharge(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">-- Select a Charge --</option>
                                    {availableCharges.map((charge) => (
                                        <option key={charge.id} value={charge.id}>
                                            {charge.name} - {charge.amount} {charge.currency}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Charges Table */}
                        {appliedCharges.length > 0 && (
                            <div className="create-charge-table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Charge Name</th>
                                        <th>Amount</th>
                                        <th>Currency</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {appliedCharges.map((charge) => (
                                        <tr key={charge.id}>
                                            <td>{charge.name}</td>
                                            <td>{charge.amount}</td>
                                            <td>{charge.currency}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleRemoveCharge(charge.id)}
                                                    className="create-provisioning-criteria-cancel"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsAddChargeModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.log('Submitting charges:', appliedCharges);
                                    setIsAddChargeModalOpen(false);
                                }}
                                className="create-provisioning-criteria-confirm"
                                disabled={appliedCharges.length === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAddCollateralModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Add Collateral</h4>

                        {/* Collateral Selection */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="collateralDropdown" className="create-provisioning-criteria-label">
                                    Collateral <span>*</span>
                                </label>
                                <select
                                    id="collateralDropdown"
                                    value={selectedCollateralId}
                                    onChange={(e) => {
                                        setSelectedCollateralId(e.target.value);
                                        fetchCollateralDetails(e.target.value);
                                    }}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">-- Select Collateral --</option>
                                    {collateralOptions.map((collateral) => (
                                        <option key={collateral.id} value={collateral.id}>
                                            {collateral.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {collateralDetails && (
                            <>
                                {/* Read-Only Fields */}
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Name (read only!)</label>
                                        <input
                                            type="text"
                                            value={collateralDetails.name}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Type/Quality (read only!)</label>
                                        <input
                                            type="text"
                                            value={collateralDetails.quality}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Unit Type (read only!)</label>
                                        <input
                                            type="text"
                                            value={collateralDetails.unitType}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Base Price (read only!)</label>
                                        <input
                                            type="text"
                                            value={collateralDetails.basePrice}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Percentage to Base (read only!)</label>
                                        <input
                                            type="text"
                                            value={`${collateralDetails.pctToBase}%`}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Editable Fields */}
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="quantity" className="create-provisioning-criteria-label">
                                            Quantity <span>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>

                                {/* Calculated Fields */}
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Total (Auto Calculated!)</label>
                                        <input
                                            type="text"
                                            value={total}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label">Total Collateral Value </label>
                                        <input
                                            type="text"
                                            value={totalCollateralValue}
                                            className="create-provisioning-criteria-input"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsAddCollateralModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitCollateral}
                                className="create-provisioning-criteria-confirm"
                                disabled={!quantity || !collateralDetails}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isUpdateSavingsModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Update Default Savings Account</h4>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="defaultSavingsAccount" className="create-provisioning-criteria-label">
                                    Default Savings Account
                                </label>
                                <select
                                    id="defaultSavingsAccount"
                                    value={defaultSavingsAccountId}
                                    onChange={(e) => setDefaultSavingsAccountId(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">-- Select Savings Account --</option>
                                    {savingAccountOptions.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.accountNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsUpdateSavingsModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateSavings}
                                className="create-provisioning-criteria-confirm"
                                disabled={!defaultSavingsAccountId}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isClientReportsModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Client Screen Reports</h4>

                        {/* Report Selection */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="clientReport" className="create-provisioning-criteria-label">
                                    Client Screen Reports
                                </label>
                                <select
                                    id="clientReport"
                                    value={selectedReportId}
                                    onChange={(e) => setSelectedReportId(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">-- Select Report --</option>
                                    {availableReports.map((report) => (
                                        <option key={report.id} value={report.id}>
                                            {report.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsClientReportsModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateReport}
                                className="create-provisioning-criteria-confirm"
                                disabled={!selectedReportId}
                            >
                                Generate Report
                            </button>
                        </div>

                        {/* Report Display Section */}
                        {generatedReport && (
                            <>
                                <div className="create-holiday-row">
                                    <button
                                        onClick={handlePrintReport}
                                        className="create-provisioning-criteria-confirm"
                                    >
                                        Print Report
                                    </button>
                                </div>
                                <div className="create-report-section">
                                    <h4>Generated Report</h4>
                                    <div className="create-report-content" dangerouslySetInnerHTML={{ __html: generatedReport }} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {isRepaymentModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Repay Loan</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="transactionDate"
                                selected={transactionDate}
                                onChange={(date) => setTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Principal, Interest, Fees, Penalties */}
                        <div className="create-holiday-row">
                            <ul className="repayment-summary-list">
                                <li className="create-provisioning-criteria-label">Principal: {principal.toLocaleString()}</li>
                                <li className="create-provisioning-criteria-label">Interest: {interest.toLocaleString()}</li>
                                <li className="create-provisioning-criteria-label">Fees: {fees.toLocaleString()}</li>
                                <li className="create-provisioning-criteria-label">Penalties: {penalties.toLocaleString()}</li>
                            </ul>
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="transactionAmount"
                                value={transactionAmount}
                                onChange={(e) => setTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        <div className="create-holiday-row">
                            {/* External ID */}
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="externalId" className="create-provisioning-criteria-label">
                                    External ID
                                </label>
                                <input
                                    type="text"
                                    id="externalId"
                                    value={externalId}
                                    onChange={(e) => setExternalId(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                />
                            </div>

                            {/* Payment Type */}
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="paymentType" className="create-provisioning-criteria-label">
                                    Payment Type <span>*</span>
                                </label>
                                <select
                                    id="paymentType"
                                    value={selectedPaymentType}
                                    onChange={(e) => setSelectedPaymentType(e.target.value)}
                                    className="create-provisioning-criteria-input"
                                >
                                    <option value="">Select Payment Type</option>
                                    {paymentTypeOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showPaymentDetails"
                                        checked={showPaymentDetails}
                                        onChange={(e) => setShowPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details Fields */}
                        {showPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={chequeNumber}
                                        onChange={(e) => setChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={routingCode}
                                        onChange={(e) => setRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={receiptNumber}
                                        onChange={(e) => setReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={bankNumber}
                                        onChange={(e) => setBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="note">Note</label>
                            <textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsRepaymentModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLoanRepayment}
                                className="create-provisioning-criteria-confirm"
                                disabled={!transactionDate || !transactionAmount || !selectedPaymentType}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isDepositModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Deposit Money To Savings Account</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="depositTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="depositTransactionDate"
                                selected={depositTransactionDate}
                                onChange={(date) => setDepositTransactionDate(date)}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                                maxDate={new Date()}
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="depositTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="depositTransactionAmount"
                                value={depositTransactionAmount}
                                onChange={(e) => setDepositTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="depositPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="depositPaymentType"
                                value={depositPaymentType}
                                onChange={(e) => setDepositPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">-- Select Payment Type --</option>
                                {paymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Toggle Payment Details */}
                        <div className="create-holiday-row">
                            <label className="create-provisioning-criteria-label" htmlFor="showPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showPaymentDetails"
                                        checked={depositPaymentDetailsVisible}
                                        onChange={(e) => setDepositPaymentDetailsVisible(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details Fields */}
                        {depositPaymentDetailsVisible && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account Number"
                                        value={depositAccountNumber}
                                        onChange={(e) => setDepositAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque Number"
                                        value={depositChequeNumber}
                                        onChange={(e) => setDepositChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={depositRoutingCode}
                                        onChange={(e) => setDepositRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt Number"
                                        value={depositReceiptNumber}
                                        onChange={(e) => setDepositReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank"
                                        value={depositBankNumber}
                                        onChange={(e) => setDepositBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Notes */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="depositNote" className="create-provisioning-criteria-label">
                                Notes
                            </label>
                            <textarea
                                id="depositNote"
                                value={depositNote}
                                onChange={(e) => setDepositNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDepositSubmit}
                                className="create-provisioning-criteria-confirm"
                                disabled={!depositTransactionDate || !depositTransactionAmount || !depositPaymentType}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isWithdrawModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Withdraw Money From Savings Account</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="withdrawTransactionDate"
                                selected={withdrawTransactionDate}
                                onChange={(date) => setWithdrawTransactionDate(date)}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                                maxDate={new Date()}
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="withdrawTransactionAmount"
                                value={withdrawTransactionAmount}
                                onChange={(e) => setWithdrawTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="withdrawPaymentType"
                                value={withdrawPaymentType}
                                onChange={(e) => setWithdrawPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">-- Select Payment Type --</option>
                                {paymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Toggle Payment Details */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showWithdrawPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showWithdrawPaymentDetails"
                                        checked={withdrawPaymentDetailsVisible}
                                        onChange={(e) => setWithdrawPaymentDetailsVisible(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details Fields */}
                        {withdrawPaymentDetailsVisible && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account Number"
                                        value={withdrawAccountNumber}
                                        onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque"
                                        value={withdrawChequeNumber}
                                        onChange={(e) => setWithdrawChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={withdrawRoutingCode}
                                        onChange={(e) => setWithdrawRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt Number"
                                        value={withdrawReceiptNumber}
                                        onChange={(e) => setWithdrawReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank"
                                        value={withdrawBankNumber}
                                        onChange={(e) => setWithdrawBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}
                        {/* Notes */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawNote" className="create-provisioning-criteria-label">
                                Notes
                            </label>
                            <textarea
                                id="withdrawNote"
                                value={withdrawNote}
                                onChange={(e) => setWithdrawNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleWithdrawSubmit(clientId)}
                                className="create-provisioning-criteria-confirm"
                                disabled={!withdrawTransactionDate || !withdrawTransactionAmount || !withdrawPaymentType}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ClientDetails;
