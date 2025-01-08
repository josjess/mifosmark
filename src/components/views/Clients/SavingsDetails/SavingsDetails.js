import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { useLoading } from "../../../../context/LoadingContext";
import { API_CONFIG } from "../../../../config";
import "./SavingsDetails.css";
import {FaCaretLeft, FaCaretRight, FaEdit, FaStickyNote, FaTrash} from "react-icons/fa";
import DatePicker from "react-datepicker";

const SavingsAccounts = () => {
    const { clientId, savingsAccountId } = useParams();
    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [savingsDetails, setSavingsDetails] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("general");
    const [accountImage, setAccountImage] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const dropdownRef = useRef(null);
    const tabsContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [hideReversed, setHideReversed] = useState(false);
    const [hideAccruals, setHideAccruals] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(Math.ceil(transactions.length / pageSize));
    const [currentPageData, setCurrentPageData] = useState([]);

    const [showInactiveCharges, setShowInactiveCharges] = useState(false);
    const [activeCharges, setActiveCharges] = useState([]);
    const [inactiveCharges, setInactiveCharges] = useState([]);

    const [documents, setDocuments] = useState([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadPayload, setUploadPayload] = useState({
        fileName: "",
        description: "",
        file: null,
    });

    const [notes, setNotes] = useState([]);
    const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [depositTransactionDate, setDepositTransactionDate] = useState(new Date());
    const [depositTransactionAmount, setDepositTransactionAmount] = useState("");
    const [depositPaymentTypeOptions, setDepositPaymentTypeOptions] = useState([]);
    const [depositSelectedPaymentType, setDepositSelectedPaymentType] = useState("");
    const [showDepositPaymentDetails, setShowDepositPaymentDetails] = useState(false);
    const [depositAccountNumber, setDepositAccountNumber] = useState("");
    const [depositChequeNumber, setDepositChequeNumber] = useState("");
    const [depositRoutingCode, setDepositRoutingCode] = useState("");
    const [depositReceiptNumber, setDepositReceiptNumber] = useState("");
    const [depositBankNumber, setDepositBankNumber] = useState("");
    const [depositNote, setDepositNote] = useState("");
    const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

    const [isBlockDepositModalOpen, setIsBlockDepositModalOpen] = useState(false);
    const [blockDepositReasonOptions, setBlockDepositReasonOptions] = useState([]);
    const [selectedBlockDepositReason, setSelectedBlockDepositReason] = useState("");
    const [isSubmittingBlockDeposit, setIsSubmittingBlockDeposit] = useState(false);

    const [withdrawTransactionDate, setWithdrawTransactionDate] = useState(new Date());
    const [withdrawTransactionAmount, setWithdrawTransactionAmount] = useState(0);
    const [withdrawPaymentTypeOptions, setWithdrawPaymentTypeOptions] = useState([]);
    const [withdrawSelectedPaymentType, setWithdrawSelectedPaymentType] = useState("");
    const [withdrawNote, setWithdrawNote] = useState("");
    const [showWithdrawPaymentDetails, setShowWithdrawPaymentDetails] = useState(false);
    const [withdrawAccountNumber, setWithdrawAccountNumber] = useState("");
    const [withdrawChequeNumber, setWithdrawChequeNumber] = useState("");
    const [withdrawRoutingCode, setWithdrawRoutingCode] = useState("");
    const [withdrawReceiptNumber, setWithdrawReceiptNumber] = useState("");
    const [withdrawBankNumber, setWithdrawBankNumber] = useState("");
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

    const [isBlockWithdrawalModalOpen, setIsBlockWithdrawalModalOpen] = useState(false);
    const [blockWithdrawalReason, setBlockWithdrawalReason] = useState("");
    const [blockWithdrawalReasons, setBlockWithdrawalReasons] = useState([]);

    const [isBlockAccountModalOpen, setIsBlockAccountModalOpen] = useState(false);
    const [blockAccountReason, setBlockAccountReason] = useState("");
    const [blockAccountReasons, setBlockAccountReasons] = useState([]);

    const [isHoldAmountModalOpen, setIsHoldAmountModalOpen] = useState(false);
    const [holdAmountReason, setHoldAmountReason] = useState("");
    const [holdAmountReasons, setHoldAmountReasons] = useState([]);
    const [holdTransactionDate, setHoldTransactionDate] = useState(new Date());
    const [holdTransactionAmount, setHoldTransactionAmount] = useState("");

    const [isCalculateInterestModalOpen, setIsCalculateInterestModalOpen] = useState(false);

    const [isPostInterestAsOnModalOpen, setIsPostInterestAsOnModalOpen] = useState(false);
    const [postInterestTransactionDate, setPostInterestTransactionDate] = useState(new Date());

    const [isPostInterestModalOpen, setIsPostInterestModalOpen] = useState(false);

    const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
    const [chargeOptions, setChargeOptions] = useState([]);
    const [selectedCharge, setSelectedCharge] = useState(null);
    const [chargeAmount, setChargeAmount] = useState("");
    const [dueDate, setDueDate] = useState(new Date());

    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [closeTransactionDate, setCloseTransactionDate] = useState(new Date());
    const [isWithdrawBalance, setIsWithdrawBalance] = useState(false);
    const [isInterestPostingRequired, setIsInterestPostingRequired] = useState(false);
    const [closeTransactionAmount, setCloseTransactionAmount] = useState(0);
    const [closePaymentTypeOptions, setClosePaymentTypeOptions] = useState([]);
    const [closeSelectedPaymentType, setCloseSelectedPaymentType] = useState("");
    const [showClosePaymentDetails, setShowClosePaymentDetails] = useState(false);
    const [closeAccountNumber, setCloseAccountNumber] = useState("");
    const [closeChequeNumber, setCloseChequeNumber] = useState("");
    const [closeRoutingCode, setCloseRoutingCode] = useState("");
    const [closeReceiptNumber, setCloseReceiptNumber] = useState("");
    const [closeBankNumber, setCloseBankNumber] = useState("");
    const [closeNote, setCloseNote] = useState("");

    const [isTransferFundsModalOpen, setIsTransferFundsModalOpen] = useState(false);
    const [transferApplicant, setTransferApplicant] = useState("");
    const [transferOffice, setTransferOffice] = useState("");
    const [transferFromAccount, setTransferFromAccount] = useState("");
    const [transferFromAccountType, setTransferFromAccountType] = useState("");
    const [transferCurrency, setTransferCurrency] = useState("");

    const [transferTransactionDate, setTransferTransactionDate] = useState(new Date());
    const [transferToOfficeOptions, setTransferToOfficeOptions] = useState([]);
    const [transferToOffice, setTransferToOffice] = useState("");
    const [transferToClientOptions, setTransferToClientOptions] = useState([]);
    const [transferToClient, setTransferToClient] = useState("");
    const [transferToAccountTypeOptions, setTransferToAccountTypeOptions] = useState([]);
    const [transferToAccountType, setTransferToAccountType] = useState("");
    const [transferToAccountOptions, setTransferToAccountOptions] = useState([]);
    const [transferToAccount, setTransferToAccount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferDescription, setTransferDescription] = useState("");

    const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
    const [assignStaffOptions, setAssignStaffOptions] = useState([]);
    const [assignToStaff, setAssignToStaff] = useState("");
    const [assignmentDate, setAssignmentDate] = useState(new Date());

    const handleOpenAssignStaffModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?template=true&associations=charges`,
                { headers }
            );

            const data = response.data || {};
            setAssignStaffOptions(data.fieldOfficerOptions || []);
            setIsAssignStaffModalOpen(true);
        } catch (error) {
            console.error("Error fetching assign staff data:", error);
            alert("Failed to load data for assigning staff.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseAssignStaffModal = () => {
        setIsAssignStaffModalOpen(false);
        setAssignToStaff("");
        setAssignmentDate(new Date());
    };

    const handleSubmitAssignStaff = async () => {
        if (!assignToStaff || !assignmentDate) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            staffId: assignToStaff,
            assignmentDate: assignmentDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?command=assignStaff`,
                payload,
                { headers }
            );

            alert("Staff assigned successfully.");
            handleCloseAssignStaffModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error assigning staff:", error);
            alert("Failed to assign staff.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenTransferFundsModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/accounttransfers/template?fromAccountId=${savingsAccountId}&fromAccountType=2`,
                { headers }
            );

            const data = response.data || {};
            setTransferApplicant(data.fromClient?.displayName || "N/A");
            setTransferOffice(data.fromOffice?.name || "N/A");
            setTransferFromAccount(data.fromAccount?.accountNo || "N/A");
            setTransferFromAccountType(data.fromAccountType?.value || "N/A");
            setTransferCurrency(data.currency?.name || "N/A");

            setTransferToOfficeOptions(data.toOfficeOptions || []);
            setTransferToClientOptions(data.fromClientOptions || []);
            setTransferToAccountTypeOptions(data.toAccountTypeOptions || []);
            setTransferToAccountOptions(data.fromAccountOptions || []);

            setIsTransferFundsModalOpen(true);
        } catch (error) {
            console.error("Error fetching transfer funds data:", error);
            alert("Failed to load data for fund transfer.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseTransferFundsModal = () => {
        setIsTransferFundsModalOpen(false);
        setTransferTransactionDate(new Date());
        setTransferToOffice("");
        setTransferToClient("");
        setTransferToAccountType("");
        setTransferToAccount("");
        setTransferAmount("");
        setTransferDescription("");
    };

    const handleSubmitTransferFunds = async () => {
        if (
            !transferTransactionDate ||
            !transferToOffice ||
            !transferToClient ||
            !transferToAccountType ||
            !transferToAccount ||
            !transferAmount ||
            !transferDescription
        ) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transferDate: transferTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            toOfficeId: transferToOffice,
            toClientId: transferToClient,
            toAccountType: transferToAccountType,
            toAccountId: transferToAccount,
            transferAmount: parseFloat(transferAmount),
            description: transferDescription,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(`${API_CONFIG.baseURL}/accounttransfers`, payload, { headers });

            alert("Funds transferred successfully.");
            handleCloseTransferFundsModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error transferring funds:", error);
            alert("Failed to transfer funds.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenCloseModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions/template`,
                { headers }
            );

            const data = response.data || {};
            setCloseTransactionAmount(data.accountBalance || 0);
            setClosePaymentTypeOptions(data.paymentTypeOptions || []);
            setIsCloseModalOpen(true);
        } catch (error) {
            console.error("Error fetching close account data:", error);
            alert("Failed to load data for closing the account.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseCloseModal = () => {
        setIsCloseModalOpen(false);
        setCloseTransactionDate(new Date());
        setIsWithdrawBalance(false);
        setIsInterestPostingRequired(false);
        setCloseTransactionAmount(0);
        setCloseSelectedPaymentType("");
        setShowClosePaymentDetails(false);
        setCloseAccountNumber("");
        setCloseChequeNumber("");
        setCloseRoutingCode("");
        setCloseReceiptNumber("");
        setCloseBankNumber("");
        setCloseNote("");
    };

    const handleSubmitClose = async () => {
        if (!closeTransactionDate || (isWithdrawBalance && !closeSelectedPaymentType)) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: closeTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            isWithdrawBalance,
            isInterestPostingRequired,
            ...(isWithdrawBalance && {
                transactionAmount: closeTransactionAmount,
                paymentTypeId: closeSelectedPaymentType,
                accountNumber: closeAccountNumber,
                chequeNumber: closeChequeNumber,
                routingCode: closeRoutingCode,
                receiptNumber: closeReceiptNumber,
                bankNumber: closeBankNumber,
            }),
            note: closeNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?command=close`,
                payload,
                { headers }
            );

            alert("Account closed successfully.");
            handleCloseCloseModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error closing account:", error);
            alert("Failed to close the account.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenAddChargeModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/charges/template`,
                { headers }
            );

            const data = response.data || {};
            setChargeOptions(data.chargeOptions || []);
            setIsAddChargeModalOpen(true);
        } catch (error) {
            console.error("Error fetching charge template:", error);
            alert("Failed to load data for adding a charge.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseAddChargeModal = () => {
        setIsAddChargeModalOpen(false);
        setSelectedCharge(null);
        setChargeAmount("");
        setDueDate(new Date());
    };

    const handleSubmitAddCharge = async () => {
        if (!selectedCharge || !chargeAmount || !dueDate) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            chargeId: selectedCharge.id,
            amount: parseFloat(chargeAmount),
            dueDate: dueDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/charges`,
                payload,
                { headers }
            );

            alert("Charge added successfully.");
            handleCloseAddChargeModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error adding charge:", error);
            alert("Failed to add charge.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenPostInterestModal = () => {
        setIsPostInterestModalOpen(true);
    };

    const handleClosePostInterestModal = () => {
        setIsPostInterestModalOpen(false);
    };

    const handlePostInterest = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?command=postInterest`,
                {},
                { headers }
            );

            alert("Interest posted successfully.");
            handleClosePostInterestModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error posting interest:", error);
            alert("Failed to post interest.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenPostInterestAsOnModal = () => {
        setIsPostInterestAsOnModalOpen(true);
    };

    const handleClosePostInterestAsOnModal = () => {
        setIsPostInterestAsOnModalOpen(false);
        setPostInterestTransactionDate(new Date());
    };

    const handlePostInterestAsOn = async () => {
        if (!postInterestTransactionDate) {
            alert("Please select a transaction date.");
            return;
        }

        const payload = {
            transactionDate: postInterestTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            IsPostInterestAsOn: true,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions?command=postInterestAsOn`,
                payload,
                { headers }
            );

            alert("Interest posted successfully.");
            handleClosePostInterestAsOnModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error posting interest:", error);
            alert("Failed to post interest.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenCalculateInterestModal = () => {
        setIsCalculateInterestModalOpen(true);
    };

    const handleCloseCalculateInterestModal = () => {
        setIsCalculateInterestModalOpen(false);
    };

    const handleCalculateInterest = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?command=calculateInterest`,
                {},
                { headers }
            );

            alert("Interest calculated successfully.");
            handleCloseCalculateInterestModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error calculating interest:", error);
            alert("Failed to calculate interest.");
        } finally {
            stopLoading();
        }
    };

    const fetchHoldAmountReasons = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const codesResponse = await axios.get(`${API_CONFIG.baseURL}/codes`, { headers });
            const holdAmountCode = codesResponse.data.find(
                (code) => code.name === "SavingsAccountBlockReasons"
            );

            if (holdAmountCode) {
                const codeValuesResponse = await axios.get(
                    `${API_CONFIG.baseURL}/codes/${holdAmountCode.id}/codevalues`,
                    { headers }
                );
                setHoldAmountReasons(codeValuesResponse.data || []);
            }

            setIsHoldAmountModalOpen(true);
        } catch (error) {
            console.error("Error fetching hold amount reasons:", error);
            alert("Failed to load hold amount reasons.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenHoldAmountModal = () => {
        fetchHoldAmountReasons();
    };

    const handleCloseHoldAmountModal = () => {
        setIsHoldAmountModalOpen(false);
        setHoldAmountReason("");
        setHoldTransactionDate(new Date());
        setHoldTransactionAmount("");
    };

    const handleSubmitHoldAmount = async () => {
        if (!holdAmountReason || !holdTransactionDate || !holdTransactionAmount) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            reason: holdAmountReason,
            transactionDate: holdTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: holdTransactionAmount,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/hold-amount`,
                payload,
                { headers }
            );

            alert("Amount held successfully.");
            handleCloseHoldAmountModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error holding amount:", error);
            alert("Failed to hold amount.");
        } finally {
            stopLoading();
        }
    };

    const fetchBlockAccountReasons = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const codesResponse = await axios.get(`${API_CONFIG.baseURL}/codes`, { headers });
            const blockAccountCode = codesResponse.data.find(
                (code) => code.name === "SavingsAccountBlockReasons"
            );

            if (blockAccountCode) {
                const codeValuesResponse = await axios.get(
                    `${API_CONFIG.baseURL}/codes/${blockAccountCode.id}/codevalues`,
                    { headers }
                );
                setBlockAccountReasons(codeValuesResponse.data || []);
            }

            setIsBlockAccountModalOpen(true);
        } catch (error) {
            console.error("Error fetching block account reasons:", error);
            alert("Failed to load block account reasons.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenBlockAccountModal = () => {
        fetchBlockAccountReasons();
    };

    const handleCloseBlockAccountModal = () => {
        setIsBlockAccountModalOpen(false);
        setBlockAccountReason("");
    };

    const handleSubmitBlockAccount = async () => {
        if (!blockAccountReason) {
            alert("Please select a reason.");
            return;
        }

        const payload = {
            reason: blockAccountReason,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/block-account`,
                payload,
                { headers }
            );

            alert("Account blocked successfully.");
            handleCloseBlockAccountModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error blocking account:", error);
            alert("Failed to block account.");
        } finally {
            stopLoading();
        }
    };

    const fetchBlockWithdrawalReasons = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const codesResponse = await axios.get(`${API_CONFIG.baseURL}/codes`, { headers });
            const blockWithdrawalCode = codesResponse.data.find(
                (code) => code.name === "SavingsTransactionFreezeReasons"
            );

            if (blockWithdrawalCode) {
                const codeValuesResponse = await axios.get(
                    `${API_CONFIG.baseURL}/codes/${blockWithdrawalCode.id}/codevalues`,
                    { headers }
                );
                setBlockWithdrawalReasons(codeValuesResponse.data || []);
            }

            setIsBlockWithdrawalModalOpen(true);
        } catch (error) {
            console.error("Error fetching block withdrawal reasons:", error);
            alert("Failed to load block withdrawal reasons.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenBlockWithdrawalModal = () => {
        fetchBlockWithdrawalReasons();
    };

    const handleCloseBlockWithdrawalModal = () => {
        setIsBlockWithdrawalModalOpen(false);
        setBlockWithdrawalReason("");
    };

    const handleSubmitBlockWithdrawal = async () => {
        if (!blockWithdrawalReason) {
            alert("Please select a reason.");
            return;
        }

        const payload = {
            reason: blockWithdrawalReason,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/block-withdrawal`,
                payload,
                { headers }
            );

            alert("Withdrawal blocked successfully.");
            handleCloseBlockWithdrawalModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error blocking withdrawal:", error);
            alert("Failed to block withdrawal.");
        } finally {
            stopLoading();
        }
    };

    const handleOpenWithdrawModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions/template`,
                { headers }
            );

            const data = response.data || {};
            setWithdrawPaymentTypeOptions(data.paymentTypeOptions || []);
            setIsWithdrawModalOpen(true);
        } catch (error) {
            console.error("Error fetching withdraw data:", error);
            alert("Failed to load data for withdrawal.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseWithdrawModal = () => {
        setIsWithdrawModalOpen(false);
        setWithdrawTransactionDate(new Date());
        setWithdrawTransactionAmount(0);
        setWithdrawSelectedPaymentType("");
        setWithdrawNote("");
        setShowWithdrawPaymentDetails(false);
        setWithdrawAccountNumber("");
        setWithdrawChequeNumber("");
        setWithdrawRoutingCode("");
        setWithdrawReceiptNumber("");
        setWithdrawBankNumber("");
    };

    const handleSubmitWithdraw = async () => {
        if (!withdrawTransactionDate || !withdrawTransactionAmount || !withdrawSelectedPaymentType) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: withdrawTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: withdrawTransactionAmount,
            paymentTypeId: withdrawSelectedPaymentType,
            note: withdrawNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingWithdraw(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions?command=withdrawal`,
                payload,
                { headers }
            );

            alert("Withdrawal submitted successfully.");
            handleCloseWithdrawModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error submitting withdrawal:", error);
            alert("Failed to submit withdrawal.");
        } finally {
            setIsSubmittingWithdraw(false);
            stopLoading();
        }
    };

    const fetchBlockDepositReasons = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const codesResponse = await axios.get(`${API_CONFIG.baseURL}/codes`, { headers });
            const reasonCode = codesResponse.data.find(
                (code) => code.name === "SavingsAccountBlockReasons"
            );


            const reasonsResponse = await axios.get(
                `${API_CONFIG.baseURL}/codes/${reasonCode.id}/codevalues`,
                { headers }
            );

            setIsBlockDepositModalOpen(true);
        } catch (error) {
            console.error("Error fetching block deposit reasons:", error);
            alert("Failed to fetch block deposit reasons.");
        } finally {
            stopLoading();
        }
    };

    const handleSubmitBlockDeposit = async () => {
        if (!selectedBlockDepositReason) {
            alert("Please select a reason.");
            return;
        }

        setIsSubmittingBlockDeposit(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                locale: "en",
                reasonId: selectedBlockDepositReason,
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?command=block-deposit`,
                payload,
                { headers }
            );

            alert("Deposit block submitted successfully.");
            fetchSavingsData(); // Refresh page data
            handleCloseBlockDepositModal();
        } catch (error) {
            console.error("Error blocking deposit:", error);
            alert("Failed to block deposit.");
        } finally {
            setIsSubmittingBlockDeposit(false);
            stopLoading();
        }
    };

    const handleOpenBlockDepositModal = async () => {
        await fetchBlockDepositReasons();
    };

    const handleCloseBlockDepositModal = () => {
        setIsBlockDepositModalOpen(false);
        setSelectedBlockDepositReason("");
    };

    const handleOpenDepositModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions/template`,
                { headers }
            );

            const data = response.data || {};
            setDepositPaymentTypeOptions(data.paymentTypeOptions || []);
            setIsDepositModalOpen(true);
        } catch (error) {
            console.error("Error fetching deposit data:", error);
            alert("Failed to load data for deposit.");
        }
    };

    const handleCloseDepositModal = () => {
        setIsDepositModalOpen(false);
        setDepositTransactionDate(new Date());
        setDepositTransactionAmount("");
        setDepositSelectedPaymentType("");
        setShowDepositPaymentDetails(false);
        setDepositAccountNumber("");
        setDepositChequeNumber("");
        setDepositRoutingCode("");
        setDepositReceiptNumber("");
        setDepositBankNumber("");
        setDepositNote("");
    };

    const handleSubmitDeposit = async () => {
        if (!depositTransactionDate || !depositTransactionAmount || !depositSelectedPaymentType) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: depositTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: depositTransactionAmount,
            paymentTypeId: depositSelectedPaymentType,
            note: depositNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingDeposit(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}/transactions?command=deposit`,
                payload,
                { headers }
            );

            alert("Deposit submitted successfully.");
            handleCloseDepositModal();
            fetchSavingsData();
        } catch (error) {
            console.error("Error submitting deposit:", error);
            alert("Failed to submit deposit.");
        } finally {
            setIsSubmittingDeposit(false);
            stopLoading();
        }
    };

    const [standingInstructions, setStandingInstructions] = useState([]);

    const fetchStandingInstructions = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            const response = await axios.get(
                `${API_CONFIG.baseURL}/standinginstructions?clientId=${clientId}&clientName=${encodeURIComponent(
                    clientDetails?.displayName || ""
                )}&fromAccountId=${savingsAccountId}&fromAccountType=2&locale=en&dateFormat=dd%20MMMM%20yyyy`,
                { headers }
            );
            setStandingInstructions(response.data?.pageItems || []);
        } catch (error) {
            console.error("Error fetching standing instructions:", error);
        } finally {
            stopLoading();
        }
    };

    const handleEditInstruction = (instruction) => {
        console.log("Edit instruction", instruction);
    };

    const handleDeleteInstruction = async (instructionId) => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            await axios.delete(
                `${API_CONFIG.baseURL}/standinginstructions/${instructionId}`,
                { headers }
            );
            fetchStandingInstructions();
        } catch (error) {
            console.error("Error deleting standing instruction:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "standingInstructions") {
            fetchStandingInstructions();
        }
    }, [activeTab, savingsAccountId]);

    const fetchNotes = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            const response = await axios.get(
                `${API_CONFIG.baseURL}/savings/${savingsAccountId}/notes`,
                { headers }
            );
            setNotes(response.data || []);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            stopLoading();
        }
    };

    const handleSaveNote = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            if (editingNoteId) {
                await axios.put(
                    `${API_CONFIG.baseURL}/savings/${savingsAccountId}/notes/${editingNoteId}`,
                    { note: newNote },
                    { headers }
                );
            } else {
                await axios.post(
                    `${API_CONFIG.baseURL}/savings/${savingsAccountId}/notes`,
                    { note: newNote },
                    { headers }
                );
            }
            fetchNotes();
            setIsNotesModalOpen(false);
            setNewNote("");
            setEditingNoteId(null);
        } catch (error) {
            console.error("Error saving note:", error);
        } finally {
            stopLoading();
        }
    };

    const handleDeleteNote = async (noteId) => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            await axios.delete(
                `${API_CONFIG.baseURL}/savings/${savingsAccountId}/notes/${noteId}`,
                { headers }
            );
            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        } finally {
            stopLoading();
        }
    };

    const handleEditNote = (note) => {
        setIsNotesModalOpen(true);
        setEditingNoteId(note.id);
        setNewNote(note.note);
    };

    useEffect(() => {
        if (activeTab === "notes") {
            fetchNotes();
        }
    }, [activeTab, savingsAccountId]);

    const fetchDocuments = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            const response = await axios.get(
                `${API_CONFIG.baseURL}/savings/${savingsAccountId}/documents`,
                { headers }
            );
            setDocuments(response.data || []);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            stopLoading();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadPayload((prev) => ({ ...prev, file }));
    };

    const handleSubmitUpload = async () => {
        startLoading();
        const formData = new FormData();
        formData.append("fileName", uploadPayload.fileName);
        formData.append("description", uploadPayload.description || "");
        formData.append("file", uploadPayload.file);

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };
            await axios.post(
                `${API_CONFIG.baseURL}/savings/${savingsAccountId}/documents`,
                formData,
                { headers }
            );
            setIsUploadModalOpen(false);
            fetchDocuments();
        } catch (error) {
            console.error("Error uploading document:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "documents") {
            fetchDocuments();
        }
    }, [activeTab]);

    useEffect(() => {
        if (savingsDetails?.charges) {
            const active = savingsDetails.charges.filter((charge) => charge.isActive);
            const inactive = savingsDetails.charges.filter((charge) => !charge.isActive);
            setActiveCharges(active);
            setInactiveCharges(inactive);
        }
    }, [savingsDetails]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const filteredTransactions = transactions.filter((transaction) => {
            if (hideReversed && transaction.reversed) return false;
            if (hideAccruals && transaction.isAccrual) return false;
            return true;
        });
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setCurrentPageData(filteredTransactions.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredTransactions.length / pageSize));
    }, [hideReversed, hideAccruals, currentPage, pageSize, transactions]);

    const viewTransaction = (id) => {
        console.log("Viewing transaction with ID:", id);
    };

    const undoTransaction = async (id) => {
        startLoading();
        try {
            await axios.post(
                `${API_CONFIG.baseURL}/savingsaccounts/transactions/${id}?command=undo`,
                {},
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        "Fineract-Platform-TenantId": "default",
                        "Content-Type": "application/json",
                    },
                }
            );

        } catch (error) {
            console.error("Error undoing transaction:", error);
        } finally {
            stopLoading();
        }
    };

    const viewReceipts = (id) => {
        console.log("Viewing receipts for transaction ID:", id);
    };

    const viewJournalEntries = (id) => {
        console.log("Viewing journal entries for transaction ID:", id);
    };

    const handleToggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleSubmenuToggle = (submenu) => {
        setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
    };

    const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
            setActiveSubmenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        setAccountImage(`${process.env.PUBLIC_URL}/Images/centers.png`);
    }, []);

    useEffect(() => {
        fetchSavingsData();
    }, [savingsAccountId]);

    const fetchSavingsData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const savingsResponse = await axios.get(
                `${API_CONFIG.baseURL}/savingsaccounts/${savingsAccountId}?associations=all`,
                { headers }
            );
            setSavingsDetails(savingsResponse.data);
            setTransactions(savingsResponse.data.transactions || []);

            const clientResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}`,
                { headers }
            );
            setClientDetails(clientResponse.data);
        } catch (error) {
            console.error("Error fetching savings details:", error);
        } finally {
            stopLoading();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "general":
                return (
                    <div className="general-tab">
                        <div className="general-section">
                            <h3 className="general-section-title">Savings Details</h3>
                            <table className="general-vertical-table">
                                <tbody>
                                <tr>
                                    <td className="label">External ID</td>
                                    <td className="value">{savingsDetails?.externalId || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Activated On</td>
                                    <td className="value">
                                        {savingsDetails?.timeline?.activatedOnDate
                                            ? new Date(savingsDetails.timeline.activatedOnDate.join("-")).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Field Officer</td>
                                    <td className="value">
                                        {savingsDetails?.fieldOfficerName || "Unassigned"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Currency</td>
                                    <td className="value">{savingsDetails?.currency?.name || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Nominal Interest Rate</td>
                                    <td className="value">
                                        {savingsDetails?.nominalAnnualInterestRate
                                            ? `${savingsDetails.nominalAnnualInterestRate}%`
                                            : "N/A"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Performance History Section */}
                        <div className="general-section">
                            <h3 className="general-section-title">Performance History</h3>
                            <table className="general-vertical-table">
                                <tbody>
                                <tr>
                                    <td className="label">Total Deposits</td>
                                    <td className="value">
                                        {savingsDetails?.currency?.displaySymbol}{" "}
                                        {savingsDetails?.summary?.totalDeposits?.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) || "0.00"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Account Summary Section */}
                        <div className="general-section">
                            <h3 className="general-section-title">Account Summary</h3>
                            <table className="general-vertical-table">
                                <tbody>
                                <tr>
                                    <td className="label">Interest Earned Not Posted</td>
                                    <td className="value">
                                        {savingsDetails?.currency?.displaySymbol}{" "}
                                        {savingsDetails?.summary?.interestNotPosted?.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) || "0.00"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Interest Compounding Period</td>
                                    <td className="value">{savingsDetails?.interestCompoundingPeriodType?.value || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Interest Posting Period</td>
                                    <td className="value">{savingsDetails?.interestPostingPeriodType?.value || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Interest Calculated Using</td>
                                    <td className="value">{savingsDetails?.interestCalculationType?.value || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Days in Year</td>
                                    <td className="value">{savingsDetails?.interestCalculationDaysInYearType?.value || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Last Active Transaction Date</td>
                                    <td className="value">
                                        {savingsDetails?.lastActiveTransactionDate
                                            ? new Date(savingsDetails.lastActiveTransactionDate.join("-")).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Days to Inactive</td>
                                    <td className="value">{savingsDetails?.daysToInactive || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Days to Dormancy</td>
                                    <td className="value">{savingsDetails?.daysToDormancy || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Days to Escheat</td>
                                    <td className="value">{savingsDetails?.daysToEscheat || "N/A"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Overdraft Limit</td>
                                    <td className="value">
                                        {savingsDetails?.currency?.displaySymbol}{" "}
                                        {savingsDetails?.overdraftLimit?.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) || "0.00"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Minimum Overdraft Required for Interest Calculation</td>
                                    <td className="value">
                                        {savingsDetails?.currency?.displaySymbol}{" "}
                                        {savingsDetails?.minRequiredOverdraftForInterestCalculation?.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }) || "0.00"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "transactions":
                return (
                    <div className="tab-content">
                        {/* Toggle Buttons and Export */}
                        <div className="transactions-header">
                            <div className="actions">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="toggle-button"
                                        onChange={(e) => setHideReversed(e.target.checked)}
                                    />
                                    Hide Reversed
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="toggle-button"
                                        onChange={(e) => setHideAccruals(e.target.checked)}
                                    />
                                    Hide Accruals
                                </label>
                                <button className="export-btn">Export</button>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="pageSize" className="filter-label">
                                    Rows per page:
                                </label>
                                <select
                                    id="pageSize"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(parseInt(e.target.value, 10));
                                        setCurrentPage(1);
                                    }}
                                    className="filter-dropdown"
                                >
                                    <option value={1}>1</option>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                        {/* Transactions Table */}
                        <table className="transactions-table">
                            <thead>
                            <tr>
                            <th>#</th>
                                <th>ID</th>
                                <th>Transaction Date</th>
                                <th>External Id</th>
                                <th>Transaction Type</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPageData.map((transaction, index) => (
                                <tr key={transaction.id}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{transaction.id}</td>
                                    <td>
                                        {transaction.date
                                            ? new Date(transaction.date.join("-")).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : "N/A"}
                                    </td>
                                    <td>{transaction.externalId || "N/A"}</td>
                                    <td>{transaction.transactionType?.value || "N/A"}</td>
                                    <td>
                                        {transaction.entryType === "DEBIT"
                                            ? `${transaction.currency?.displaySymbol || ""} ${transaction.amount.toLocaleString(
                                                undefined,
                                                {minimumFractionDigits: 2}
                                            )}`
                                            : "N/A"}
                                    </td>
                                    <td>
                                        {transaction.entryType === "CREDIT"
                                            ? `${transaction.currency?.displaySymbol || ""} ${transaction.amount.toLocaleString(
                                                undefined,
                                                {minimumFractionDigits: 2}
                                            )}`
                                            : "N/A"}
                                    </td>
                                    <td>{`${transaction.currency?.displaySymbol || ""} ${transaction.runningBalance.toLocaleString(
                                        undefined,
                                        {minimumFractionDigits: 2}
                                    )}`}</td>
                                    <td>
                                        <div className="actions-dropdown">
                                            <div className="dropdown-btn">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <div className="dropdown-menu">
                                                <button onClick={() => viewTransaction(transaction.id)}>View
                                                    Transaction
                                                </button>
                                                <button onClick={() => undoTransaction(transaction.id)}>Undo
                                                    Transaction
                                                </button>
                                                <button onClick={() => viewReceipts(transaction.id)}>View Receipts
                                                </button>
                                                <button onClick={() => viewJournalEntries(transaction.id)}>View Journal
                                                    Entries
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-button"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                >
                                    Start
                                </button>
                                <button
                                    className="pagination-button"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    className="pagination-button"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                                <button
                                    className="pagination-button"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    End
                                </button>
                            </div>
                        )}
                    </div>
                );
            case "charges":
                return (
                    <div className="tab-content">
                        <div className="pause-button-tags">
                            <button
                                className="pause-delinquency-btn"
                                onClick={() => setShowInactiveCharges((prev) => !prev)}
                            >
                                {showInactiveCharges ? "View Active Charges" : "View Inactive Charges"}
                            </button>
                        </div>
                        <table className="delinquency-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Charge Type</th>
                                <th>Payment Due At</th>
                                <th>Due As Of</th>
                                <th>Repeats On (M/d)</th>
                                <th>Calculation Type</th>
                                <th>Due</th>
                                <th>Paid</th>
                                <th>Waived</th>
                                <th>Outstanding</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(showInactiveCharges ? inactiveCharges : activeCharges).map((charge) => (
                                <tr key={charge.id}>
                                    <td>{charge.name}</td>
                                    <td>{charge.penalty ? "Penalty" : "Fee"}</td>
                                    <td>{charge.chargeTimeType?.value || ""}</td>
                                    <td>
                                        {charge.dueAsOf
                                            ? new Date(charge.dueAsOf).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })
                                            : ""}
                                    </td>
                                    <td>
                                        {charge.repeatsOn
                                            ? `${charge.repeatsOn.month || ""}/${charge.repeatsOn.day || ""}`
                                            : ""}
                                    </td>
                                    <td>{charge.chargeCalculationType?.value || ""}</td>
                                    <td>
                                        {`${charge.currency?.displaySymbol || ""} ${charge.amount.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}`}
                                    </td>
                                    <td>
                                        {`${charge.currency?.displaySymbol || ""} ${charge.amountPaid.toLocaleString(
                                            undefined,
                                            {minimumFractionDigits: 2}
                                        )}`}
                                    </td>
                                    <td>
                                        {`${charge.currency?.displaySymbol || ""} ${charge.amountWaived.toLocaleString(
                                            undefined,
                                            {minimumFractionDigits: 2}
                                        )}`}
                                    </td>
                                    <td>
                                        {`${charge.currency?.displaySymbol || ""} ${charge.amountOutstanding.toLocaleString(
                                            undefined,
                                            {minimumFractionDigits: 2}
                                        )}`}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            case "documents":
                return (
                    <div className="tab-content">
                        <div className="pause-button-tags">
                            <button
                                className="pause-delinquency-btn"
                                onClick={() => setIsUploadModalOpen(true)}
                            >
                                Add
                            </button>
                        </div>

                        {documents.length > 0 ? (
                            <table className="delinquency-table">
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
                                        <td>{doc.description || ""}</td>
                                        <td>{doc.fileName}</td>
                                        <td>
                                            <button
                                                className="charges-action-button"
                                                // onClick={() => window.open(doc.fileLocation, "_blank")}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className={'no-data'}>No documents available.</p>
                        )}

                        {isUploadModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Upload Document</h4>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="fileName" className="create-provisioning-criteria-label">
                                            File Name <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fileName"
                                            value={uploadPayload.fileName}
                                            onChange={(e) =>
                                                setUploadPayload((prev) => ({
                                                    ...prev,
                                                    fileName: e.target.value,
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
                                        <textarea
                                            id="description"
                                            value={uploadPayload.description}
                                            onChange={(e) =>
                                                setUploadPayload((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>

                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="file" className="create-provisioning-criteria-label">
                                            Select File <span>*</span>
                                        </label>
                                        <input
                                            type="file"
                                            id="file"
                                            onChange={handleFileChange}
                                            className="create-provisioning-criteria-input"
                                            required
                                        />
                                    </div>

                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            className="create-provisioning-criteria-cancel"
                                            onClick={() => setIsUploadModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="create-provisioning-criteria-confirm"
                                            onClick={handleSubmitUpload}
                                            disabled={!uploadPayload.fileName || !uploadPayload.file}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "notes":
                return (
                    <div className="tab-content">
                        {/* Add Note Button */}
                        <div className="general-section-header">
                            <button
                                className="create-provisioning-criteria-submit"
                                onClick={() => {
                                    setIsNotesModalOpen(true);
                                    setEditingNoteId(null);
                                    setNewNote("");
                                }}
                            >
                                Add Note
                            </button>
                        </div>

                        {/* Notes List */}
                        {notes.length > 0 ? (
                            <div className="notes-list">
                                {notes.map((note) => (
                                    <div key={note.id} className="note-item">
                                        <div className="note-icon">
                                            <FaStickyNote />
                                        </div>
                                        <div className="note-content">
                                            <p>{note.note}</p>
                                            <small>
                                                Created By: {note.createdBy || "Unknown"} |{" "}
                                                {new Date(note.createdOn).toLocaleDateString(undefined, {
                                                    dateStyle: "long",
                                                })}
                                            </small>
                                        </div>
                                        <div className="note-actions">
                                            <button
                                                className="note-general-action-button"
                                                onClick={() => handleEditNote(note)}
                                            >
                                                <FaEdit color={"#56bc23"} size={20} />
                                            </button>
                                            <button
                                                className="note-general-action-button"
                                                onClick={() => handleDeleteNote(note.id)}
                                            >
                                                <FaTrash color={"#e13a3a"} size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-data">No notes available</p>
                        )}

                        {/* Modal for Add/Edit Note */}
                        {isNotesModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">
                                        {editingNoteId ? "Edit Note" : "Add Note"}
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
                                            onClick={() => {
                                                setIsNotesModalOpen(false);
                                                setEditingNoteId(null);
                                                setNewNote("");
                                            }}
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
            case "standingInstructions":
                return (
                    <div className="tab-content">
                        {standingInstructions.length > 0 ? (
                            <table className="delinquency-table">
                                <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>From Account</th>
                                    <th>Beneficiary</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                    <th>Validity</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {standingInstructions.map((instruction, index) => (
                                    <tr key={index}>
                                        <td>{instruction.clientName || "N/A"}</td>
                                        <td>{instruction.fromAccountId || "N/A"}</td>
                                        <td>{instruction.beneficiaryName || "N/A"}</td>
                                        <td>{instruction.toAccountId || "N/A"}</td>
                                        <td>
                                            {instruction.amount
                                                ? `${instruction.currency?.displaySymbol || ""} ${instruction.amount.toLocaleString()}`
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {instruction.validityStartDate && instruction.validityEndDate
                                                ? `${new Date(instruction.validityStartDate).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )} - ${new Date(instruction.validityEndDate).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}`
                                                : "N/A"}
                                        </td>
                                        <td>
                                            <button
                                                className="charges-action-button adjust-charge"
                                                onClick={() => handleEditInstruction(instruction)}
                                            >
                                                <FaEdit className="charges-action-icon" />
                                            </button>
                                            <button
                                                className="charges-action-button waive-charge"
                                                onClick={() => handleDeleteInstruction(instruction.id)}
                                            >
                                                <FaTrash className="charges-action-icon" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No standing instructions available</p>
                        )}
                    </div>
                );
            default:
                return <div>Content Not Found</div>;
        }
    };

    const checkScrollButtons = () => {
        const container = tabsContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft + container.clientWidth < container.scrollWidth
            );
        }
    };

    const scrollTabs = (direction) => {
        const container = tabsContainerRef.current;
        const scrollAmount = 150;
        if (container) {
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const container = tabsContainerRef.current;
        checkScrollButtons();
        if (container) {
            container.addEventListener("scroll", checkScrollButtons);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", checkScrollButtons);
            }
        };
    }, []);

    const handleBreadcrumbNavigation = () => {
        navigate("/clients", {
            state: {
                clientId: clientId,
                clientName: clientDetails?.displayName || "Client Details",
                preventDuplicate: true,
            },
        });
    };

    return (
        <div className="users-page-screen">
            <h2 className="users-page-head">
                <Link to="/clients" className="breadcrumb-link">Clients</Link>{' '}
                <span
                    className="breadcrumb-link"
                    onClick={handleBreadcrumbNavigation}
                >
                    . {' '} {clientDetails?.displayName || "Savings Account"}
                </span>{' '}
                . Savings Account
            </h2>
            <div className="client-details-header">
                <div className="client-image-section">
                    <img
                        src={accountImage}
                        alt="Client"
                        className="client-image"
                    />
                </div>

                <div className="client-info-section">
                    <ul className="client-info-list">
                        <li>
                            <span className="client-info-label">Savings Product:</span>
                            <span className="client-info-value">
                                {savingsDetails?.savingsProductName || "N/A"} ({savingsDetails?.accountNo})
                            </span>
                        </li>
                        <li>
                            <span className="client-info-label">Status:</span>
                            <span className="client-info-value">
                                {savingsDetails?.status?.value || "Unknown"}
                            </span>
                        </li>
                        <li>
                            <span className="client-info-label">Client Name:</span>
                            <span className="client-info-value">
                                {savingsDetails?.clientName || "N/A"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="client-info-section">
                    <ul className="client-info-list">
                        <li>
                            <span className="client-info-label">Current Balance:</span>
                            <span className="client-info-value">
                                {savingsDetails?.currency?.displaySymbol} {savingsDetails?.summary?.accountBalance || "0.00"}
                            </span>
                        </li>
                        <li>
                            <span className="client-info-label">Available Balance:</span>
                            <span className="client-info-value">
                                {savingsDetails?.currency?.displaySymbol} {savingsDetails?.summary?.availableBalance || "0.00"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="actions-dropdown" ref={dropdownRef}>
                    <button className="actions-dropdown-toggle" onClick={handleToggleDropdown}>
                        Actions
                    </button>
                    {isDropdownOpen && (
                        <div className="actions-dropdown-menu">
                            <button className="dropdown-item" onClick={handleOpenDepositModal}>
                                Deposit
                            </button>
                            <button className="dropdown-item" onClick={handleOpenBlockDepositModal}>
                                Block Deposit
                            </button>
                            <button className="dropdown-item" onClick={handleOpenWithdrawModal}>
                                Withdraw
                            </button>
                            <button className="dropdown-item" onClick={handleOpenBlockWithdrawalModal}>
                                Block Withdrawal
                            </button>
                            <button className="dropdown-item" onClick={handleOpenBlockAccountModal}>
                                Block Account
                            </button>
                            <button className="dropdown-item" onClick={handleOpenHoldAmountModal}>
                                Hold Amount
                            </button>
                            <button className="dropdown-item" onClick={handleOpenCalculateInterestModal}>
                                Calculate Interest
                            </button>
                            <button className="dropdown-item" onClick={handleOpenPostInterestAsOnModal}>
                                Post Interest As On
                            </button>
                            <div className="dropdown-submenu">
                                <button
                                    className="dropdown-item submenu-toggle"
                                    onClick={() => handleSubmenuToggle("more")}
                                >
                                    More <FaCaretRight className="submenu-icon"/>
                                </button>
                                {activeSubmenu === "more" && (
                                    <div className="submenu-content">
                                        <button className="dropdown-item" onClick={handleOpenPostInterestModal}>
                                            Post Interest
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenAddChargeModal}>
                                            Add Charge
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenCloseModal}>
                                            Close
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenTransferFundsModal}>
                                            Transfer Funds
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenAssignStaffModal}>
                                            Assign Staff
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="loan-tabs-container-wrapper">
                {canScrollLeft && (
                    <button
                        className="scroll-button scroll-left"
                        onClick={() => scrollTabs("left")}
                    >
                        <FaCaretLeft />
                    </button>
                )}
                <div className="client-details-tabs" ref={tabsContainerRef}>
                    {[
                        "general",
                        "transactions",
                        "charges",
                        "documents",
                        "notes",
                        "standingInstructions",
                    ].map((tab) => (
                        <button
                            key={tab}
                            className={`loan-tab-button ${activeTab === tab ? "active" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </button>
                    ))}
                </div>
                {canScrollRight && (
                    <button
                        className="scroll-button scroll-right"
                        onClick={() => scrollTabs("right")}
                    >
                        <FaCaretRight />
                    </button>
                )}
            </div>

            <div className="client-tab-content">{renderTabContent()}</div>

            {isDepositModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Deposit Money to Savings Account</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="transactionDate"
                                selected={depositTransactionDate}
                                onChange={(date) => setDepositTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="transactionAmount"
                                value={depositTransactionAmount}
                                onChange={(e) => setDepositTransactionAmount(e.target.value)}
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
                                value={depositSelectedPaymentType}
                                onChange={(e) => setDepositSelectedPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {depositPaymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Toggle Payment Details */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showPaymentDetails"
                                        checked={showDepositPaymentDetails}
                                        onChange={(e) => setShowDepositPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details Fields */}
                        {showDepositPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={depositAccountNumber}
                                        onChange={(e) => setDepositAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
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
                                        placeholder="Receipt #"
                                        value={depositReceiptNumber}
                                        onChange={(e) => setDepositReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={depositBankNumber}
                                        onChange={(e) => setDepositBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="note" className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={depositNote}
                                onChange={(e) => setDepositNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseDepositModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitDeposit}
                                disabled={!depositTransactionDate || !depositTransactionAmount || !depositSelectedPaymentType}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isBlockDepositModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Block Deposit</h4>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="blockDepositReason" className="create-provisioning-criteria-label">
                                Reason <span>*</span>
                            </label>
                            <select
                                id="blockDepositReason"
                                value={selectedBlockDepositReason}
                                onChange={(e) => setSelectedBlockDepositReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Reason</option>
                                {blockDepositReasonOptions.map((reason) => (
                                    <option key={reason.id} value={reason.id}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseBlockDepositModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitBlockDeposit}
                                className="create-provisioning-criteria-confirm"
                                disabled={!selectedBlockDepositReason || isSubmittingBlockDeposit}
                            >
                                {isSubmittingBlockDeposit ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isWithdrawModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Withdraw Money</h4>

                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="withdrawTransactionDate"
                                selected={withdrawTransactionDate}
                                onChange={(date) => setWithdrawTransactionDate(date)}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

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

                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="withdrawPaymentType"
                                value={withdrawSelectedPaymentType}
                                onChange={(e) => setWithdrawSelectedPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {withdrawPaymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">Show Payment Details</label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={showWithdrawPaymentDetails}
                                        onChange={(e) => setShowWithdrawPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {showWithdrawPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={withdrawAccountNumber}
                                        onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
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
                                        placeholder="Receipt #"
                                        value={withdrawReceiptNumber}
                                        onChange={(e) => setWithdrawReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={withdrawBankNumber}
                                        onChange={(e) => setWithdrawBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="withdrawNote" className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                id="withdrawNote"
                                value={withdrawNote}
                                onChange={(e) => setWithdrawNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button onClick={handleCloseWithdrawModal} className="create-provisioning-criteria-cancel">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitWithdraw}
                                className="create-provisioning-criteria-confirm"
                                disabled={!withdrawTransactionDate || !withdrawTransactionAmount || !withdrawSelectedPaymentType}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isBlockWithdrawalModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Block Withdrawal</h4>

                        {/* Reason Dropdown */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="blockWithdrawalReason" className="create-provisioning-criteria-label">
                                Reason <span>*</span>
                            </label>
                            <select
                                id="blockWithdrawalReason"
                                value={blockWithdrawalReason}
                                onChange={(e) => setBlockWithdrawalReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select a reason</option>
                                {blockWithdrawalReasons.map((reason) => (
                                    <option key={reason.id} value={reason.name}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseBlockWithdrawalModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitBlockWithdrawal}
                                className="create-provisioning-criteria-confirm"
                                disabled={!blockWithdrawalReason}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isBlockAccountModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Block Account</h4>

                        {/* Reason Dropdown */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="blockAccountReason" className="create-provisioning-criteria-label">
                                Reason <span>*</span>
                            </label>
                            <select
                                id="blockAccountReason"
                                value={blockAccountReason}
                                onChange={(e) => setBlockAccountReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select a reason</option>
                                {blockAccountReasons.map((reason) => (
                                    <option key={reason.id} value={reason.name}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseBlockAccountModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitBlockAccount}
                                className="create-provisioning-criteria-confirm"
                                disabled={!blockAccountReason}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isHoldAmountModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Hold Amount</h4>

                        {/* Reason Dropdown */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="holdAmountReason" className="create-provisioning-criteria-label">
                                Reason <span>*</span>
                            </label>
                            <select
                                id="holdAmountReason"
                                value={holdAmountReason}
                                onChange={(e) => setHoldAmountReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select a reason</option>
                                {holdAmountReasons.map((reason) => (
                                    <option key={reason.id} value={reason.name}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="holdTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="holdTransactionDate"
                                selected={holdTransactionDate}
                                onChange={(date) => setHoldTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="holdTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="holdTransactionAmount"
                                value={holdTransactionAmount}
                                onChange={(e) => setHoldTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseHoldAmountModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitHoldAmount}
                                className="create-provisioning-criteria-confirm"
                                disabled={!holdAmountReason || !holdTransactionDate || !holdTransactionAmount}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCalculateInterestModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Calculate Interest</h4>
                        <p className="create-provisioning-criteria-label">Are you sure you want to calculate interest?</p>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseCalculateInterestModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCalculateInterest}
                                className="create-provisioning-criteria-confirm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPostInterestAsOnModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Post Interest As On</h4>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="transactionDate"
                                selected={postInterestTransactionDate}
                                onChange={(date) => setPostInterestTransactionDate(date)}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleClosePostInterestAsOnModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostInterestAsOn}
                                className="create-provisioning-criteria-confirm"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPostInterestModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Post Interest</h4>
                        <p>Are you sure you want to post interest?</p>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleClosePostInterestModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostInterest}
                                className="create-provisioning-criteria-confirm"
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

                        {/* Charge Dropdown */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="charge" className="create-provisioning-criteria-label">
                                Charge <span>*</span>
                            </label>
                            <select
                                id="charge"
                                value={selectedCharge?.id || ""}
                                onChange={(e) => {
                                    const selected = chargeOptions.find(
                                        (option) => option.id === parseInt(e.target.value, 10)
                                    );
                                    setSelectedCharge(selected || null);
                                    setChargeAmount(selected?.amount || "");
                                }}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Charge</option>
                                {chargeOptions.map((charge) => (
                                    <option key={charge.id} value={charge.id}>
                                        {charge.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amount Field */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="amount" className="create-provisioning-criteria-label">
                                Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="amount"
                                value={chargeAmount}
                                onChange={(e) => setChargeAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* Charge Calculation Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="calculationType" className="create-provisioning-criteria-label">
                                Charge Calculation
                            </label>
                            <input
                                type="text"
                                id="calculationType"
                                value={selectedCharge?.chargeCalculationType?.value || ""}
                                className="create-provisioning-criteria-input"
                                disabled
                            />
                        </div>

                        {/* Charge Time Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="timeType" className="create-provisioning-criteria-label">
                                Charge Time Type
                            </label>
                            <input
                                type="text"
                                id="timeType"
                                value={selectedCharge?.chargeTimeType?.value || ""}
                                className="create-provisioning-criteria-input"
                                disabled
                            />
                        </div>

                        {/* Due Date Field */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="dueDate" className="create-provisioning-criteria-label">
                                Due for Collection On <span>*</span>
                            </label>
                            <DatePicker
                                id="dueDate"
                                selected={dueDate}
                                onChange={(date) => setDueDate(date)}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseAddChargeModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAddCharge}
                                className="create-provisioning-criteria-confirm"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCloseModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Close Account</h4>

                        {/* Closed On Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionDate" className="create-provisioning-criteria-label">
                                Closed On Date <span>*</span>
                            </label>
                            <DatePicker
                                id="transactionDate"
                                selected={closeTransactionDate}
                                onChange={(date) => setCloseTransactionDate(date)}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="create-provisioning-criteria-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isWithdrawBalance}
                                    onChange={(e) => setIsWithdrawBalance(e.target.checked)}
                                />
                                Withdraw Balance
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isInterestPostingRequired}
                                    onChange={(e) => setIsInterestPostingRequired(e.target.checked)}
                                />
                                Is Interest Posting Required on Closure Date?
                            </label>
                        </div>

                        {/* Withdraw Balance Fields */}
                        {isWithdrawBalance && (
                            <>
                                <div className="create-provisioning-criteria-group">
                                    <label htmlFor="transactionAmount" className="create-provisioning-criteria-label">
                                        Transaction Amount
                                    </label>
                                    <input
                                        type="number"
                                        id="transactionAmount"
                                        value={closeTransactionAmount}
                                        className="create-provisioning-criteria-input"
                                        disabled
                                    />
                                </div>

                                <div className="create-provisioning-criteria-group">
                                    <label htmlFor="paymentType" className="create-provisioning-criteria-label">
                                        Payment Type <span>*</span>
                                    </label>
                                    <select
                                        id="paymentType"
                                        value={closeSelectedPaymentType}
                                        onChange={(e) => setCloseSelectedPaymentType(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    >
                                        <option value="">Select Payment Type</option>
                                        {closePaymentTypeOptions.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="create-provisioning-criteria-group">
                                    <label>Show Payment Details</label>
                                    <input
                                        type="checkbox"
                                        checked={showClosePaymentDetails}
                                        onChange={(e) => setShowClosePaymentDetails(e.target.checked)}
                                    />
                                </div>

                                {showClosePaymentDetails && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Account #"
                                            value={closeAccountNumber}
                                            onChange={(e) => setCloseAccountNumber(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Cheque #"
                                            value={closeChequeNumber}
                                            onChange={(e) => setCloseChequeNumber(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Routing Code"
                                            value={closeRoutingCode}
                                            onChange={(e) => setCloseRoutingCode(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Receipt #"
                                            value={closeReceiptNumber}
                                            onChange={(e) => setCloseReceiptNumber(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Bank #"
                                            value={closeBankNumber}
                                            onChange={(e) => setCloseBankNumber(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="note" className="create-provisioning-criteria-label">Note</label>
                            <textarea
                                id="note"
                                value={closeNote}
                                onChange={(e) => setCloseNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseCloseModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitClose}
                                className="create-provisioning-criteria-confirm"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isTransferFundsModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Transfer Funds</h4>

                        {/* Transferring From Details */}
                        <h5>Transferring From Details</h5>
                        <table className="vertical-table">
                            <tbody>
                            <tr>
                                <td>Applicant</td>
                                <td>{transferApplicant}</td>
                            </tr>
                            <tr>
                                <td>Office</td>
                                <td>{transferOffice}</td>
                            </tr>
                            <tr>
                                <td>From Account</td>
                                <td>{transferFromAccount}</td>
                            </tr>
                            <tr>
                                <td>From Account Type</td>
                                <td>{transferFromAccountType}</td>
                            </tr>
                            <tr>
                                <td>Currency</td>
                                <td>{transferCurrency}</td>
                            </tr>
                            </tbody>
                        </table>

                        {/* Transfer To Details */}
                        <h5>Transfer To</h5>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transactionDate" className="create-provisioning-criteria-label">Transaction Date <span>*</span></label>
                            <DatePicker
                                id="transactionDate"
                                selected={transferTransactionDate}
                                onChange={(date) => setTransferTransactionDate(date)}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="toOffice" className="create-provisioning-criteria-label">Office <span>*</span></label>
                            <select
                                id="toOffice"
                                value={transferToOffice}
                                onChange={(e) => setTransferToOffice(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Office</option>
                                {transferToOfficeOptions.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="toClient" className="create-provisioning-criteria-label">Client <span>*</span></label>
                            <select
                                id="toClient"
                                value={transferToClient}
                                onChange={(e) => setTransferToClient(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Client</option>
                                {transferToClientOptions.map((client) => (
                                    <option key={client.id} value={client.id}>{client.displayName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="toAccountType" className="create-provisioning-criteria-label">Account Type <span>*</span></label>
                            <select
                                id="toAccountType"
                                value={transferToAccountType}
                                onChange={(e) => setTransferToAccountType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Account Type</option>
                                {transferToAccountTypeOptions.map((type) => (
                                    <option key={type.id} value={type.id}>{type.value}</option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="toAccount" className="create-provisioning-criteria-label">Account <span>*</span></label>
                            <select
                                id="toAccount"
                                value={transferToAccount}
                                onChange={(e) => setTransferToAccount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Account</option>
                                {transferToAccountOptions.map((account) => (
                                    <option key={account.id} value={account.id}>{account.accountNo}</option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="transferAmount" className="create-provisioning-criteria-label">Amount <span>*</span></label>
                            <input
                                type="number"
                                id="transferAmount"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="description" className="create-provisioning-criteria-label">Description <span>*</span></label>
                            <textarea
                                id="description"
                                value={transferDescription}
                                onChange={(e) => setTransferDescription(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button onClick={handleCloseTransferFundsModal} className="create-provisioning-criteria-cancel">
                                Cancel
                            </button>
                            <button onClick={handleSubmitTransferFunds} className="create-provisioning-criteria-confirm">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isAssignStaffModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Assign Staff</h4>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="toStaff" className="create-provisioning-criteria-label">To Savings Officer <span>*</span></label>
                            <select
                                id="toStaff"
                                value={assignToStaff}
                                onChange={(e) => setAssignToStaff(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Officer</option>
                                {assignStaffOptions.map((officer) => (
                                    <option key={officer.id} value={officer.id}>
                                        {officer.displayName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="assignmentDate" className="create-provisioning-criteria-label">Assignment Date <span>*</span></label>
                            <DatePicker
                                id="assignmentDate"
                                selected={assignmentDate}
                                onChange={(date) => setAssignmentDate(date)}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseAssignStaffModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAssignStaff}
                                className="create-provisioning-criteria-confirm"
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

export default SavingsAccounts;
