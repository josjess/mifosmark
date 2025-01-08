import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../../../context/AuthContext";
import {useLoading} from "../../../../context/LoadingContext";
import {API_CONFIG} from "../../../../config";
import './LoanDetails.css'
import {FaCaretLeft, FaCaretRight, FaEdit, FaExclamationTriangle, FaStickyNote, FaTrash} from "react-icons/fa";
import DatePicker from "react-datepicker";
import {FaToolbox} from "react-icons/fa6";

const LoanDetails = () => {
    const { clientId, loanId } = useParams();
    const { state } = useLocation();
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const [loanDetails, setLoanDetails] = useState(null);
    const [clientDetails, setClientDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("general");
    const [loanImage, setLoanImage] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const dropdownRef = useRef(null);

    const tabsContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [hideReversed, setHideReversed] = useState(false);
    const [hideAccruals, setHideAccruals] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const currentPageData = loanDetails?.transactions
        ?.filter((transaction) =>
            (!hideReversed || !transaction.manuallyReversed) &&
            (!hideAccruals || !transaction.type.accrual)
        )
        ?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        const filteredTransactions = loanDetails?.transactions?.filter(
            (transaction) =>
                (!hideReversed || !transaction.manuallyReversed) &&
                (!hideAccruals || !transaction.type.accrual)
        );
        setTotalPages(Math.ceil(filteredTransactions?.length / pageSize));
        setCurrentPage(1);
    }, [loanDetails, hideReversed, hideAccruals, pageSize]);

    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1)); // Navigate to the previous page
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)); // Navigate to the next page
    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const [delinquencyActions, setDelinquencyActions] = useState([]);
    const [delinquencyTags, setDelinquencyTags] = useState([]);
    const [isDelinquencyModalOpen, setIsDelinquencyModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(null);

    const [collaterals, setCollaterals] = useState([]);
    const [isCollateralModalOpen, setIsCollateralModalOpen] = useState(false);
    const [collateralTemplate, setCollateralTemplate] = useState([]);
    const [collateralType, setCollateralType] = useState("");
    const [collateralValue, setCollateralValue] = useState("");
    const [collateralDescription, setCollateralDescription] = useState("");

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [isWaiveConfirmationOpen, setIsWaiveConfirmationOpen] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState(null);
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [adjustmentPayload, setAdjustmentPayload] = useState({
        amount: "",
        externalId: "",
        paymentTypeId: "",
        note: "",
        accountNumber: "",
        chequeNumber: "",
        routingCode: "",
        receiptNumber: "",
        bankNumber: "",
    });

    const [loanReschedules, setLoanReschedules] = useState([]);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [rescheduleFromDate, setRescheduleFromDate] = useState(null);
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [submittedOnDate, setSubmittedOnDate] = useState(null);
    const [rescheduleComments, setRescheduleComments] = useState("");
    const [rescheduleReasons, setRescheduleReasons] = useState([]);
    const [showRepaymentDateField, setShowRepaymentDateField] = useState(false);
    const [installmentRescheduledTo, setInstallmentRescheduledTo] = useState(null);
    const [showGracePeriods, setShowGracePeriods] = useState(false);
    const [principalGracePeriods, setPrincipalGracePeriods] = useState(0);
    const [interestGracePeriods, setInterestGracePeriods] = useState(0);
    const [showExtendRepayment, setShowExtendRepayment] = useState(false);
    const [newRepayments, setNewRepayments] = useState(0);
    const [showAdjustInterestRates, setShowAdjustInterestRates] = useState(false);
    const [newInterestRate, setNewInterestRate] = useState("");

    const [chargeAccrual, setChargeAccrual] = useState(null);

    const [loanDocuments, setLoanDocuments] = useState([]);
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

    const [standingInstructions, setStandingInstructions] = useState([]);

    const [transfers, setTransfers] = useState([]);
    const [activeTransfer, setActiveTransfer] = useState(null);
    const [isSellLoanModalOpen, setIsSellLoanModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [sellLoanPayload, setSellLoanPayload] = useState({
        settlementDate: null,
        purchasePriceRatio: "",
        ownerExternalId: "",
        transferExternalId: "",
    });

    const [isAddChargeModalOpen, setIsAddChargeModalOpen] = useState(false);
    const [chargeOptions, setChargeOptions] = useState([]);
    const [formData, setFormData] = useState({
        chargeId: "",
        amount: "",
        dueDate: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isForeclosureModalOpen, setIsForeclosureModalOpen] = useState(false);
    const [foreclosureData, setForeclosureData] = useState(null);
    const [foreclosureForm, setForeclosureForm] = useState({
        transactionDate: new Date(),
        note: "",
    });
    const [isSubmittingForeclosure, setIsSubmittingForeclosure] = useState(false);

    const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
    const [repaymentData, setRepaymentData] = useState(null);
    const [repaymentForm, setRepaymentForm] = useState({
        transactionDate: new Date(),
        transactionAmount: "",
        externalId: "",
        selectedPaymentType: "",
        accountNumber: "",
        chequeNumber: "",
        routingCode: "",
        receiptNumber: "",
        bankNumber: "",
        note: "",
        showPaymentDetails: false,
    });
    const [isSubmittingRepayment, setIsSubmittingRepayment] = useState(false);

    const [isUndoDisbursalModalOpen, setIsUndoDisbursalModalOpen] = useState(false);
    const [undoDisbursalNote, setUndoDisbursalNote] = useState("");
    const [isSubmittingUndoDisbursal, setIsSubmittingUndoDisbursal] = useState(false);

    const [isPrepayLoanModalOpen, setIsPrepayLoanModalOpen] = useState(false);
    const [prepayLoanData, setPrepayLoanData] = useState({});
    const [prepayLoanDate, setPrepayLoanDate] = useState(new Date());
    const [prepayTransactionAmount, setPrepayTransactionAmount] = useState("");
    const [prepayPaymentType, setPrepayPaymentType] = useState("");
    const [prepayExternalId, setPrepayExternalId] = useState("");
    const [showPrepayPaymentDetails, setShowPrepayPaymentDetails] = useState(false);
    const [prepayAccount, setPrepayAccount] = useState("");
    const [prepayCheque, setPrepayCheque] = useState("");
    const [prepayRoutingCode, setPrepayRoutingCode] = useState("");
    const [prepayReceipt, setPrepayReceipt] = useState("");
    const [prepayBank, setPrepayBank] = useState("");
    const [prepayNote, setPrepayNote] = useState("");
    const [isSubmittingPrepayLoan, setIsSubmittingPrepayLoan] = useState(false);

    const [isChargeOffModalOpen, setIsChargeOffModalOpen] = useState(false);
    const [chargeOffData, setChargeOffData] = useState({});
    const [chargeOffDate, setChargeOffDate] = useState(new Date());
    const [chargeOffReason, setChargeOffReason] = useState("");
    const [chargeOffExternalId, setChargeOffExternalId] = useState("");
    const [chargeOffNote, setChargeOffNote] = useState("");
    const [isSubmittingChargeOff, setIsSubmittingChargeOff] = useState(false);

    const [isReAgeModalOpen, setIsReAgeModalOpen] = useState(false);
    const [reAgeInstallments, setReAgeInstallments] = useState("");
    const [reAgeFrequencyNumber, setReAgeFrequencyNumber] = useState("");
    const [reAgeFrequencyType, setReAgeFrequencyType] = useState("");
    const [reAgeStartDate, setReAgeStartDate] = useState(new Date());
    const [reAgeReason, setReAgeReason] = useState("");
    const [reAgeExternalId, setReAgeExternalId] = useState("");
    const [isSubmittingReAge, setIsSubmittingReAge] = useState(false);

    const [isReAmortizeModalOpen, setIsReAmortizeModalOpen] = useState(false);
    const [reAmortizeReason, setReAmortizeReason] = useState("");
    const [reAmortizeExternalId, setReAmortizeExternalId] = useState("");
    const [isSubmittingReAmortize, setIsSubmittingReAmortize] = useState(false);

    const [isGoodwillCreditModalOpen, setIsGoodwillCreditModalOpen] = useState(false);
    const [goodwillTransactionDate, setGoodwillTransactionDate] = useState(new Date());
    const [goodwillTransactionAmount, setGoodwillTransactionAmount] = useState(0);
    const [goodwillPaymentTypeOptions, setGoodwillPaymentTypeOptions] = useState([]);
    const [goodwillSelectedPaymentType, setGoodwillSelectedPaymentType] = useState("");
    const [goodwillExternalId, setGoodwillExternalId] = useState("");
    const [goodwillNote, setGoodwillNote] = useState("");
    const [isSubmittingGoodwillCredit, setIsSubmittingGoodwillCredit] = useState(false);
    const [showGoodwillPaymentDetails, setShowGoodwillPaymentDetails] = useState(false);
    const [goodwillAccountNumber, setGoodwillAccountNumber] = useState("");
    const [goodwillChequeNumber, setGoodwillChequeNumber] = useState("");
    const [goodwillRoutingCode, setGoodwillRoutingCode] = useState("");
    const [goodwillReceiptNumber, setGoodwillReceiptNumber] = useState("");
    const [goodwillBankNumber, setGoodwillBankNumber] = useState("");

    const [isPayoutRefundModalOpen, setIsPayoutRefundModalOpen] = useState(false);
    const [payoutTransactionDate, setPayoutTransactionDate] = useState(new Date());
    const [payoutTransactionAmount, setPayoutTransactionAmount] = useState(0);
    const [payoutPaymentTypeOptions, setPayoutPaymentTypeOptions] = useState([]);
    const [payoutSelectedPaymentType, setPayoutSelectedPaymentType] = useState("");
    const [payoutExternalId, setPayoutExternalId] = useState("");
    const [payoutNote, setPayoutNote] = useState("");
    const [isSubmittingPayoutRefund, setIsSubmittingPayoutRefund] = useState(false);
    const [showPayoutPaymentDetails, setShowPayoutPaymentDetails] = useState(false);
    const [payoutAccountNumber, setPayoutAccountNumber] = useState("");
    const [payoutChequeNumber, setPayoutChequeNumber] = useState("");
    const [payoutRoutingCode, setPayoutRoutingCode] = useState("");
    const [payoutReceiptNumber, setPayoutReceiptNumber] = useState("");
    const [payoutBankNumber, setPayoutBankNumber] = useState("");

    const [isMerchantRefundModalOpen, setIsMerchantRefundModalOpen] = useState(false);
    const [merchantTransactionDate, setMerchantTransactionDate] = useState(new Date());
    const [merchantTransactionAmount, setMerchantTransactionAmount] = useState(0);
    const [merchantPaymentTypeOptions, setMerchantPaymentTypeOptions] = useState([]);
    const [merchantSelectedPaymentType, setMerchantSelectedPaymentType] = useState("");
    const [merchantExternalId, setMerchantExternalId] = useState("");
    const [merchantNote, setMerchantNote] = useState("");
    const [isSubmittingMerchantRefund, setIsSubmittingMerchantRefund] = useState(false);
    const [showMerchantPaymentDetails, setShowMerchantPaymentDetails] = useState(false);
    const [merchantAccountNumber, setMerchantAccountNumber] = useState("");
    const [merchantChequeNumber, setMerchantChequeNumber] = useState("");
    const [merchantRoutingCode, setMerchantRoutingCode] = useState("");
    const [merchantReceiptNumber, setMerchantReceiptNumber] = useState("");
    const [merchantBankNumber, setMerchantBankNumber] = useState("");

    const [isWaiveInterestModalOpen, setIsWaiveInterestModalOpen] = useState(false);
    const [waiveInterestDate, setWaiveInterestDate] = useState(new Date());
    const [waiveTransactionAmount, setWaiveTransactionAmount] = useState(0);
    const [waiveInterestNote, setWaiveInterestNote] = useState("");
    const [isSubmittingWaiveInterest, setIsSubmittingWaiveInterest] = useState(false);

    const [isLoanRescheduleModalOpen, setIsLoanRescheduleModalOpen] = useState(false);
    const [loanRescheduleReasons, setLoanRescheduleReasons] = useState([]);
    const [loanRescheduleFromInstallment, setLoanRescheduleFromInstallment] = useState(null);
    const [loanRescheduleReason, setLoanRescheduleReason] = useState("");
    const [loanSubmittedOn, setLoanSubmittedOn] = useState(new Date());
    const [loanRescheduleComments, setLoanRescheduleComments] = useState("");
    const [loanChangeRepaymentDate, setLoanChangeRepaymentDate] = useState(false);
    const [loanInstallmentRescheduledTo, setLoanInstallmentRescheduledTo] = useState(null);
    const [loanMidTermGracePeriods, setLoanMidTermGracePeriods] = useState(false);
    const [loanPrincipalGracePeriods, setLoanPrincipalGracePeriods] = useState(0);
    const [loanInterestGracePeriods, setLoanInterestGracePeriods] = useState(0);
    const [loanExtendRepaymentPeriod, setLoanExtendRepaymentPeriod] = useState(false);
    const [loanNumberOfNewRepayments, setLoanNumberOfNewRepayments] = useState(0);
    const [loanAdjustInterestRates, setLoanAdjustInterestRates] = useState(false);
    const [loanNewInterestRate, setLoanNewInterestRate] = useState("");
    const [isSubmittingLoanReschedule, setIsSubmittingLoanReschedule] = useState(false);

    const [isWriteOffModalOpen, setIsWriteOffModalOpen] = useState(false);
    const [writeOffData, setWriteOffData] = useState({
        writeOffDate: new Date(),
        amount: 0,
        note: "",
    });
    const [isSubmittingWriteOff, setIsSubmittingWriteOff] = useState(false);

    const [isCloseRescheduledModalOpen, setIsCloseRescheduledModalOpen] = useState(false);
    const [closeRescheduledData, setCloseRescheduledData] = useState({
        closedOn: new Date(),
        note: "",
    });

    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [closeData, setCloseData] = useState({
        closedOn: new Date(),
        note: "",
    });

    const [isGuarantorsModalOpen, setIsGuarantorsModalOpen] = useState(false);
    const [guarantorsDetails, setGuarantorsDetails] = useState([]);
    const [guarantorsNote, setGuarantorsNote] = useState("");
    const [isSubmittingGuarantors, setIsSubmittingGuarantors] = useState(false);

    const [isCreateGuarantorModalOpen, setIsCreateGuarantorModalOpen] = useState(false);
    const [isExistingClient, setIsExistingClient] = useState(true);
    const [guarantorRelationshipOptions, setGuarantorRelationshipOptions] = useState([]);
    const [guarantorTypeOptions, setGuarantorTypeOptions] = useState([]);
    const [guarantorDetails, setGuarantorDetails] = useState({
        firstName: "",
        lastName: "",
        relationship: "",
        dateOfBirth: null,
        address1: "",
        address2: "",
        city: "",
        zip: "",
        mobile: "",
        residencePhone: "",
        existingClientName: "",
    });
    const [isSubmittingGuarantor, setIsSubmittingGuarantor] = useState(false);

    const [isRecoverFromGuarantorModalOpen, setIsRecoverFromGuarantorModalOpen] = useState(false);
    const [isSubmittingRecoverFromGuarantor, setIsSubmittingRecoverFromGuarantor] = useState(false);

    const handleOpenRecoverFromGuarantorModal = () => {
        setIsRecoverFromGuarantorModalOpen(true);
    };

    const handleCloseRecoverFromGuarantorModal = () => {
        setIsRecoverFromGuarantorModalOpen(false);
    };

    const handleRecoverFromGuarantor = async () => {
        setIsSubmittingRecoverFromGuarantor(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/guarantors/recover`,
                {},
                { headers }
            );

            alert("Recovery from guarantor submitted successfully.");
            handleCloseRecoverFromGuarantorModal();
        } catch (error) {
            console.error("Error recovering from guarantor:", error);
            alert("Failed to recover from guarantor.");
        } finally {
            setIsSubmittingRecoverFromGuarantor(false);
            stopLoading();
        }
    };

    const handleOpenCreateGuarantorModal = async () => {
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/guarantors/template`,
                { headers }
            );

            const data = response.data || {};
            setGuarantorRelationshipOptions(data.allowedClientRelationshipTypes || []);
            setGuarantorTypeOptions(data.guarantorTypeOptions || []);
            setIsCreateGuarantorModalOpen(true);
        } catch (error) {
            console.error("Error fetching guarantor data:", error);
            alert("Failed to load data for creating a guarantor.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseCreateGuarantorModal = () => {
        setIsCreateGuarantorModalOpen(false);
        setGuarantorDetails({
            firstName: "",
            lastName: "",
            relationship: "",
            dateOfBirth: null,
            address1: "",
            address2: "",
            city: "",
            zip: "",
            mobile: "",
            residencePhone: "",
            existingClientName: "",
        });
        setIsExistingClient(true);
    };

    const handleSubmitGuarantor = async () => {
        const { firstName, lastName, relationship, dateOfBirth, address1, address2, city, zip, mobile, residencePhone, existingClientName } = guarantorDetails;

        if (isExistingClient && (!existingClientName || !relationship)) {
            alert("Please fill in all mandatory fields for an existing client.");
            return;
        }

        if (!isExistingClient && (!firstName || !lastName || !relationship || !dateOfBirth)) {
            alert("Please fill in all mandatory fields for a new guarantor.");
            return;
        }

        const payload = isExistingClient
            ? {
                name: existingClientName,
                relationship,
            }
            : {
                firstName,
                lastName,
                relationship,
                dateOfBirth: dateOfBirth.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
                address1,
                address2,
                city,
                zip,
                mobile,
                residencePhone,
                dateFormat: "dd MMMM yyyy",
                locale: "en",
            };

        setIsSubmittingGuarantor(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(`${API_CONFIG.baseURL}/loans/${loanId}/guarantors`, payload, { headers });

            alert("Guarantor created successfully.");
            handleCloseCreateGuarantorModal();
        } catch (error) {
            console.error("Error creating guarantor:", error);
            alert("Failed to create guarantor.");
        } finally {
            setIsSubmittingGuarantor(false);
            stopLoading();
        }
    };

    const handleOpenGuarantorsModal = async () => {
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}?associations=guarantors`,
                { headers }
            );

            const data = response.data || {};
            setGuarantorsDetails(data.guarantors || []);
            setIsGuarantorsModalOpen(true);
        } catch (error) {
            console.error("Error fetching guarantors details:", error);
            alert("Failed to fetch guarantors details.");
        } finally {
            stopLoading();
        }
    };

    const handleCloseGuarantorsModal = () => {
        setIsGuarantorsModalOpen(false);
        setGuarantorsNote("");
        setGuarantorsDetails([]);
    };

    const handleSubmitGuarantorsNote = async () => {
        if (!guarantorsNote) {
            alert("Please provide a note.");
            return;
        }

        const payload = {
            note: guarantorsNote,
        };

        setIsSubmittingGuarantors(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/guarantors/note`,
                payload,
                { headers }
            );

            alert("Guarantors note submitted successfully.");
            handleCloseGuarantorsModal();
        } catch (error) {
            console.error("Error submitting guarantors note:", error);
            alert("Failed to submit guarantors note.");
        } finally {
            setIsSubmittingGuarantors(false);
            stopLoading();
        }
    };

    const fetchCloseData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=close`,
                { headers }
            );

            setCloseData((prev) => ({
                ...prev,
                closedOn: new Date(),
            }));
        } catch (error) {
            alert("Failed to fetch close data.");
            console.error("Error fetching close data:", error);
        } finally {
            stopLoading();
        }
    };

    const openCloseModal = () => {
        fetchCloseData();
        setIsCloseModalOpen(true);
    };

    const handleCloseCloseModal = () => {
        setIsCloseModalOpen(false);
        setCloseData({
            closedOn: new Date(),
            note: "",
        });
    };

    const handleSubmitClose = async () => {
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                transactionDate: closeData.closedOn.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                note: closeData.note,
                dateFormat: "dd MMMM yyyy",
                locale: "en",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=close`,
                payload,
                { headers }
            );

            alert("Loan successfully closed.");
            handleCloseCloseModal();
        } catch (error) {
            alert("Failed to submit close.");
            console.error("Error submitting close:", error);
        } finally {
            stopLoading();
        }
    };

    const fetchCloseRescheduledData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=close-rescheduled`,
                { headers }
            );

            setCloseRescheduledData((prev) => ({
                ...prev,
                closedOn: new Date(),
            }));
        } catch (error) {
            alert("Failed to fetch close (as rescheduled) data.");
            console.error("Error fetching close (as rescheduled) data:", error);
        } finally {
            stopLoading();
        }
    };

    const openCloseRescheduledModal = () => {
        fetchCloseRescheduledData();
        setIsCloseRescheduledModalOpen(true);
    };

    const handleCloseCloseRescheduledModal = () => {
        setIsCloseRescheduledModalOpen(false);
        setCloseRescheduledData({
            closedOn: new Date(),
            note: "",
        });
    };

    const handleSubmitCloseRescheduled = async () => {
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                transactionDate: closeRescheduledData.closedOn.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                note: closeRescheduledData.note,
                dateFormat: "dd MMMM yyyy",
                locale: "en",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=close-rescheduled`,
                payload,
                { headers }
            );

            alert("Loan successfully closed (as rescheduled).");
            handleCloseCloseRescheduledModal();
        } catch (error) {
            alert("Failed to submit close (as rescheduled).");
            console.error("Error submitting close (as rescheduled):", error);
        } finally {
            stopLoading();
        }
    };

    const fetchWriteOffData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=writeoff`,
                { headers }
            );

            const { amount } = response.data;
            setWriteOffData((prev) => ({
                ...prev,
                amount: amount || 0,
                writeOffDate: new Date(),
            }));
        } catch (error) {
            alert("Failed to fetch write-off data.");
            console.error("Error fetching write-off data:", error);
        } finally {
            stopLoading();
        }
    };

    const openWriteOffModal = () => {
        fetchWriteOffData();
        setIsWriteOffModalOpen(true);
    };

    const handleCloseWriteOffModal = () => {
        setIsWriteOffModalOpen(false);
        setWriteOffData({
            writeOffDate: new Date(),
            amount: 0,
            note: "",
        });
    };

    const handleSubmitWriteOff = async () => {
        setIsSubmittingWriteOff(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                transactionDate: writeOffData.writeOffDate.toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                amount: writeOffData.amount,
                note: writeOffData.note,
                dateFormat: "dd MMMM yyyy",
                locale: "en",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=writeoff`,
                payload,
                { headers }
            );

            alert("Write-off successful.");
            handleCloseWriteOffModal();
        } catch (error) {
            alert("Failed to submit write-off.");
            console.error("Error submitting write-off:", error);
        } finally {
            setIsSubmittingWriteOff(false);
            stopLoading();
        }
    };

    const handleOpenLoanRescheduleModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/rescheduleloans/template`,
                { headers }
            );

            const data = response.data || {};
            setLoanRescheduleReasons(data.rescheduleReasons || []);
            setIsLoanRescheduleModalOpen(true);
        } catch (error) {
            console.error("Error fetching reschedule data:", error);
            alert("Failed to load data for Reschedule.");
        }
    };

    const handleCloseLoanRescheduleModal = () => {
        setIsLoanRescheduleModalOpen(false);
        setLoanRescheduleFromInstallment(null);
        setLoanRescheduleReason("");
        setLoanSubmittedOn(new Date());
        setLoanRescheduleComments("");
        setLoanChangeRepaymentDate(false);
        setLoanInstallmentRescheduledTo(null);
        setLoanMidTermGracePeriods(false);
        setLoanPrincipalGracePeriods(0);
        setLoanInterestGracePeriods(0);
        setLoanExtendRepaymentPeriod(false);
        setLoanNumberOfNewRepayments(0);
        setLoanAdjustInterestRates(false);
        setLoanNewInterestRate("");
    };

    const handleSubmitLoanReschedule = async () => {
        if (!loanRescheduleFromInstallment || !loanRescheduleReason || !loanSubmittedOn) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            rescheduleFromInstallmentDate: loanRescheduleFromInstallment.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            rescheduleReason: loanRescheduleReason,
            submittedOnDate: loanSubmittedOn.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            comments: loanRescheduleComments,
            changeRepaymentDate: loanChangeRepaymentDate,
            installmentRescheduledToDate: loanChangeRepaymentDate
                ? loanInstallmentRescheduledTo?.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })
                : null,
            introduceMidTermGracePeriods: loanMidTermGracePeriods,
            principalGracePeriods: loanMidTermGracePeriods ? loanPrincipalGracePeriods : null,
            interestGracePeriods: loanMidTermGracePeriods ? loanInterestGracePeriods : null,
            extendRepaymentPeriod: loanExtendRepaymentPeriod,
            numberOfNewRepayments: loanExtendRepaymentPeriod ? loanNumberOfNewRepayments : null,
            adjustInterestRates: loanAdjustInterestRates,
            newInterestRate: loanAdjustInterestRates ? loanNewInterestRate : null,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingLoanReschedule(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(`${API_CONFIG.baseURL}/rescheduleloans`, payload, { headers });

            alert("Loan rescheduled successfully.");
            handleCloseLoanRescheduleModal();
        } catch (error) {
            console.error("Error submitting reschedule:", error);
            alert("Failed to submit Reschedule.");
        } finally {
            setIsSubmittingLoanReschedule(false);
            stopLoading();
        }
    };

    const handleOpenWaiveInterestModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=waiveinterest`,
                { headers }
            );

            const data = response.data || {};
            setWaiveTransactionAmount(data.amount || 0);
            setIsWaiveInterestModalOpen(true);
        } catch (error) {
            console.error("Error fetching waive interest data:", error);
            alert("Failed to load data for Waive Interest.");
        }
    };

    const handleCloseWaiveInterestModal = () => {
        setIsWaiveInterestModalOpen(false);
        setWaiveInterestDate(new Date());
        setWaiveTransactionAmount(0);
        setWaiveInterestNote("");
    };

    const handleSubmitWaiveInterest = async () => {
        if (!waiveInterestDate || !waiveTransactionAmount) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: waiveInterestDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: waiveTransactionAmount,
            note: waiveInterestNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingWaiveInterest(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=waiveinterest`,
                payload,
                { headers }
            );

            alert("Interest waived successfully.");
            handleCloseWaiveInterestModal();
        } catch (error) {
            console.error("Error submitting waive interest:", error);
            alert("Failed to submit Waive Interest.");
        } finally {
            setIsSubmittingWaiveInterest(false);
            stopLoading();
        }
    };

    const handleOpenMerchantRefundModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=merchantIssuedRefund`,
                { headers }
            );

            const data = response.data || {};
            setMerchantTransactionAmount(data.amount || 0);
            setMerchantPaymentTypeOptions(data.paymentTypeOptions || []);
            setIsMerchantRefundModalOpen(true);
        } catch (error) {
            console.error("Error fetching merchant issued refund data:", error);
            alert("Failed to load data for Merchant Issued Refund.");
        }
    };

    const handleCloseMerchantRefundModal = () => {
        setIsMerchantRefundModalOpen(false);
        setMerchantTransactionDate(new Date());
        setMerchantTransactionAmount(0);
        setMerchantSelectedPaymentType("");
        setMerchantExternalId("");
        setMerchantNote("");
        setShowMerchantPaymentDetails(false);
        setMerchantAccountNumber("");
        setMerchantChequeNumber("");
        setMerchantRoutingCode("");
        setMerchantReceiptNumber("");
        setMerchantBankNumber("");
    };

    const handleSubmitMerchantRefund = async () => {
        if (!merchantTransactionDate || !merchantTransactionAmount || !merchantSelectedPaymentType) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: merchantTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: merchantTransactionAmount,
            paymentTypeId: merchantSelectedPaymentType,
            externalId: merchantExternalId,
            note: merchantNote,
            accountNumber: merchantAccountNumber,
            chequeNumber: merchantChequeNumber,
            routingCode: merchantRoutingCode,
            receiptNumber: merchantReceiptNumber,
            bankNumber: merchantBankNumber,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingMerchantRefund(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=merchantIssuedRefund`,
                payload,
                { headers }
            );

            alert("Merchant Issued Refund submitted successfully.");
            handleCloseMerchantRefundModal();
        } catch (error) {
            console.error("Error submitting merchant issued refund:", error);
            alert("Failed to submit Merchant Issued Refund.");
        } finally {
            setIsSubmittingMerchantRefund(false);
            stopLoading();
        }
    };

    const handleOpenPayoutRefundModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=payoutRefund`,
                { headers }
            );

            const data = response.data || {};
            setPayoutTransactionAmount(data.amount || 0);
            setPayoutPaymentTypeOptions(data.paymentTypeOptions || []);
            setIsPayoutRefundModalOpen(true);
        } catch (error) {
            console.error("Error fetching payout refund data:", error);
            alert("Failed to load data for payout refund.");
        }
    };

    const handleClosePayoutRefundModal = () => {
        setIsPayoutRefundModalOpen(false);
        setPayoutTransactionDate(new Date());
        setPayoutTransactionAmount(0);
        setPayoutSelectedPaymentType("");
        setPayoutExternalId("");
        setPayoutNote("");
        setShowPayoutPaymentDetails(false);
        setPayoutAccountNumber("");
        setPayoutChequeNumber("");
        setPayoutRoutingCode("");
        setPayoutReceiptNumber("");
        setPayoutBankNumber("");
    };

    const handleSubmitPayoutRefund = async () => {
        if (!payoutTransactionDate || !payoutTransactionAmount || !payoutSelectedPaymentType) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: payoutTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: payoutTransactionAmount,
            paymentTypeId: payoutSelectedPaymentType,
            externalId: payoutExternalId,
            note: payoutNote,
            accountNumber: payoutAccountNumber,
            chequeNumber: payoutChequeNumber,
            routingCode: payoutRoutingCode,
            receiptNumber: payoutReceiptNumber,
            bankNumber: payoutBankNumber,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingPayoutRefund(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=payoutRefund`,
                payload,
                { headers }
            );

            alert("Payout refund submitted successfully.");
            handleClosePayoutRefundModal();
        } catch (error) {
            console.error("Error submitting payout refund:", error);
            alert("Failed to submit payout refund.");
        } finally {
            setIsSubmittingPayoutRefund(false);
            stopLoading();
        }
    };

    const handleOpenGoodwillCreditModal = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=goodwillCredit`,
                { headers }
            );

            const data = response.data || {};
            setGoodwillTransactionAmount(data.amount || 0);
            setGoodwillPaymentTypeOptions(data.paymentTypeOptions || []);
            setIsGoodwillCreditModalOpen(true);
        } catch (error) {
            console.error("Error fetching goodwill credit data:", error);
            alert("Failed to load data for goodwill credit.");
        }
    };

    const handleCloseGoodwillCreditModal = () => {
        setIsGoodwillCreditModalOpen(false);
        setGoodwillTransactionDate(new Date());
        setGoodwillTransactionAmount(0);
        setGoodwillSelectedPaymentType("");
        setGoodwillExternalId("");
        setGoodwillNote("");
        setShowGoodwillPaymentDetails(false);
        setGoodwillAccountNumber("");
        setGoodwillChequeNumber("");
        setGoodwillRoutingCode("");
        setGoodwillReceiptNumber("");
        setGoodwillBankNumber("");
    };

    const handleSubmitGoodwillCredit = async () => {
        if (!goodwillTransactionDate || !goodwillTransactionAmount || !goodwillSelectedPaymentType) {
            alert("Please fill in all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: goodwillTransactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: goodwillTransactionAmount,
            paymentTypeId: goodwillSelectedPaymentType,
            externalId: goodwillExternalId,
            note: goodwillNote,
            accountNumber: goodwillAccountNumber,
            chequeNumber: goodwillChequeNumber,
            routingCode: goodwillRoutingCode,
            receiptNumber: goodwillReceiptNumber,
            bankNumber: goodwillBankNumber,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingGoodwillCredit(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=goodwillCredit`,
                payload,
                { headers }
            );

            alert("Goodwill credit submitted successfully.");
            handleCloseGoodwillCreditModal();
        } catch (error) {
            console.error("Error submitting goodwill credit:", error);
            alert("Failed to submit goodwill credit.");
        } finally {
            setIsSubmittingGoodwillCredit(false);
            stopLoading();
        }
    };

    const handleOpenReAmortizeModal = () => {
        setIsReAmortizeModalOpen(true);
    };

    const handleCloseReAmortizeModal = () => {
        setIsReAmortizeModalOpen(false);
        setReAmortizeReason("");
        setReAmortizeExternalId("");
    };

    const handleSubmitReAmortize = async () => {
        if (!reAmortizeReason) {
            alert("Reason is required.");
            return;
        }

        const payload = {
            reason: reAmortizeReason,
            externalId: reAmortizeExternalId,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingReAmortize(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=reAmortize`,
                payload,
                { headers }
            );

            alert("Re-Amortization submitted successfully.");
            handleCloseReAmortizeModal();
        } catch (error) {
            console.error("Error submitting re-amortization:", error);
            alert("Failed to submit re-amortization.");
        } finally {
            setIsSubmittingReAmortize(false);
            stopLoading();
        }
    };

    const handleOpenReAgeModal = () => {
        setIsReAgeModalOpen(true);
    };

    const handleCloseReAgeModal = () => {
        setIsReAgeModalOpen(false);
        setReAgeInstallments("");
        setReAgeFrequencyNumber("");
        setReAgeFrequencyType("");
        setReAgeStartDate(new Date());
        setReAgeReason("");
        setReAgeExternalId("");
    };

    const handleSubmitReAge = async () => {
        if (!reAgeInstallments || !reAgeFrequencyNumber || !reAgeFrequencyType || !reAgeStartDate) {
            alert("All mandatory fields must be filled.");
            return;
        }

        const payload = {
            numberOfInstallments: reAgeInstallments,
            frequencyNumber: reAgeFrequencyNumber,
            frequencyType: reAgeFrequencyType,
            startDate: reAgeStartDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            reason: reAgeReason,
            externalId: reAgeExternalId,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingReAge(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=re-age`,
                payload,
                { headers }
            );

            alert("Re-Age submitted successfully.");
            handleCloseReAgeModal();
        } catch (error) {
            console.error("Error submitting re-age:", error);
            alert("Failed to submit re-age.");
        } finally {
            setIsSubmittingReAge(false);
            stopLoading();
        }
    };

    const handleOpenChargeOffModal = async () => {
        setIsChargeOffModalOpen(true);

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=charge-off`,
                { headers }
            );

            const { chargeOffReasonOptions } = response.data;
            setChargeOffData(response.data);
            setChargeOffReason(chargeOffReasonOptions[0]?.id || "");
        } catch (error) {
            console.error("Error fetching charge-off template:", error);
            alert("Failed to fetch charge-off details.");
        }
    };

    const handleCloseChargeOffModal = () => {
        setIsChargeOffModalOpen(false);
        setChargeOffData({});
        setChargeOffDate(new Date());
        setChargeOffReason("");
        setChargeOffExternalId("");
        setChargeOffNote("");
    };

    const handleSubmitChargeOff = async () => {
        if (!chargeOffDate || !chargeOffReason || !chargeOffNote.trim()) {
            alert("All mandatory fields must be filled.");
            return;
        }

        const payload = {
            transactionDate: chargeOffDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            chargeOffReasonId: chargeOffReason,
            externalId: chargeOffExternalId,
            note: chargeOffNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingChargeOff(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=charge-off`,
                payload,
                { headers }
            );

            alert("Charge-Off submitted successfully.");
            handleCloseChargeOffModal();
        } catch (error) {
            console.error("Error submitting charge-off:", error);
            alert("Failed to submit charge-off.");
        } finally {
            setIsSubmittingChargeOff(false);
            stopLoading();
        }
    };

    const handleOpenPrepayLoanModal = async () => {
        setIsPrepayLoanModalOpen(true);

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=prepayLoan&transactionDate=${encodeURIComponent(
                    prepayLoanDate.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })
                )}&locale=en&dateFormat=dd MMMM yyyy`,
                { headers }
            );

            const { amount, paymentTypeOptions } = response.data;
            setPrepayLoanData(response.data);
            setPrepayTransactionAmount(amount);
            setPrepayPaymentType(paymentTypeOptions[0]?.id || "");
        } catch (error) {
            console.error("Error fetching prepay loan template:", error);
            alert("Failed to fetch prepay loan details.");
        }
    };

    const handleClosePrepayLoanModal = () => {
        setIsPrepayLoanModalOpen(false);
        setPrepayLoanData({});
        setPrepayLoanDate(new Date());
        setPrepayTransactionAmount("");
        setPrepayPaymentType("");
        setPrepayExternalId("");
        setShowPrepayPaymentDetails(false);
        setPrepayAccount("");
        setPrepayCheque("");
        setPrepayRoutingCode("");
        setPrepayReceipt("");
        setPrepayBank("");
        setPrepayNote("");
    };

    const handleSubmitPrepayLoan = async () => {
        if (!prepayTransactionAmount || !prepayPaymentType || !prepayNote.trim()) {
            alert("All mandatory fields must be filled.");
            return;
        }

        const payload = {
            transactionDate: prepayLoanDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: prepayTransactionAmount,
            paymentTypeId: prepayPaymentType,
            externalId: prepayExternalId,
            note: prepayNote,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
            accountNumber: showPrepayPaymentDetails ? prepayAccount : undefined,
            checkNumber: showPrepayPaymentDetails ? prepayCheque : undefined,
            routingCode: showPrepayPaymentDetails ? prepayRoutingCode : undefined,
            receiptNumber: showPrepayPaymentDetails ? prepayReceipt : undefined,
            bankNumber: showPrepayPaymentDetails ? prepayBank : undefined,
        };

        setIsSubmittingPrepayLoan(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=prepayLoan`,
                payload,
                { headers }
            );

            alert("Prepay Loan submitted successfully.");
            handleClosePrepayLoanModal();
        } catch (error) {
            console.error("Error submitting prepay loan:", error);
            alert("Failed to submit prepay loan.");
        } finally {
            setIsSubmittingPrepayLoan(false);
            stopLoading();
        }
    };

    const handleOpenUndoDisbursalModal = () => {
        setIsUndoDisbursalModalOpen(true);
    };

    const handleCloseUndoDisbursalModal = () => {
        setIsUndoDisbursalModalOpen(false);
        setUndoDisbursalNote("");
    };

    const handleSubmitUndoDisbursal = async () => {
        if (!undoDisbursalNote.trim()) {
            alert("Note is required.");
            return;
        }

        const payload = {
            note: undoDisbursalNote,
            locale: "en",
        };

        setIsSubmittingUndoDisbursal(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=undodisbursal`,
                payload,
                { headers }
            );

            alert("Undo Disbursal action submitted successfully.");
            handleCloseUndoDisbursalModal();
        } catch (error) {
            console.error("Error submitting undo disbursal:", error);
            alert("Failed to submit undo disbursal.");
        } finally {
            setIsSubmittingUndoDisbursal(false);
            stopLoading();
        }
    };

    const handleOpenRepaymentModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=repayment`,
                { headers }
            );

            setRepaymentData(response.data);
            setPaymentTypeOptions(response.data.paymentTypeOptions || []);
            setRepaymentForm((prev) => ({
                ...prev,
                transactionAmount: response.data.amount,
            }));
            setIsRepaymentModalOpen(true);
        } catch (error) {
            console.error("Error fetching repayment template data:", error);
        } finally {
            stopLoading();
        }
    };

    const handleCloseRepaymentModal = () => {
        setIsRepaymentModalOpen(false);
        setRepaymentData(null);
        setRepaymentForm({
            transactionDate: new Date(),
            transactionAmount: "",
            externalId: "",
            selectedPaymentType: "",
            accountNumber: "",
            chequeNumber: "",
            routingCode: "",
            receiptNumber: "",
            bankNumber: "",
            note: "",
            showPaymentDetails: false,
        });
    };

    const handleSubmitRepayment = async () => {
        const {
            transactionDate,
            transactionAmount,
            externalId,
            selectedPaymentType,
            accountNumber,
            chequeNumber,
            routingCode,
            receiptNumber,
            bankNumber,
            note,
        } = repaymentForm;

        if (!transactionDate || !transactionAmount || !selectedPaymentType) {
            alert("Please fill all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: transactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            transactionAmount: parseFloat(transactionAmount),
            externalId,
            paymentTypeId: selectedPaymentType,
            note,
            accountNumber,
            chequeNumber,
            routingCode,
            receiptNumber,
            bankNumber,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingRepayment(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=repayment`,
                payload,
                { headers }
            );

            alert("Repayment submitted successfully!");
            handleCloseRepaymentModal();
        } catch (error) {
            console.error("Error submitting repayment:", error);
            alert("Failed to submit repayment.");
        } finally {
            setIsSubmittingRepayment(false);
            stopLoading();
        }
    };

    const handleOpenForeclosureModal = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const transactionDate = new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions/template?command=foreclosure&locale=en&dateFormat=dd%20MMMM%20yyyy&transactionDate=${transactionDate}`,
                { headers }
            );

            setForeclosureData(response.data);
            setForeclosureForm((prev) => ({
                ...prev,
                transactionDate: new Date(),
            }));
            setIsForeclosureModalOpen(true);
        } catch (error) {
            console.error("Error fetching foreclosure data:", error);
        } finally {
            stopLoading();
        }
    };

    const handleCloseForeclosureModal = () => {
        setIsForeclosureModalOpen(false);
        setForeclosureData(null);
        setForeclosureForm({ transactionDate: new Date(), note: "" });
    };

    const handleSubmitForeclosure = async () => {
        if (!foreclosureForm.transactionDate || !foreclosureForm.note) {
            alert("Please fill all mandatory fields.");
            return;
        }

        const payload = {
            transactionDate: foreclosureForm.transactionDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }),
            note: foreclosureForm.note,
            dateFormat: "dd MMMM yyyy",
            locale: "en",
        };

        setIsSubmittingForeclosure(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/transactions?command=foreclosure`,
                payload,
                { headers }
            );

            alert("Foreclosure transaction submitted successfully!");
            handleCloseForeclosureModal();
        } catch (error) {
            console.error("Error submitting foreclosure transaction:", error);
            alert("Failed to submit foreclosure transaction.");
        } finally {
            setIsSubmittingForeclosure(false);
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
                `${API_CONFIG.baseURL}/loans/${loanId}/charges/template`,
                { headers }
            );

            setChargeOptions(response.data.chargeOptions || []);
            setIsAddChargeModalOpen(true);
        } catch (error) {
            console.error("Error fetching charge options:", error);
        } finally {
            stopLoading();
        }
    };

    const handleCloseModal = () => {
        setIsAddChargeModalOpen(false);
        setSelectedCharge(null);
        setFormData({ chargeId: "", amount: "", dueDate: null });
    };

    const handleChargeSelect = (chargeId) => {
        const charge = chargeOptions.find((option) => option.id === parseInt(chargeId));
        setSelectedCharge(charge);
        setFormData((prev) => ({
            ...prev,
            chargeId,
            amount: charge.amount,
        }));
    };

    const handleSubmit = async () => {
        if (
            !formData.chargeId ||
            !formData.amount ||
            (selectedCharge?.chargeTimeType.value === "Specified due date" && !formData.dueDate)
        ) {
            return;
        }

        const payload = {
            chargeId: parseInt(formData.chargeId),
            amount: parseFloat(formData.amount),
            ...(selectedCharge?.chargeTimeType.value === "Specified due date" && {
                dueDate: formData.dueDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
                dateFormat: "dd MMMM yyyy",
                locale: "en",
            }),
        };

        setIsSubmitting(true);
        startLoading();

        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/charges`,
                payload,
                { headers }
            );

            alert("Loan charge added successfully!");
            handleCloseModal();
        } catch (error) {
            console.error("Error adding loan charge:", error);
            alert("Failed to add loan charge.");
        } finally {
            setIsSubmitting(false);
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "externalAssetOwner") {
            fetchTransfers();
        }
    }, [activeTab]);

    const fetchTransfers = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };
            const [activeResponse, transfersResponse] = await Promise.all([
                axios.get(`${API_CONFIG.baseURL}/external-asset-owners/transfers/active-transfer?loanId=${loanId}`, { headers }),
                axios.get(`${API_CONFIG.baseURL}/external-asset-owners/transfers?loanId=${loanId}`, { headers }),
            ]);

            setActiveTransfer(activeResponse.data || null);
            setTransfers(transfersResponse.data.content || []);
        } catch (error) {
            console.error("Error fetching external asset transfers:", error);
        } finally {
            stopLoading();
        }
    };

    const handleSellLoan = async () => {
        startLoading();
        try {
            const payload = {
                settlementDate: sellLoanPayload.settlementDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }),
                purchasePriceRatio: sellLoanPayload.purchasePriceRatio,
                ownerExternalId: sellLoanPayload.ownerExternalId,
                transferExternalId: sellLoanPayload.transferExternalId || "",
                locale: "en",
                dateFormat: "dd MMMM yyyy",
            };

            await axios.post(
                `${API_CONFIG.baseURL}/external-asset-owners/transfers/loans/${loanId}?command=sale`,
                payload,
                {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        "Fineract-Platform-TenantId": "default",
                        "Content-Type": "application/json",
                    },
                }
            );
            setIsSellLoanModalOpen(false);
            fetchTransfers();
        } catch (error) {
            console.error("Error selling loan:", error);
        } finally {
            stopLoading();
        }
    };

    const handleCancelSellLoan = async () => {
        startLoading();
        try {
            const pendingTransfer = transfers.find(
                (transfer) =>
                    transfer.status === "PENDING" &&
                    !transfers.some(
                        (t) =>
                            t.status === "CANCELLED" &&
                            t.transferExternalId === transfer.transferExternalId
                    )
            );

            if (pendingTransfer) {
                await axios.post(
                    `${API_CONFIG.baseURL}/external-asset-owners/transfers/${pendingTransfer.transferId}?command=cancel`,
                    {},
                    {
                        headers: {
                            Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                            "Fineract-Platform-TenantId": "default",
                            "Content-Type": "application/json",
                        },
                    }
                );
                setIsCancelModalOpen(false);
                fetchTransfers();
            } else {
                console.error("No valid pending transfer found for cancellation.");
            }
        } catch (error) {
            console.error("Error canceling sell loan:", error);
        } finally {
            stopLoading();
        }
    };

    const fetchStandingInstructions = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/standinginstructions?clientId=${clientId}&clientName=${clientDetails?.clientName}&fromAccountId=${loanId}&fromAccountType=1&locale=en&dateFormat=dd%20MMMM%20yyyy&limit=14&offset=0`,
                { headers }
            );

            setStandingInstructions(response.data.pageItems || []);
        } catch (error) {
            console.error("Error fetching standing instructions:", error);
        }
    };

    useEffect(() => {
        if (activeTab === "standingInstructions") {
            fetchStandingInstructions();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "notes") {
            fetchNotes();
        }
    }, [activeTab]);

    const fetchNotes = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/notes`,
                { headers }
            );
            setNotes(response.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            stopLoading();
        }
    };

    const handleSaveNote = async () => {
        if (!newNote.trim()) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = { note: newNote.trim() };

            if (editingNoteId) {
                await axios.put(
                    `${API_CONFIG.baseURL}/loans/${loanId}/notes/${editingNoteId}`,
                    payload,
                    { headers }
                );
            } else {
                await axios.post(
                    `${API_CONFIG.baseURL}/loans/${loanId}/notes`,
                    payload,
                    { headers }
                );
            }

            setIsNotesModalOpen(false);
            setNewNote("");
            setEditingNoteId(null);
            fetchNotes();
        } catch (error) {
            console.error("Error saving note:", error);
        } finally {
            stopLoading();
        }
    };

    const handleEditNote = (note) => {
        setEditingNoteId(note.id);
        setNewNote(note.note);
        setIsNotesModalOpen(true);
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Are you sure you want to delete this note?")) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            await axios.delete(
                `${API_CONFIG.baseURL}/loans/${loanId}/notes/${noteId}`,
                { headers }
            );

            fetchNotes();
        } catch (error) {
            console.error("Error deleting note:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "loanDocuments") {
            fetchLoanDocuments();
        }
    }, [activeTab]);

    const fetchLoanDocuments = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/documents`,
                { headers }
            );
            setLoanDocuments(response.data);
        } catch (error) {
            console.error("Error fetching loan documents:", error);
        } finally {
            stopLoading();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadPayload((prev) => ({ ...prev, file }));
    };

    const handleSubmitUpload = async () => {
        if (!uploadPayload.fileName || !uploadPayload.file) {
            alert("File Name and File are mandatory.");
            return;
        }

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "multipart/form-data",
            };

            const formData = new FormData();
            formData.append("fileName", uploadPayload.fileName);
            formData.append("description", uploadPayload.description);
            formData.append("file", uploadPayload.file);

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/documents`,
                formData,
                { headers }
            );

            setIsUploadModalOpen(false);
            fetchLoanDocuments();
        } catch (error) {
            console.error("Error uploading document:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "loanReschedules") {
            fetchLoanReschedules();
        }
    }, [activeTab]);

    const fetchLoanReschedules = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/rescheduleloans?loanId=${loanId}`,
                { headers }
            );

            setLoanReschedules(response.data);
        } catch (error) {
            console.error("Error fetching loan reschedules:", error);
        }
    };

    const fetchRescheduleTemplate = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/rescheduleloans/template`,
                { headers }
            );

            setRescheduleReasons(response.data.rescheduleReasons || []);
        } catch (error) {
            console.error("Error fetching reschedule template:", error);
        }
    };

    const handleOpenRescheduleModal = async () => {
        await fetchRescheduleTemplate();
        setIsRescheduleModalOpen(true);
    };

    const handleSubmitReschedule = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                rescheduleFromInstallmentDate: rescheduleFromDate?.toISOString().split("T")[0],
                rescheduleReasonId: rescheduleReason,
                submittedOnDate: submittedOnDate?.toISOString().split("T")[0],
                comments: rescheduleComments,
                locale: "en",
            };

            if (showRepaymentDateField && installmentRescheduledTo) {
                payload.installmentRescheduledToDate = installmentRescheduledTo
                    ?.toISOString()
                    .split("T")[0];
            }

            if (showGracePeriods) {
                payload.principalGracePeriods = principalGracePeriods;
                payload.interestGracePeriods = interestGracePeriods;
            }

            if (showExtendRepayment) {
                payload.numberOfNewRepayments = newRepayments;
            }

            if (showAdjustInterestRates) {
                payload.newInterestRate = parseFloat(newInterestRate);
            }

            await axios.post(
                `${API_CONFIG.baseURL}/rescheduleloans?loanId=${loanId}`,
                payload,
                { headers }
            );

            setIsRescheduleModalOpen(false);
            await fetchLoanReschedules();
        } catch (error) {
            console.error("Error submitting reschedule:", error);
        }
    };

    const handleViewRescheduleDetails = (reschedule) => {
        console.log("View Reschedule Details:", reschedule);
    };

    const handleFetchPaymentTypes = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };
            const response = await axios.get(`${API_CONFIG.baseURL}/paymenttypes`, { headers });
            setPaymentTypeOptions(response.data);
        } catch (error) {
            console.error("Error fetching payment types:", error);
        }
    };

    const handleAdjustCharge = (charge) => {
        setSelectedCharge(charge);
        setAdjustmentPayload((prev) => ({
            ...prev,
            amount: charge.amount,
        }));
        handleFetchPaymentTypes();
        setIsAdjustmentModalOpen(true);
    };

    const handleWaiveCharge = (charge) => {
        setSelectedCharge(charge);
        setIsWaiveConfirmationOpen(true);
    };

    const handleConfirmWaiveCharge = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
            };
            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/charges/${selectedCharge.id}?command=waive`,
                { locale: "en" },
                { headers }
            );
            fetchLoanData();
        } catch (error) {
            console.error("Error waiving charge:", error);
        } finally {
            setIsWaiveConfirmationOpen(false);
        }
    };

    const handleSubmitAdjustment = async () => {
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };
            const payload = {
                ...adjustmentPayload,
                locale: "en",
            };
            if (!showPaymentDetails) {
                delete payload.accountNumber;
                delete payload.chequeNumber;
                delete payload.routingCode;
                delete payload.receiptNumber;
                delete payload.bankNumber;
            }
            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/charges/${selectedCharge.id}?command=adjustment`,
                payload,
                { headers }
            );
            fetchLoanData();
        } catch (error) {
            console.error("Error submitting adjustment:", error);
        } finally {
            setIsAdjustmentModalOpen(false);
        }
    };

    const fetchChargeAccrual = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/configurations/name/charge-accrual-date`,
                { headers }
            );
            setChargeAccrual(response.data);
        } catch (error) {
            console.error("Error fetching charge accrual data:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "charges") {
            fetchChargeAccrual();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === "loanCollateralDetails") {
            fetchCollaterals();
        }
    }, [activeTab]);

    const fetchCollaterals = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/collaterals`,
                { headers }
            );
            setCollaterals(response.data);
        } catch (error) {
            console.error("Error fetching collaterals:", error);
        } finally {
            stopLoading();
        }
    };

    const fetchCollateralTemplate = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/collaterals/template`,
                { headers }
            );
            setCollateralTemplate(response.data.allowedCollateralTypes);
        } catch (error) {
            console.error("Error fetching collateral template:", error);
        } finally {
            stopLoading();
        }
    };

    const handleAddCollateral = async () => {
        if (!collateralType || !collateralValue) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                type: collateralType,
                value: collateralValue,
                description: collateralDescription,
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/collaterals`,
                payload,
                { headers }
            );

            await fetchCollaterals();
            setIsCollateralModalOpen(false);
            setCollateralType("");
            setCollateralValue("");
            setCollateralDescription("");
        } catch (error) {
            console.error("Error adding collateral:", error);
        } finally {
            stopLoading();
        }
    };

    useEffect(() => {
        if (activeTab === "delinquencyTags") {
            fetchDelinquencyData();
        }
    }, [activeTab]);

    const fetchDelinquencyData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const actionsResponse = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/delinquency-actions`,
                { headers }
            );
            setDelinquencyActions(actionsResponse.data);

            const tagsResponse = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}/delinquencytags`,
                { headers }
            );
            setDelinquencyTags(tagsResponse.data);
        } catch (error) {
            console.error("Error fetching delinquency data:", error);
        } finally {
            stopLoading();
        }
    };

    const handlePauseDelinquency = async () => {
        if (!startDate || !endDate) return;

        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const payload = {
                action: "pause",
                locale: "en",
                dateFormat: "dd MMMM yyyy",
                startDate: new Date(startDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }),
                endDate: new Date(endDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }),
            };

            await axios.post(
                `${API_CONFIG.baseURL}/loans/${loanId}/delinquency-actions`,
                payload,
                { headers }
            );

            await fetchDelinquencyData();
            setIsDelinquencyModalOpen(false);
        } catch (error) {
            console.error("Error pausing delinquency classification:", error);
        } finally {
            stopLoading();
        }
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
        setLoanImage(`${process.env.PUBLIC_URL}/Images/centers.png`);
    }, []);

    useEffect(() => {
        fetchLoanData();
    }, [loanId]);

    const fetchLoanData = async () => {
        startLoading();
        try {
            const headers = {
                Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                "Fineract-Platform-TenantId": "default",
                "Content-Type": "application/json",
            };

            const loanResponse = await axios.get(
                `${API_CONFIG.baseURL}/loans/${loanId}?associations=all&exclude=guarantors,futureSchedule`,
                { headers }
            );
            setLoanDetails(loanResponse.data);

            const clientResponse = await axios.get(
                `${API_CONFIG.baseURL}/clients/${clientId}`,
                { headers }
            );
            setClientDetails(clientResponse.data);
        } catch (error) {
            console.error("Error fetching loan details:", error);
        } finally {
            stopLoading();
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "general":
                return (
                    <div className="general-tab">
                        {/* Performance History Section */}
                        {!loanDetails?.status?.value?.toLowerCase()?.includes("approved") && (
                            <div className="general-section general-summary-details">
                            <h3 className="general-section-title">Performance History</h3>
                            <div className="general-details-columns">
                                <div className="general-details-column">
                                    <p>
                                        <strong>Number of Repayments:</strong>{" "}
                                        {loanDetails?.summary?.numberOfRepayments || "-"}
                                    </p>
                                    <p>
                                        <strong>Maturity Date:</strong>{" "}
                                        {loanDetails?.timeline?.expectedMaturityDate
                                            ? new Date(loanDetails.timeline.expectedMaturityDate.join("-")).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Loan Summary Section */}
                        {!loanDetails?.status?.value?.toLowerCase()?.includes("approved") && (
                        <div className="general-section general-groups-section">
                            <h3 className="general-section-title">Loan Summary</h3>
                            <table className="general-charges-table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Original</th>
                                    <th>Paid</th>
                                    <th>Waived</th>
                                    <th>Written Off</th>
                                    <th>Outstanding</th>
                                    <th>Overdue</th>
                                </tr>
                                </thead>
                                <tbody>
                                {[
                                    {
                                        label: "Principal",
                                        original: "principalDisbursed",
                                        paid: "principalPaid",
                                        waived: "principalWaived",
                                        writtenOff: "principalWrittenOff",
                                        outstanding: "principalOutstanding",
                                        overdue: "principalOverdue"
                                    },
                                    {
                                        label: "Interest",
                                        original: "interestCharged",
                                        paid: "interestPaid",
                                        waived: "interestWaived",
                                        writtenOff: "interestWrittenOff",
                                        outstanding: "interestOutstanding",
                                        overdue: "interestOverdue"
                                    },
                                    {
                                        label: "Fees",
                                        original: "feeChargesCharged",
                                        paid: "feeChargesPaid",
                                        waived: "feeChargesWaived",
                                        writtenOff: "feeChargesWrittenOff",
                                        outstanding: "feeChargesOutstanding",
                                        overdue: "feeChargesOverdue"
                                    },
                                    {
                                        label: "Penalties",
                                        original: "penaltyChargesCharged",
                                        paid: "penaltyChargesPaid",
                                        waived: "penaltyChargesWaived",
                                        writtenOff: "penaltyChargesWrittenOff",
                                        outstanding: "penaltyChargesOutstanding",
                                        overdue: "penaltyChargesOverdue"
                                    },
                                    {
                                        label: "Total",
                                        original: "totalExpectedRepayment",
                                        paid: "totalRepayment",
                                        waived: "totalWaived",
                                        writtenOff: "totalWrittenOff",
                                        outstanding: "totalOutstanding",
                                        overdue: "totalOverdue"
                                    },
                                ].map(({label, original, paid, waived, writtenOff, outstanding, overdue}) => (
                                    <tr key={label}>
                                        <td>{label}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[original]?.toFixed(2) || "0.00"}`}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[paid]?.toFixed(2) || "0.00"}`}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[waived]?.toFixed(2) || "0.00"}`}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[writtenOff]?.toFixed(2) || "0.00"}`}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[outstanding]?.toFixed(2) || "0.00"}`}</td>
                                        <td>{`${loanDetails?.currency?.displaySymbol || ""} ${loanDetails?.summary?.[overdue]?.toFixed(2) || "0.00"}`}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        )}

                        {/* Loan Details Section */}
                        <div className="general-section general-groups-section">
                            <h3 className="general-section-title">Loan Details</h3>
                            <table className="general-charges-table general-vertical-table">
                                <tbody>
                                <tr>
                                    <td className="label">Disbursement Date</td>
                                    <td className="value">
                                        {loanDetails?.timeline?.actualDisbursementDate
                                            ? new Date(loanDetails.timeline.actualDisbursementDate.join("-")).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Loan Purpose</td>
                                    <td className="value">{loanDetails?.purpose || "Not Available"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Loan Officer</td>
                                    <td className="value">
                                        {loanDetails?.loanOfficerName || "Unassigned"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Currency</td>
                                    <td className="value">{loanDetails?.currency?.displaySymbol || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="label">External ID</td>
                                    <td className="value">{loanDetails?.clientExternalId || "-"}</td>
                                </tr>
                                <tr>
                                    <td className="label">Proposed Amount</td>
                                    <td className="value">
                                        {loanDetails?.proposedPrincipal
                                            ? `${loanDetails.currency.displaySymbol} ${loanDetails.proposedPrincipal}`
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                <td className="label">Approved Amount</td>
                                    <td className="value">
                                        {loanDetails?.approvedPrincipal
                                            ? `${loanDetails.currency.displaySymbol} ${loanDetails.approvedPrincipal}`
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Disbursed Amount</td>
                                    <td className="value">
                                        {loanDetails?.netDisbursalAmount
                                            ? `${loanDetails.currency.displaySymbol} ${loanDetails.netDisbursalAmount}`
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Term</td>
                                    <td className="value">
                                        {loanDetails?.termFrequency
                                            ? `${loanDetails.termFrequency} ${loanDetails.termPeriodFrequencyType?.value}`
                                            : "Not Available"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Interest Rate</td>
                                    <td className="value">
                                        {loanDetails?.annualInterestRate
                                            ? `${loanDetails.annualInterestRate}%`
                                            : "Not Available"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Amortization</td>
                                    <td className="value">
                                        {loanDetails?.amortizationType?.value || "Not Available"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "accountDetails":
                return (
                    <div className="tab-content">
                        <table className="general-charges-table general-vertical-table">
                            <tbody>
                            <tr>
                                <td className="label">Repayment Strategy</td>
                                <td className="value">{loanDetails?.transactionProcessingStrategyName || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Repayments</td>
                                <td className="value">
                                    {`${loanDetails?.repaymentEvery || 0} ${loanDetails?.repaymentFrequencyType?.value || "N/A"}`}
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Amortization</td>
                                <td className="value">{loanDetails?.amortizationType?.value || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Equal Amortization</td>
                                <td className="value">{loanDetails?.isEqualAmortization ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td className="label">Interest</td>
                                <td className="value">{`${loanDetails?.annualInterestRate || 0}%`}</td>
                            </tr>
                            <tr>
                                <td className="label">Interest Type</td>
                                <td className="value">{loanDetails?.interestType?.value || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Grace: On Principal Payment</td>
                                <td className="value">{loanDetails?.graceOnPrincipalPayment || 0}</td>
                            </tr>
                            <tr>
                                <td className="label">Grace: On Interest Payment</td>
                                <td className="value">{loanDetails?.graceOnInterestPayment || 0}</td>
                            </tr>
                            <tr>
                                <td className="label">Grace on Arrears Ageing</td>
                                <td className="value">{loanDetails?.graceOnArrearsAgeing || 0}</td>
                            </tr>
                            <tr>
                                <td className="label">Enable Installment Level Delinquency</td>
                                <td className="value">{loanDetails?.enableInstallmentLevelDelinquency ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td className="label">Fund Source</td>
                                <td className="value">{loanDetails?.fundSource || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Interest Free Period</td>
                                <td className="value">{loanDetails?.interestFreePeriod || 0}</td>
                            </tr>
                            <tr>
                                <td className="label">Interest Calculation Period</td>
                                <td className="value">{loanDetails?.interestCalculationPeriodType?.value || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Allow Partial Interest Calculation with same as repayment</td>
                                <td className="value">{loanDetails?.allowPartialPeriodInterestCalculation ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td className="label">Submitted On</td>
                                <td className="value">
                                    {loanDetails?.timeline?.submittedOnDate
                                        ? new Date(loanDetails.timeline.submittedOnDate.join("-")).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Approved On</td>
                                <td className="value">
                                    {loanDetails?.timeline?.approvedOnDate
                                        ? new Date(loanDetails.timeline.approvedOnDate.join("-")).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Disbursed On</td>
                                <td className="value">
                                    {loanDetails?.timeline?.actualDisbursementDate
                                        ? new Date(loanDetails.timeline.actualDisbursementDate.join("-")).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Matures On</td>
                                <td className="value">
                                    {loanDetails?.timeline?.actualMaturityDate
                                        ? new Date(loanDetails.timeline.actualMaturityDate.join("-")).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="label">Recalculate Interest Based on New Terms</td>
                                <td className="value">{loanDetails?.isInterestRecalculationEnabled ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td className="label">Days in Year</td>
                                <td className="value">{loanDetails?.daysInYearType?.value || "N/A"}</td>
                            </tr>
                            <tr>
                                <td className="label">Days in Month</td>
                                <td className="value">{loanDetails?.daysInMonthType?.value || "N/A"}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
            case "repaymentSchedule":
                return (
                    <div className="tab-content">
                        <table className="repayment-schedule-table">
                            <thead>
                            <tr>
                                <th colSpan="3"></th>
                                <th colSpan="3">Loan Amount and Balance</th>
                                <th colSpan="4">Total Cost of Loan</th>
                                <th colSpan="3">Installment Totals</th>
                            </tr>
                            <tr>
                                <th>Serial</th>
                                <th>Days</th>
                                <th>Date</th>
                                <th>Paid Date</th>
                                <th>Balance of Loan</th>
                                <th>Principal Due</th>
                                <th>Interest</th>
                                <th>Fees</th>
                                <th>Penalties</th>
                                <th>Due</th>
                                <th>Paid in Advance</th>
                                <th>Late</th>
                                <th>Outstanding</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loanDetails?.repaymentSchedule?.periods.map((period, index) => {
                                const currentDate = period.dueDate
                                    ? new Date(period.dueDate.join("-"))
                                    : null;
                                const previousDate =
                                    index > 0
                                        ? new Date(
                                            loanDetails.repaymentSchedule.periods[
                                            index - 1
                                                ].dueDate.join("-")
                                        )
                                        : null;

                                const days =
                                    index === 0
                                        ? ""
                                        : previousDate && currentDate
                                            ? Math.floor(
                                                (currentDate - previousDate) /
                                                (1000 * 60 * 60 * 24)
                                            )
                                            : 0;

                                const outstanding =
                                    (period.principalDue || 0) +
                                    (period.interestDue || 0) +
                                    (period.feeChargesDue || 0) +
                                    (period.penaltyChargesDue || 0);

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{days}</td>
                                        <td>
                                            {currentDate
                                                ? currentDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }
                                                )
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {period.paidDate
                                                ? new Date(
                                                    period.paidDate.join("-")
                                                ).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {(period.principalLoanBalanceOutstanding || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.principalDue || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.interestDue || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.feeChargesDue || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.penaltyChargesDue || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.totalDueForPeriod || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.paidInAdvance || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {(period.latePayment || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td>
                                            {outstanding.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                            {/* Total Row */}
                            <tr className="total-row">
                                <td colSpan="5">Totals</td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.principalDue || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.interestDue || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.feeChargesDue || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.penaltyChargesDue || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.totalDueForPeriod || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.paidInAdvance || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) => total + (period.latePayment || 0),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                                <td>
                                    {loanDetails?.repaymentSchedule?.periods.reduce(
                                        (total, period) =>
                                            total +
                                            ((period.principalDue || 0) +
                                                (period.interestDue || 0) +
                                                (period.feeChargesDue || 0) +
                                                (period.penaltyChargesDue || 0)),
                                        0
                                    ).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
                            </tr>
                            </tbody>
                        </table>
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
                                    onChange={handlePageSizeChange}
                                    className="filter-dropdown"
                                >
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
                                <th>Office</th>
                                <th>Transaction Date</th>
                                <th>Transaction Type</th>
                                <th colSpan="5">Breakdown</th>
                                <th>Loan Balance</th>
                                <th>Actions</th>
                            </tr>
                            <tr>
                                <th colSpan="5"></th>
                                <th>Amount</th>
                                <th>Principal</th>
                                <th>Interest</th>
                                <th>Fees</th>
                                <th>Penalties</th>
                                <th colSpan="2"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentPageData.map((transaction, index) => (
                                <tr key={transaction.id}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.officeName}</td>
                                    <td>
                                        {transaction.date
                                            ? new Date(transaction.date.join("-")).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "N/A"}
                                    </td>
                                    <td>{transaction.type.value}</td>
                                    <td>{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.principalPortion.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.interestPortion.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.feeChargesPortion.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.penaltyChargesPortion.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.outstandingLoanBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>
                                        <div className="actions-dropdown">
                                            <div className="dropdown-btn">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                            <div className="dropdown-menu">
                                                <button>View Transaction</button>
                                                {transaction.type.disbursement && <button>View Journal Entries</button>}
                                                {transaction.type.accrual && (
                                                    <>
                                                        <button>Undo Transaction</button>
                                                        <button>View Receipts</button>
                                                        <button>View Journal Entries</button>
                                                    </>
                                                )}
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
                                <span>Page {currentPage} of {totalPages}</span>
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
            case "delinquencyTags":
                return (
                    <div className="tab-content">
                        <h4>Loan Delinquency tags</h4>
                        <div className="pause-button-tags">
                            <button
                                className="pause-delinquency-btn"
                                onClick={() => setIsDelinquencyModalOpen(true)}
                            >
                                Pause Delinquency Classification
                            </button>
                        </div>

                        {delinquencyActions.length > 0 ? (
                            <>
                                <h4>Loan Delinquency Actions</h4>
                                <table className="delinquency-table">
                                    <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Created On</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {delinquencyActions.map((action) => (
                                        <tr key={action.id}>
                                            <td>{action.action}</td>
                                            <td>
                                                {new Date(action.startDate.join("-")).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                {new Date(action.endDate.join("-")).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td>
                                                {new Date(action.createdOn).toLocaleString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td>{action.action === "PAUSE" ? null : "--"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <p></p>
                        )}

                        {/* Modal */}
                        {isDelinquencyModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Pause Delinquency Classification</h4>

                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="startDate" className="create-provisioning-criteria-label">
                                                Start Date <span>*</span>
                                            </label>
                                            <DatePicker
                                                id="startDate"
                                                selected={startDate ? new Date(startDate) : null}
                                                onChange={(date) => {
                                                    setStartDate(date.toISOString().split('T')[0]);
                                                    if (endDate && new Date(date) > new Date(endDate)) {
                                                        setEndDate(null);
                                                    }
                                                }}
                                                className="create-provisioning-criteria-input"
                                                placeholderText="Select Start Date"
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
                                            <label htmlFor="endDate" className="create-provisioning-criteria-label">
                                                End Date <span>*</span>
                                            </label>
                                            <DatePicker
                                                id="endDate"
                                                selected={endDate ? new Date(endDate) : null}
                                                onChange={(date) => setEndDate(date.toISOString().split('T')[0])}
                                                className="create-provisioning-criteria-input"
                                                placeholderText="Select End Date"
                                                dateFormat="MMMM d, yyyy"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                minDate={startDate ? new Date(startDate) : null}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsDelinquencyModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handlePauseDelinquency}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={!startDate || !endDate}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "loanCollateralDetails":
                return (
                    <div className="tab-content">
                        <h4>Loan Collateral Details</h4>
                        <div className="pause-button-tags">
                            <button
                                className="pause-delinquency-btn"
                                onClick={() => {
                                    fetchCollateralTemplate();
                                    setIsCollateralModalOpen(true);
                                }}
                            >
                                Add Collateral
                            </button>
                        </div>
                        {collaterals.length > 0 ? (
                            <table className="collateral-table">
                                <thead>
                                <tr>
                                    <th>Collateral Type</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {collaterals.map((collateral) => (
                                    <tr key={collateral.id}>
                                        <td>{collateral.type}</td>
                                        <td>{collateral.value}</td>
                                        <td>{collateral.description || "N/A"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p></p>
                        )}

                        {isCollateralModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Add Collateral</h4>

                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="collateralType" className="create-provisioning-criteria-label">
                                                Collateral Type <span>*</span>
                                            </label>
                                            <select
                                                id="collateralType"
                                                value={collateralType}
                                                onChange={(e) => setCollateralType(e.target.value)}
                                                className="create-provisioning-criteria-select"
                                                required
                                            >
                                                <option value="">-- Select Type --</option>
                                                {collateralTemplate.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="collateralValue" className="create-provisioning-criteria-label">
                                                Value <span>*</span>
                                            </label>
                                            <input
                                                id="collateralValue"
                                                type="number"
                                                className="create-provisioning-criteria-input"
                                                value={collateralValue}
                                                onChange={(e) => setCollateralValue(e.target.value)}
                                                placeholder="Enter collateral value"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="collateralDescription" className="create-provisioning-criteria-label">
                                                Description
                                            </label>
                                            <textarea
                                                id="collateralDescription"
                                                className="create-provisioning-criteria-textarea"
                                                value={collateralDescription}
                                                onChange={(e) => setCollateralDescription(e.target.value)}
                                                placeholder="Enter description (optional)"
                                            />
                                        </div>
                                    </div>

                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsCollateralModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddCollateral}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={!collateralType || !collateralValue}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "charges":
                return (
                    <div className="tab-content">
                        {loanDetails?.charges?.length > 0 ? (
                            <table className="delinquency-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Fee/Penalty</th>
                                    <th>Payment Due At</th>
                                    <th>Due As Of</th>
                                    <th>Calculation Type</th>
                                    <th>Due</th>
                                    <th>Paid</th>
                                    <th>Waived</th>
                                    <th>Outstanding</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loanDetails.charges.map((charge) => (
                                    <tr key={charge.id}>
                                        <td>{charge.name}</td>
                                        <td>{charge.penalty ? "Penalty" : "Fee"}</td>
                                        <td>{charge.chargeTimeType?.value || "N/A"}</td>
                                        <td>
                                            {charge.dueDate
                                                ? new Date(charge.dueDate.join("-")).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                                : "N/A"}
                                        </td>
                                        <td>{charge.chargeCalculationType?.value || "N/A"}</td>
                                        <td>
                                            {loanDetails.currency?.displaySymbol &&
                                                `${loanDetails.currency.displaySymbol} ${charge.amount.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </td>
                                        <td>
                                            {loanDetails.currency?.displaySymbol &&
                                                `${loanDetails.currency.displaySymbol} ${charge.amountPaid.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </td>
                                        <td>
                                            {loanDetails.currency?.displaySymbol &&
                                                `${loanDetails.currency.displaySymbol} ${charge.amountWaived.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </td>
                                        <td>
                                            {loanDetails.currency?.displaySymbol &&
                                                `${loanDetails.currency.displaySymbol} ${charge.amountOutstanding.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </td>
                                        <td className="charges-action-buttons">
                                            <button
                                                className="charges-action-button adjust-charge"
                                                onClick={() => handleAdjustCharge(charge)}
                                                title="Adjust Charge"
                                            >
                                                <FaToolbox className="charges-action-icon"/>
                                            </button>
                                            <button
                                                className="charges-action-button waive-charge"
                                                onClick={() => handleWaiveCharge(charge)}
                                                title="Waive Charge"
                                            >
                                                <FaExclamationTriangle className="charges-action-icon"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p></p>
                        )}
                    </div>
                );
            case "loanReschedules":
                return (
                    <div className="tab-content">
                        <div className="pause-button-tags">
                            <button
                                className="pause-delinquency-btn"
                                onClick={() => handleOpenRescheduleModal()}
                            >
                                Reschedule
                            </button>
                        </div>
                        {loanReschedules.length > 0 ? (
                            <table className="delinquency-table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>From Date</th>
                                    <th>Reason</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loanReschedules.map((reschedule, index) => (
                                    <tr key={reschedule.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {new Date(reschedule.fromDate).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </td>
                                        <td>{reschedule.reason || "N/A"}</td>
                                        <td>{reschedule.status || "Pending"}</td>
                                        <td>
                                            <button
                                                className="create-adhoc-query-submit"
                                                onClick={() =>
                                                    handleViewRescheduleDetails(reschedule)
                                                }
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p></p>
                        )}
                    </div>
                );
            case "loanDocuments":
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

                        {loanDocuments.length > 0 ? (
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
                                {loanDocuments.map((doc, index) => (
                                    <tr key={index}>
                                        <td>{doc.name}</td>
                                        <td>{doc.description || "N/A"}</td>
                                        <td>{doc.fileName}</td>
                                        <td>
                                            <button
                                                className="charges-action-button"
                                                onClick={() => window.open(doc.fileUrl, "_blank")}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p></p>
                        )}
                    </div>
                );
            case "notes":
                return (
                    <div className="general-section general-notes-section">
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
                                                onClick={() => console.log("Edit", instruction)}
                                            >
                                                <FaEdit className="charges-action-icon" />
                                            </button>
                                            <button
                                                className="charges-action-button waive-charge"
                                                onClick={() => console.log("Delete", instruction)}
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
            case "externalAssetOwner":
                return (
                    <div className="tab-content">
                        <div className="general-section-header">
                            {transfers.some(
                                (transfer) =>
                                    transfer.status === "PENDING" &&
                                    !transfers.some(
                                        (t) =>
                                            t.status === "CANCELLED" &&
                                            t.transferExternalId === transfer.transferExternalId
                                    )
                            ) ? (
                                <button
                                    className="create-provisioning-criteria-cancel"
                                    onClick={() => setIsCancelModalOpen(true)}
                                >
                                    Cancel Sell Loan
                                </button>
                            ) : (
                                <button
                                    className="create-provisioning-criteria-submit"
                                    onClick={() => setIsSellLoanModalOpen(true)}
                                >
                                    Sell Loan
                                </button>
                            )}
                        </div>
                        {transfers.length > 0 ? (
                            <table className="delinquency-table">
                                <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Effective From</th>
                                    <th>Owner External Id</th>
                                    <th>Transfer External Id</th>
                                    <th>Settlement Date</th>
                                    <th>Purchase Price Ratio</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transfers.map((transfer) => (
                                    <tr key={transfer.transferId}>
                                        <td>{transfer.status}</td>
                                        <td>{new Date(transfer.effectiveFrom).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</td>
                                        <td>{transfer.owner.externalId}</td>
                                        <td>{transfer.transferExternalId || "N/A"}</td>
                                        <td>{new Date(transfer.settlementDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</td>
                                        <td>{transfer.purchasePriceRatio}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data">No external asset transfers available.</p>
                        )}

                        {/* Sell Loan Modal */}
                        {isSellLoanModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Sell Loan</h4>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="settlementDate" className="create-provisioning-criteria-label">
                                                Settlement Date <span>*</span>
                                            </label>
                                            <DatePicker
                                                id="settlementDate"
                                                selected={sellLoanPayload.settlementDate}
                                                onChange={(date) => setSellLoanPayload((prev) => ({ ...prev, settlementDate: date }))}
                                                dateFormat="dd MMMM yyyy"
                                                className="create-provisioning-criteria-input"
                                                placeholderText="Select Date"
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="purchasePriceRatio" className="create-provisioning-criteria-label">
                                                Purchase Price Ratio <span>*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="purchasePriceRatio"
                                                value={sellLoanPayload.purchasePriceRatio}
                                                onChange={(e) =>
                                                    setSellLoanPayload((prev) => ({
                                                        ...prev,
                                                        purchasePriceRatio: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-holiday-row">
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="ownerExternalId" className="create-provisioning-criteria-label">
                                                Owner External Id <span>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="ownerExternalId"
                                                value={sellLoanPayload.ownerExternalId}
                                                onChange={(e) =>
                                                    setSellLoanPayload((prev) => ({
                                                        ...prev,
                                                        ownerExternalId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                        <div className="create-provisioning-criteria-group">
                                            <label htmlFor="transferExternalId" className="create-provisioning-criteria-label">
                                                Transfer External Id
                                            </label>
                                            <input
                                                type="text"
                                                id="transferExternalId"
                                                value={sellLoanPayload.transferExternalId}
                                                onChange={(e) =>
                                                    setSellLoanPayload((prev) => ({
                                                        ...prev,
                                                        transferExternalId: e.target.value,
                                                    }))
                                                }
                                                className="create-provisioning-criteria-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsSellLoanModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSellLoan}
                                            className="create-provisioning-criteria-confirm"
                                            disabled={
                                                !sellLoanPayload.settlementDate ||
                                                !sellLoanPayload.purchasePriceRatio ||
                                                !sellLoanPayload.ownerExternalId
                                            }
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cancel Sell Loan Modal */}
                        {isCancelModalOpen && (
                            <div className="create-provisioning-criteria-modal-overlay">
                                <div className="create-provisioning-criteria-modal-content">
                                    <h4 className="create-modal-title">Cancel Sell Loan</h4>
                                    <p className={'create-provisioning-criteria-label'}>
                                        Are you sure you want to cancel the asset transfer with the owner
                                        External Id {
                                        transfers.filter(
                                            (transfer) =>
                                                transfer.status === "PENDING" &&
                                                !transfers.some(
                                                    (t) =>
                                                        t.status === "CANCELLED" &&
                                                        t.transferExternalId === transfer.transferExternalId
                                                )
                                        )[0]?.owner?.externalId
                                    }?
                                    </p>
                                    <div className="create-provisioning-criteria-modal-actions">
                                        <button
                                            onClick={() => setIsCancelModalOpen(false)}
                                            className="create-provisioning-criteria-cancel"
                                        >
                                            No
                                        </button>
                                        <button
                                            onClick={handleCancelSellLoan}
                                            className="create-provisioning-criteria-confirm"
                                        >
                                            Yes
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

    const handleBreadcrumbNavigation = () => {
        navigate("/clients", {
            state: {
                clientId: clientId,
                clientName: clientDetails?.clientName || "Client Details",
                preventDuplicate: true,
            },
        });
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

    return (
        <div className="users-page-screen">
            <h2 className="users-page-head">
                <Link to="/clients" className="breadcrumb-link">Clients</Link>{' '}
                <span
                    className="breadcrumb-link"
                    onClick={handleBreadcrumbNavigation}
                >
                    . {' '} {loanDetails?.clientName || "Loan Details"}
                </span>{' '}
                . Loan Details
            </h2>
            <div className="client-details-header">
                <div className="client-image-section">
                    <img
                        src={loanImage}
                        alt="Client"
                        className="client-image"
                    />
                </div>

                <div className="client-info-section">
                    <ul className="client-info-list">
                        <li>
                            <span className="client-info-label">Loan Product:</span>
                            <span className="client-info-value">
                                    {loanDetails?.loanProductName || "N/A"} ({loanDetails?.status?.value || "Unknown"})
                                </span>
                        </li>
                        <li>
                            <span className="client-info-label">Client Name:</span>
                            <span className="client-info-value">
                                    {loanDetails?.clientName || "N/A"} ({loanDetails?.clientAccountNo || "N/A"})
                                </span>
                        </li>
                        {loanDetails?.inArrears && (
                            <>
                                <li>
                                    <span className="client-info-label">Past Due Days:</span>
                                    <span className="client-info-value">
                                            {loanDetails?.delinquent?.pastDueDays || "N/A"}
                                        </span>
                                </li>
                                <li>
                                    <span className="client-info-label">Delinquent Days:</span>
                                    <span className="client-info-value">
                                            {loanDetails?.delinquent?.pastDueDays || "N/A"}
                                        </span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="client-info-section">
                    <ul className="client-info-list">
                        <li>
                            <span className="client-info-label">Current Balance:</span>
                            <span className="client-info-value">
                                    {loanDetails?.currency?.displaySymbol} {loanDetails?.summary?.totalOutstanding || ""}
                                </span>
                        </li>
                        <li>
                            <span className="client-info-label">Arrears By:</span>
                            <span className="client-info-value">
                                {loanDetails?.currency?.displaySymbol} {loanDetails?.delinquent?.availableDisbursementAmount || "0"}
                            </span>
                        </li>
                        <li>
                            <span className="client-info-label">Arrears Since:</span>
                            <span className="client-info-value">
                                {loanDetails?.delinquent?.nextPaymentDueDate
                                    ? new Date(loanDetails.delinquent.nextPaymentDueDate.join("-")).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "N/A"}
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
                            <button className="dropdown-item" onClick={handleOpenAddChargeModal}>
                                Add Loan Charge
                            </button>
                            <button className="dropdown-item" onClick={handleOpenForeclosureModal}>
                                ForeClosure
                            </button>
                            <button className="dropdown-item" onClick={handleOpenRepaymentModal}>
                                Make Repayment
                            </button>
                            <button className="dropdown-item" onClick={handleOpenUndoDisbursalModal}>
                                Undo Disbursal
                            </button>
                            <button className="dropdown-item" onClick={handleOpenPrepayLoanModal}>
                                Prepay Loan
                            </button>
                            <button className="dropdown-item" onClick={handleOpenChargeOffModal}>
                                Charge-Off
                            </button>
                            <button className="dropdown-item" onClick={handleOpenReAgeModal}>
                                Re-Age
                            </button>
                            <button className="dropdown-item" onClick={handleOpenReAmortizeModal}>
                                Re-Amortize
                            </button>
                            <div className="dropdown-submenu">
                                <button
                                    className="dropdown-item submenu-toggle"
                                    onClick={() => handleSubmenuToggle("payments")}
                                >
                                    Payments <FaCaretRight className={'submenu-icon'}/>
                                </button>
                                {activeSubmenu === "payments" && (
                                    <div className="submenu-content">
                                        <button className="dropdown-item" onClick={handleOpenGoodwillCreditModal}>
                                            Goodwill Credit
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenPayoutRefundModal}>
                                            Payout Refund
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenMerchantRefundModal}>
                                            Merchant Issued Refund
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="dropdown-submenu">
                                <button
                                    className="dropdown-item submenu-toggle"
                                    onClick={() => handleSubmenuToggle("more")}
                                >
                                    More <FaCaretRight className={'submenu-icon'}/>
                                </button>
                                {activeSubmenu === "more" && (
                                    <div className="submenu-content">
                                        <button className="dropdown-item" onClick={handleOpenWaiveInterestModal}>
                                            Waive Interest
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenLoanRescheduleModal}>
                                            Reschedule
                                        </button>
                                        <button className="dropdown-item" onClick={openWriteOffModal}>
                                            Write Off
                                        </button>
                                        <button className="dropdown-item" onClick={openCloseRescheduledModal}>
                                            Close (as Rescheduled)
                                        </button>
                                        <button className="dropdown-item" onClick={openCloseModal}>
                                            Close
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenGuarantorsModal}>
                                            View Guarantors
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenCreateGuarantorModal}>
                                            Create Guarantor
                                        </button>
                                        <button className="dropdown-item" onClick={handleOpenRecoverFromGuarantorModal}>
                                            Recover From Guarantor
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
                        <FaCaretLeft/>
                    </button>
                )}
                <div className="client-details-tabs" ref={tabsContainerRef}>
                    {[
                        loanDetails?.status?.value?.toLowerCase()?.includes("approved")
                            ? [
                                "general",
                                "accountDetails",
                                "repaymentSchedule",
                                "loanCollateralDetails",
                                "charges",
                                "loanDocuments",
                                "notes",
                                "standingInstructions",
                            ]
                            : [
                                "general",
                                "accountDetails",
                                "repaymentSchedule",
                                "transactions",
                                "delinquencyTags",
                                "loanCollateralDetails",
                                "charges",
                                "loanReschedules",
                                "loanDocuments",
                                "notes",
                                "standingInstructions",
                                "externalAssetOwner",
                            ],
                    ]
                        .flat()
                        .map((tab) => (
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
                        <FaCaretRight/>
                    </button>
                )}
            </div>

            <div className="client-tab-content loan-details">{renderTabContent()}</div>

            {isAdjustmentModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Adjust Charge</h4>

                        {/* Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="adjustmentAmount" className="create-provisioning-criteria-label">
                                Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="adjustmentAmount"
                                value={adjustmentPayload.amount}
                                onChange={(e) =>
                                    setAdjustmentPayload((prev) => ({ ...prev, amount: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="externalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="externalId"
                                value={adjustmentPayload.externalId}
                                onChange={(e) =>
                                    setAdjustmentPayload((prev) => ({ ...prev, externalId: e.target.value }))
                                }
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
                                value={adjustmentPayload.paymentTypeId}
                                onChange={(e) =>
                                    setAdjustmentPayload((prev) => ({ ...prev, paymentTypeId: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {paymentTypeOptions.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Show Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showPaymentDetails" className="create-provisioning-criteria-label">
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

                        {/* Payment Details */}
                        {showPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={adjustmentPayload.accountNumber}
                                        onChange={(e) =>
                                            setAdjustmentPayload((prev) => ({ ...prev, accountNumber: e.target.value }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={adjustmentPayload.chequeNumber}
                                        onChange={(e) =>
                                            setAdjustmentPayload((prev) => ({ ...prev, chequeNumber: e.target.value }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={adjustmentPayload.routingCode}
                                        onChange={(e) =>
                                            setAdjustmentPayload((prev) => ({ ...prev, routingCode: e.target.value }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={adjustmentPayload.receiptNumber}
                                        onChange={(e) =>
                                            setAdjustmentPayload((prev) => ({ ...prev, receiptNumber: e.target.value }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={adjustmentPayload.bankNumber}
                                        onChange={(e) =>
                                            setAdjustmentPayload((prev) => ({ ...prev, bankNumber: e.target.value }))
                                        }
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
                                value={adjustmentPayload.note}
                                onChange={(e) =>
                                    setAdjustmentPayload((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setIsAdjustmentModalOpen(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitAdjustment}
                                className="create-provisioning-criteria-confirm"
                                disabled={!adjustmentPayload.amount || !adjustmentPayload.paymentTypeId}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isWaiveConfirmationOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <p className="create-provisioning-criteria-label">
                            Are you sure you want to waive this charge?</p>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={() => setIsWaiveConfirmationOpen(false)}>Cancel</button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleConfirmWaiveCharge}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            {isRescheduleModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Reschedule Loan</h4>

                        {/* Reschedule From Installment and Submitted On */}
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label
                                    htmlFor="rescheduleFromDate"
                                    className="create-provisioning-criteria-label"
                                >
                                    Reschedule From Installment On <span>*</span>
                                </label>
                                <DatePicker
                                    id="rescheduleFromDate"
                                    selected={rescheduleFromDate}
                                    onChange={(date) => setRescheduleFromDate(date)}
                                    className="create-provisioning-criteria-input"
                                    dateFormat="dd MMMM yyyy"
                                    placeholderText="Select Date"
                                    required
                                />
                            </div>
                        </div>

                        {/* Reason for Rescheduling */}
                        <div className="create-provisioning-criteria-group">
                            <label
                                htmlFor="rescheduleReason"
                                className="create-provisioning-criteria-label"
                            >
                                Reason for Rescheduling <span>*</span>
                            </label>
                            <select
                                id="rescheduleReason"
                                value={rescheduleReason}
                                onChange={(e) => setRescheduleReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            >
                                <option value="">Select Reason</option>
                                {rescheduleReasons.map((reason) => (
                                    <option key={reason.id} value={reason.id}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="create-provisioning-criteria-group">
                            <label
                                htmlFor="submittedOnDate"
                                className="create-provisioning-criteria-label"
                            >
                                Submitted On <span>*</span>
                            </label>
                            <DatePicker
                                id="submittedOnDate"
                                selected={submittedOnDate}
                                onChange={(date) => setSubmittedOnDate(date)}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                                placeholderText="Select Date"
                                required
                            />
                        </div>

                        {/* Comments */}
                        <div className="create-provisioning-criteria-group">
                            <label
                                htmlFor="rescheduleComments"
                                className="create-provisioning-criteria-label"
                            >
                                Comments
                            </label>
                            <textarea
                                id="rescheduleComments"
                                value={rescheduleComments}
                                onChange={(e) => setRescheduleComments(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Change Repayment Date Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showRepaymentDateField" className="create-provisioning-criteria-label">
                                Change Repayment Date
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showRepaymentDateField"
                                        checked={showRepaymentDateField}
                                        onChange={(e) => setShowRepaymentDateField(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {showRepaymentDateField && (
                                <div className="create-provisioning-criteria-group">
                                    <label
                                        htmlFor="installmentRescheduledTo"
                                        className="create-provisioning-criteria-label"
                                    >
                                        Installment Rescheduled To
                                    </label>
                                    <DatePicker
                                        id="installmentRescheduledTo"
                                        selected={installmentRescheduledTo}
                                        onChange={(date) => setInstallmentRescheduledTo(date)}
                                        className="create-provisioning-criteria-input"
                                        dateFormat="dd MMMM yyyy"
                                        placeholderText="Select Date"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Introduce Mid-term Grace Periods Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showGracePeriods" className="create-provisioning-criteria-label">
                                Introduce Mid-term Grace Periods
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showGracePeriods"
                                        checked={showGracePeriods}
                                        onChange={(e) => setShowGracePeriods(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {showGracePeriods && (
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label
                                            htmlFor="principalGracePeriods"
                                            className="create-provisioning-criteria-label"
                                        >
                                            Principal Grace Periods
                                        </label>
                                        <input
                                            type="number"
                                            id="principalGracePeriods"
                                            value={principalGracePeriods}
                                            onChange={(e) => setPrincipalGracePeriods(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label
                                            htmlFor="interestGracePeriods"
                                            className="create-provisioning-criteria-label"
                                        >
                                            Interest Grace Periods
                                        </label>
                                        <input
                                            type="number"
                                            id="interestGracePeriods"
                                            value={interestGracePeriods}
                                            onChange={(e) => setInterestGracePeriods(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Extend Repayment Period Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showExtendRepayment" className="create-provisioning-criteria-label">
                                Extend Repayment Period
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showExtendRepayment"
                                        checked={showExtendRepayment}
                                        onChange={(e) => setShowExtendRepayment(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {showExtendRepayment && (
                                <div className="create-provisioning-criteria-group">
                                    <label
                                        htmlFor="newRepayments"
                                        className="create-provisioning-criteria-label"
                                    >
                                        Number of New Repayments
                                    </label>
                                    <input
                                        type="number"
                                        id="newRepayments"
                                        value={newRepayments}
                                        onChange={(e) => setNewRepayments(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Adjust Interest Rates Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showAdjustInterestRates" className="create-provisioning-criteria-label">
                                Adjust Interest Rates for Remainder of Loan
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showAdjustInterestRates"
                                        checked={showAdjustInterestRates}
                                        onChange={(e) => setShowAdjustInterestRates(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {showAdjustInterestRates && (
                                <div className="create-provisioning-criteria-group">
                                    <label
                                        htmlFor="newInterestRate"
                                        className="create-provisioning-criteria-label"
                                    >
                                        New Interest Rate
                                    </label>
                                    <input
                                        type="number"
                                        id="newInterestRate"
                                        value={newInterestRate}
                                        onChange={(e) => setNewInterestRate(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={() => setIsRescheduleModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitReschedule}
                                disabled={!rescheduleFromDate || !rescheduleReason || !submittedOnDate}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isUploadModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Upload Document</h4>

                        {/* File Name */}
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

                        {/* Description */}
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

                        {/* File Select */}
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

                        {/* Modal Actions */}
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
            {isAddChargeModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Add Loan Charge</h4>

                        {/* Charge Dropdown */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Charge <span>*</span>
                            </label>
                            <select
                                value={formData.chargeId}
                                onChange={(e) => handleChargeSelect(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            >
                                <option value="" disabled>
                                    Select Charge
                                </option>
                                {chargeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Amount Field */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.amount}
                                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* Charge Calculation and Time (Disabled Fields) */}
                        {selectedCharge && (
                            <>
                                <div className="create-provisioning-criteria-group">
                                    <label className="create-provisioning-criteria-label">Charge Calculation</label>
                                    <input
                                        type="text"
                                        value={selectedCharge.chargeCalculationType.value}
                                        className="create-provisioning-criteria-input"
                                        disabled
                                    />
                                </div>
                                <div className="create-provisioning-criteria-group">
                                    <label className="create-provisioning-criteria-label">Charge Time</label>
                                    <input
                                        type="text"
                                        value={selectedCharge.chargeTimeType.value}
                                        className="create-provisioning-criteria-input"
                                        disabled
                                    />
                                </div>
                            </>
                        )}

                        {selectedCharge?.chargeTimeType.value === "Specified due date" && (
                            <div className="create-provisioning-criteria-group">
                                <label className="create-provisioning-criteria-label">
                                    Due On <span>*</span>
                                </label>
                                <DatePicker
                                    selected={formData.dueDate}
                                    onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                                    minDate={new Date()}
                                    className="create-provisioning-criteria-input"
                                    dateFormat="dd MMMM yyyy"
                                    placeholderText="Select a date"
                                />
                            </div>
                        )}

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button className="create-provisioning-criteria-cancel" onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmit}
                                disabled={
                                    !formData.chargeId ||
                                    !formData.amount ||
                                    (selectedCharge?.chargeTimeType.value === "Specified due date" && !formData.dueDate) ||
                                    isSubmitting
                                }
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isForeclosureModalOpen && foreclosureData && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Foreclosure</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                selected={foreclosureForm.transactionDate}
                                onChange={(date) =>
                                    setForeclosureForm((prev) => ({ ...prev, transactionDate: date }))
                                }
                                minDate={new Date()}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                                placeholderText="Select a date"
                            />
                        </div>
                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Note <span>*</span>
                            </label>
                            <textarea
                                value={foreclosureForm.note}
                                onChange={(e) =>
                                    setForeclosureForm((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseForeclosureModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitForeclosure}
                                disabled={!foreclosureForm.transactionDate || !foreclosureForm.note || isSubmittingForeclosure}
                            >
                                {isSubmittingForeclosure ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isRepaymentModalOpen && repaymentData && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Make Repayment</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                selected={repaymentForm.transactionDate}
                                onChange={(date) =>
                                    setRepaymentForm((prev) => ({ ...prev, transactionDate: date }))
                                }
                                maxDate={new Date()}
                                className="create-provisioning-criteria-input"
                                dateFormat="dd MMMM yyyy"
                            />
                        </div>

                        {/* Repayment Breakdown */}
                        <div className="create-holiday-row">
                            <ul className="repayment-summary-list">
                                <li className="create-provisioning-criteria-label">
                                    Principal: {repaymentData.principalPortion.toLocaleString()}
                                </li>
                                <li className="create-provisioning-criteria-label">
                                    Interest: {repaymentData.interestPortion.toLocaleString()}
                                </li>
                                <li className="create-provisioning-criteria-label">
                                    Fees: {repaymentData.feeChargesPortion.toLocaleString()}
                                </li>
                                <li className="create-provisioning-criteria-label">
                                    Penalties: {repaymentData.penaltyChargesPortion.toLocaleString()}
                                </li>
                            </ul>
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                value={repaymentForm.transactionAmount}
                                onChange={(e) =>
                                    setRepaymentForm((prev) => ({ ...prev, transactionAmount: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">External ID</label>
                            <input
                                type="text"
                                value={repaymentForm.externalId}
                                onChange={(e) =>
                                    setRepaymentForm((prev) => ({ ...prev, externalId: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                value={repaymentForm.selectedPaymentType}
                                onChange={(e) =>
                                    setRepaymentForm((prev) => ({ ...prev, selectedPaymentType: e.target.value }))
                                }
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

                        {/* Show Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={repaymentForm.showPaymentDetails}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                showPaymentDetails: e.target.checked,
                                            }))
                                        }
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details Fields */}
                        {repaymentForm.showPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={repaymentForm.accountNumber}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                accountNumber: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={repaymentForm.chequeNumber}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                chequeNumber: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={repaymentForm.routingCode}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                routingCode: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={repaymentForm.receiptNumber}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                receiptNumber: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={repaymentForm.bankNumber}
                                        onChange={(e) =>
                                            setRepaymentForm((prev) => ({
                                                ...prev,
                                                bankNumber: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">Note</label>
                            <textarea
                                value={repaymentForm.note}
                                onChange={(e) =>
                                    setRepaymentForm((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseRepaymentModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitRepayment}
                                disabled={
                                    !repaymentForm.transactionDate ||
                                    !repaymentForm.transactionAmount ||
                                    !repaymentForm.selectedPaymentType ||
                                    isSubmittingRepayment
                                }
                            >
                                {isSubmittingRepayment ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isUndoDisbursalModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Undo Disbursal</h4>

                        {/* Note Field */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="undoDisbursalNote" className="create-provisioning-criteria-label">
                                Note <span>*</span>
                            </label>
                            <textarea
                                id="undoDisbursalNote"
                                value={undoDisbursalNote}
                                onChange={(e) => setUndoDisbursalNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                                placeholder="Enter a note"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseUndoDisbursalModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitUndoDisbursal}
                                disabled={!undoDisbursalNote.trim() || isSubmittingUndoDisbursal}
                            >
                                {isSubmittingUndoDisbursal ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPrepayLoanModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Prepay Loan</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="prepayLoanDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="prepayLoanDate"
                                selected={prepayLoanDate}
                                onChange={(date) => setPrepayLoanDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Summary */}
                        <div className="create-holiday-row">
                            <ul className="repayment-summary-list">
                                <li className="create-provisioning-criteria-label">
                                    Principal: {prepayLoanData.principalPortion?.toLocaleString()}
                                </li>
                                <li className="create-provisioning-criteria-label">
                                    Interest: {prepayLoanData.interestPortion?.toLocaleString()}
                                </li>
                                <li className="create-provisioning-criteria-label">
                                    Fees: {prepayLoanData.feeChargesPortion?.toLocaleString()}
                                </li>
                            </ul>
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="prepayTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="prepayTransactionAmount"
                                value={prepayTransactionAmount}
                                onChange={(e) => setPrepayTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="prepayExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="prepayExternalId"
                                value={prepayExternalId}
                                onChange={(e) => setPrepayExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="prepayPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="prepayPaymentType"
                                value={prepayPaymentType}
                                onChange={(e) => setPrepayPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {prepayLoanData.paymentTypeOptions?.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="showPrepayPaymentDetails" className="create-provisioning-criteria-label">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showPrepayPaymentDetails"
                                        checked={showPrepayPaymentDetails}
                                        onChange={(e) => setShowPrepayPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {showPrepayPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={prepayAccount}
                                        onChange={(e) => setPrepayAccount(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={prepayCheque}
                                        onChange={(e) => setPrepayCheque(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={prepayRoutingCode}
                                        onChange={(e) => setPrepayRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={prepayReceipt}
                                        onChange={(e) => setPrepayReceipt(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={prepayBank}
                                        onChange={(e) => setPrepayBank(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="prepayNote" className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                id="prepayNote"
                                value={prepayNote}
                                onChange={(e) => setPrepayNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleClosePrepayLoanModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitPrepayLoan}
                                disabled={
                                    !prepayTransactionAmount || !prepayPaymentType || !prepayNote.trim()
                                }
                            >
                                {isSubmittingPrepayLoan ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isChargeOffModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Charge-Off</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="chargeOffDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="chargeOffDate"
                                selected={chargeOffDate}
                                onChange={(date) => setChargeOffDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Reason for Charge-Off */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="chargeOffReason" className="create-provisioning-criteria-label">
                                Reason for Charge-Off <span>*</span>
                            </label>
                            <select
                                id="chargeOffReason"
                                value={chargeOffReason}
                                onChange={(e) => setChargeOffReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Reason</option>
                                {chargeOffData.chargeOffReasonOptions?.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="chargeOffExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="chargeOffExternalId"
                                value={chargeOffExternalId}
                                onChange={(e) => setChargeOffExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="chargeOffNote" className="create-provisioning-criteria-label">
                                Note <span>*</span>
                            </label>
                            <textarea
                                id="chargeOffNote"
                                value={chargeOffNote}
                                onChange={(e) => setChargeOffNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseChargeOffModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitChargeOff}
                                disabled={!chargeOffDate || !chargeOffReason || !chargeOffNote.trim()}
                            >
                                {isSubmittingChargeOff ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isReAgeModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Re-Age Loan</h4>

                        {/* Number of Installments */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeInstallments" className="create-provisioning-criteria-label">
                                Number of Installments <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="reAgeInstallments"
                                value={reAgeInstallments}
                                onChange={(e) => setReAgeInstallments(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* Frequency Number */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeFrequencyNumber" className="create-provisioning-criteria-label">
                                Frequency Number <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="reAgeFrequencyNumber"
                                value={reAgeFrequencyNumber}
                                onChange={(e) => setReAgeFrequencyNumber(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* Frequency Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeFrequencyType" className="create-provisioning-criteria-label">
                                Frequency Type <span>*</span>
                            </label>
                            <select
                                id="reAgeFrequencyType"
                                value={reAgeFrequencyType}
                                onChange={(e) => setReAgeFrequencyType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Frequency Type</option>
                            </select>
                        </div>

                        {/* Start Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeStartDate" className="create-provisioning-criteria-label">
                                Start Date <span>*</span>
                            </label>
                            <DatePicker
                                id="reAgeStartDate"
                                selected={reAgeStartDate}
                                onChange={(date) => setReAgeStartDate(date)}
                                minDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Reason */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeReason" className="create-provisioning-criteria-label">
                                Reason
                            </label>
                            <textarea
                                id="reAgeReason"
                                value={reAgeReason}
                                onChange={(e) => setReAgeReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAgeExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="reAgeExternalId"
                                value={reAgeExternalId}
                                onChange={(e) => setReAgeExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                className="create-provisioning-criteria-cancel"
                                onClick={handleCloseReAgeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="create-provisioning-criteria-confirm"
                                onClick={handleSubmitReAge}
                                disabled={
                                    !reAgeInstallments ||
                                    !reAgeFrequencyNumber ||
                                    !reAgeFrequencyType ||
                                    !reAgeStartDate
                                }
                            >
                                {isSubmittingReAge ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isReAmortizeModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Re-Amortize Loan</h4>

                        {/* Reason */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAmortizeReason" className="create-provisioning-criteria-label">
                                Reason <span>*</span>
                            </label>
                            <textarea
                                id="reAmortizeReason"
                                value={reAmortizeReason}
                                onChange={(e) => setReAmortizeReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                                required
                            />
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="reAmortizeExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="reAmortizeExternalId"
                                value={reAmortizeExternalId}
                                onChange={(e) => setReAmortizeExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseReAmortizeModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitReAmortize}
                                className="create-provisioning-criteria-confirm"
                                disabled={!reAmortizeReason}
                            >
                                {isSubmittingReAmortize ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isGoodwillCreditModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Goodwill Credit</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="goodwillTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="goodwillTransactionDate"
                                selected={goodwillTransactionDate}
                                onChange={(date) => setGoodwillTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="goodwillTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="goodwillTransactionAmount"
                                value={goodwillTransactionAmount}
                                onChange={(e) => setGoodwillTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="goodwillPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="goodwillPaymentType"
                                value={goodwillSelectedPaymentType}
                                onChange={(e) => setGoodwillSelectedPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {goodwillPaymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="goodwillExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="goodwillExternalId"
                                value={goodwillExternalId}
                                onChange={(e) => setGoodwillExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showGoodwillPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showGoodwillPaymentDetails"
                                        checked={showGoodwillPaymentDetails}
                                        onChange={(e) => setShowGoodwillPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {showGoodwillPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={goodwillAccountNumber}
                                        onChange={(e) => setGoodwillAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={goodwillChequeNumber}
                                        onChange={(e) => setGoodwillChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={goodwillRoutingCode}
                                        onChange={(e) => setGoodwillRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={goodwillReceiptNumber}
                                        onChange={(e) => setGoodwillReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={goodwillBankNumber}
                                        onChange={(e) => setGoodwillBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="goodwillNote">Note</label>
                            <textarea
                                id="goodwillNote"
                                value={goodwillNote}
                                onChange={(e) => setGoodwillNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseGoodwillCreditModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitGoodwillCredit}
                                className="create-provisioning-criteria-confirm"
                                disabled={!goodwillTransactionDate || !goodwillTransactionAmount || !goodwillSelectedPaymentType}
                            >
                                {isSubmittingGoodwillCredit ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isPayoutRefundModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Payout Refund</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="payoutTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="payoutTransactionDate"
                                selected={payoutTransactionDate}
                                onChange={(date) => setPayoutTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="payoutTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="payoutTransactionAmount"
                                value={payoutTransactionAmount}
                                onChange={(e) => setPayoutTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="payoutPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="payoutPaymentType"
                                value={payoutSelectedPaymentType}
                                onChange={(e) => setPayoutSelectedPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {payoutPaymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="payoutExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="payoutExternalId"
                                value={payoutExternalId}
                                onChange={(e) => setPayoutExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showPayoutPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showPayoutPaymentDetails"
                                        checked={showPayoutPaymentDetails}
                                        onChange={(e) => setShowPayoutPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {showPayoutPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={payoutAccountNumber}
                                        onChange={(e) => setPayoutAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={payoutChequeNumber}
                                        onChange={(e) => setPayoutChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={payoutRoutingCode}
                                        onChange={(e) => setPayoutRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={payoutReceiptNumber}
                                        onChange={(e) => setPayoutReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={payoutBankNumber}
                                        onChange={(e) => setPayoutBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="payoutNote">Note</label>
                            <textarea
                                id="payoutNote"
                                value={payoutNote}
                                onChange={(e) => setPayoutNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleClosePayoutRefundModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitPayoutRefund}
                                className="create-provisioning-criteria-confirm"
                                disabled={!payoutTransactionDate || !payoutTransactionAmount || !payoutSelectedPaymentType}
                            >
                                {isSubmittingPayoutRefund ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isMerchantRefundModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Merchant Issued Refund</h4>

                        {/* Transaction Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="merchantTransactionDate" className="create-provisioning-criteria-label">
                                Transaction Date <span>*</span>
                            </label>
                            <DatePicker
                                id="merchantTransactionDate"
                                selected={merchantTransactionDate}
                                onChange={(date) => setMerchantTransactionDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="merchantTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="merchantTransactionAmount"
                                value={merchantTransactionAmount}
                                onChange={(e) => setMerchantTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Type */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="merchantPaymentType" className="create-provisioning-criteria-label">
                                Payment Type <span>*</span>
                            </label>
                            <select
                                id="merchantPaymentType"
                                value={merchantSelectedPaymentType}
                                onChange={(e) => setMerchantSelectedPaymentType(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Payment Type</option>
                                {merchantPaymentTypeOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* External ID */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="merchantExternalId" className="create-provisioning-criteria-label">
                                External ID
                            </label>
                            <input
                                type="text"
                                id="merchantExternalId"
                                value={merchantExternalId}
                                onChange={(e) => setMerchantExternalId(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Payment Details Toggle */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="showMerchantPaymentDetails">
                                Show Payment Details
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="showMerchantPaymentDetails"
                                        checked={showMerchantPaymentDetails}
                                        onChange={(e) => setShowMerchantPaymentDetails(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Payment Details */}
                        {showMerchantPaymentDetails && (
                            <>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Account #"
                                        value={merchantAccountNumber}
                                        onChange={(e) => setMerchantAccountNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cheque #"
                                        value={merchantChequeNumber}
                                        onChange={(e) => setMerchantChequeNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Routing Code"
                                        value={merchantRoutingCode}
                                        onChange={(e) => setMerchantRoutingCode(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-holiday-row">
                                    <input
                                        type="text"
                                        placeholder="Receipt #"
                                        value={merchantReceiptNumber}
                                        onChange={(e) => setMerchantReceiptNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Bank #"
                                        value={merchantBankNumber}
                                        onChange={(e) => setMerchantBankNumber(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            </>
                        )}

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="merchantNote">Note</label>
                            <textarea
                                id="merchantNote"
                                value={merchantNote}
                                onChange={(e) => setMerchantNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseMerchantRefundModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitMerchantRefund}
                                className="create-provisioning-criteria-confirm"
                                disabled={!merchantTransactionDate || !merchantTransactionAmount || !merchantSelectedPaymentType}
                            >
                                {isSubmittingMerchantRefund ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isWaiveInterestModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Waive Interest</h4>

                        {/* Interest Waived On */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="waiveInterestDate" className="create-provisioning-criteria-label">
                                Interest Waived On <span>*</span>
                            </label>
                            <DatePicker
                                id="waiveInterestDate"
                                selected={waiveInterestDate}
                                onChange={(date) => setWaiveInterestDate(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Transaction Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="waiveTransactionAmount" className="create-provisioning-criteria-label">
                                Transaction Amount <span>*</span>
                            </label>
                            <input
                                type="number"
                                id="waiveTransactionAmount"
                                value={waiveTransactionAmount}
                                onChange={(e) => setWaiveTransactionAmount(e.target.value)}
                                className="create-provisioning-criteria-input"
                                disabled
                            />
                        </div>

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="waiveInterestNote">
                                Note
                            </label>
                            <textarea
                                id="waiveInterestNote"
                                value={waiveInterestNote}
                                onChange={(e) => setWaiveInterestNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseWaiveInterestModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitWaiveInterest}
                                className="create-provisioning-criteria-confirm"
                                disabled={!waiveInterestDate || !waiveTransactionAmount}
                            >
                                {isSubmittingWaiveInterest ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isLoanRescheduleModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Reschedule Loan</h4>

                        {/* Reschedule From Installment On */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanRescheduleFromInstallment">
                                Reschedule From Installment On <span>*</span>
                            </label>
                            <DatePicker
                                id="loanRescheduleFromInstallment"
                                selected={loanRescheduleFromInstallment}
                                onChange={(date) => setLoanRescheduleFromInstallment(date)}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Reason for Rescheduling */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanRescheduleReason">
                                Reason for Rescheduling <span>*</span>
                            </label>
                            <select
                                id="loanRescheduleReason"
                                value={loanRescheduleReason}
                                onChange={(e) => setLoanRescheduleReason(e.target.value)}
                                className="create-provisioning-criteria-input"
                            >
                                <option value="">Select Reason</option>
                                {loanRescheduleReasons.map((reason) => (
                                    <option key={reason.id} value={reason.id}>
                                        {reason.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submitted On */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanSubmittedOn">
                                Submitted On <span>*</span>
                            </label>
                            <DatePicker
                                id="loanSubmittedOn"
                                selected={loanSubmittedOn}
                                onChange={(date) => setLoanSubmittedOn(date)}
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Comments */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanRescheduleComments">
                                Comments
                            </label>
                            <textarea
                                id="loanRescheduleComments"
                                value={loanRescheduleComments}
                                onChange={(e) => setLoanRescheduleComments(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Change Repayment Date */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanChangeRepaymentDate">
                                Change Repayment Date
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="loanChangeRepaymentDate"
                                        checked={loanChangeRepaymentDate}
                                        onChange={(e) => setLoanChangeRepaymentDate(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {loanChangeRepaymentDate && (
                                <div className="create-provisioning-criteria-group">
                                    <label className="create-provisioning-criteria-label" htmlFor="loanInstallmentRescheduledTo">
                                        Installment Rescheduled To <span>*</span>
                                    </label>
                                    <DatePicker
                                        id="loanInstallmentRescheduledTo"
                                        selected={loanInstallmentRescheduledTo}
                                        onChange={(date) => setLoanInstallmentRescheduledTo(date)}
                                        dateFormat="dd MMMM yyyy"
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Introduce Mid-Term Grace Periods */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanMidTermGracePeriods">
                                Introduce Mid-Term Grace Periods
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="loanMidTermGracePeriods"
                                        checked={loanMidTermGracePeriods}
                                        onChange={(e) => setLoanMidTermGracePeriods(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {loanMidTermGracePeriods && (
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label" htmlFor="loanPrincipalGracePeriods">
                                            Principal Grace Periods
                                        </label>
                                        <input
                                            type="number"
                                            id="loanPrincipalGracePeriods"
                                            value={loanPrincipalGracePeriods}
                                            onChange={(e) => setLoanPrincipalGracePeriods(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label className="create-provisioning-criteria-label" htmlFor="loanInterestGracePeriods">
                                            Interest Grace Periods
                                        </label>
                                        <input
                                            type="number"
                                            id="loanInterestGracePeriods"
                                            value={loanInterestGracePeriods}
                                            onChange={(e) => setLoanInterestGracePeriods(e.target.value)}
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Extend Repayment Period */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanExtendRepaymentPeriod">
                                Extend Repayment Period
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="loanExtendRepaymentPeriod"
                                        checked={loanExtendRepaymentPeriod}
                                        onChange={(e) => setLoanExtendRepaymentPeriod(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {loanExtendRepaymentPeriod && (
                                <div className="create-provisioning-criteria-group">
                                    <label className="create-provisioning-criteria-label" htmlFor="loanNumberOfNewRepayments">
                                        Number of New Repayments
                                    </label>
                                    <input
                                        type="number"
                                        id="loanNumberOfNewRepayments"
                                        value={loanNumberOfNewRepayments}
                                        onChange={(e) => setLoanNumberOfNewRepayments(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Adjust Interest Rates */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label" htmlFor="loanAdjustInterestRates">
                                Adjust Interest Rates for Remainder of Loan
                            </label>
                            <div className="switch-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        id="loanAdjustInterestRates"
                                        checked={loanAdjustInterestRates}
                                        onChange={(e) => setLoanAdjustInterestRates(e.target.checked)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            {loanAdjustInterestRates && (
                                <div className="create-provisioning-criteria-group">
                                    <label className="create-provisioning-criteria-label" htmlFor="loanNewInterestRate">
                                        New Interest Rate
                                    </label>
                                    <input
                                        type="number"
                                        id="loanNewInterestRate"
                                        value={loanNewInterestRate}
                                        onChange={(e) => setLoanNewInterestRate(e.target.value)}
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseLoanRescheduleModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitLoanReschedule}
                                className="create-provisioning-criteria-confirm"
                                disabled={!loanRescheduleFromInstallment || !loanRescheduleReason || !loanSubmittedOn}
                            >
                                {isSubmittingLoanReschedule ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isWriteOffModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Write Off Loan</h4>

                        {/* Write-Off Date */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="writeOffDate" className="create-provisioning-criteria-label">
                                Write Off On <span>*</span>
                            </label>
                            <DatePicker
                                id="writeOffDate"
                                selected={writeOffData.writeOffDate}
                                onChange={(date) =>
                                    setWriteOffData((prev) => ({ ...prev, writeOffDate: date }))
                                }
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Amount */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Amount
                            </label>
                            <input
                                type="text"
                                value={writeOffData.amount.toLocaleString()}
                                readOnly
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                value={writeOffData.note}
                                onChange={(e) =>
                                    setWriteOffData((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseWriteOffModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitWriteOff}
                                className="create-provisioning-criteria-confirm"
                                disabled={!writeOffData.note}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCloseRescheduledModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Close (as Rescheduled)</h4>

                        {/* Closed On */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="closedOn" className="create-provisioning-criteria-label">
                                Closed On <span>*</span>
                            </label>
                            <DatePicker
                                id="closedOn"
                                selected={closeRescheduledData.closedOn}
                                onChange={(date) =>
                                    setCloseRescheduledData((prev) => ({ ...prev, closedOn: date }))
                                }
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="note" className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={closeRescheduledData.note}
                                onChange={(e) =>
                                    setCloseRescheduledData((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseCloseRescheduledModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitCloseRescheduled}
                                className="create-provisioning-criteria-confirm"
                                disabled={!closeRescheduledData.closedOn || !closeRescheduledData.note}
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
                        <h4 className="create-modal-title">Close Loan</h4>

                        {/* Closed On */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="closedOn" className="create-provisioning-criteria-label">
                                Closed On <span>*</span>
                            </label>
                            <DatePicker
                                id="closedOn"
                                selected={closeData.closedOn}
                                onChange={(date) =>
                                    setCloseData((prev) => ({ ...prev, closedOn: date }))
                                }
                                maxDate={new Date()}
                                dateFormat="dd MMMM yyyy"
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Note */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="note" className="create-provisioning-criteria-label">
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={closeData.note}
                                onChange={(e) =>
                                    setCloseData((prev) => ({ ...prev, note: e.target.value }))
                                }
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
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
                                disabled={!closeData.closedOn || !closeData.note}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isGuarantorsModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Guarantors Details</h4>

                        {guarantorsDetails.length > 0 ? (
                            <div>
                                <table className="guarantors-details-table">
                                    <thead>
                                    <tr>
                                        <th>Guarantor Name</th>
                                        <th>Relationship</th>
                                        <th>Amount Guaranteed</th>
                                        <th>Contact</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {guarantorsDetails.map((guarantor, index) => (
                                        <tr key={index}>
                                            <td>{guarantor.fullName || "N/A"}</td>
                                            <td>{guarantor.relationship || "N/A"}</td>
                                            <td>
                                                {guarantor.amount || 0} {guarantor.currency?.displaySymbol || ""}
                                            </td>
                                            <td>{guarantor.contactNumber || "N/A"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>No guarantors available.</p>
                        )}

                        {/* Note Field */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="guarantorsNote" className="create-provisioning-criteria-label">
                                Note <span>*</span>
                            </label>
                            <textarea
                                id="guarantorsNote"
                                value={guarantorsNote}
                                onChange={(e) => setGuarantorsNote(e.target.value)}
                                className="create-provisioning-criteria-input"
                            />
                        </div>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseGuarantorsModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitGuarantorsNote}
                                className="create-provisioning-criteria-confirm"
                                disabled={!guarantorsNote || isSubmittingGuarantors}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isCreateGuarantorModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Create Guarantor</h4>

                        {/* Existing Client Checkbox */}
                        <div className="create-provisioning-criteria-group">
                            <label htmlFor="existingClient" className="create-provisioning-criteria-label">
                                Existing Client
                            </label>
                            <input
                                type="checkbox"
                                id="existingClient"
                                checked={isExistingClient}
                                onChange={(e) => setIsExistingClient(e.target.checked)}
                            />
                        </div>

                        {isExistingClient ? (
                            <>
                                {/* Existing Client Fields */}
                                <div className="create-provisioning-criteria-group">
                                    <label htmlFor="existingClientName" className="create-provisioning-criteria-label">
                                        Name <span>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="existingClientName"
                                        value={guarantorDetails.existingClientName}
                                        onChange={(e) =>
                                            setGuarantorDetails((prev) => ({
                                                ...prev,
                                                existingClientName: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>
                                <div className="create-provisioning-criteria-group">
                                    <label htmlFor="relationship" className="create-provisioning-criteria-label">
                                        Relationship <span>*</span>
                                    </label>
                                    <select
                                        id="relationship"
                                        value={guarantorDetails.relationship}
                                        onChange={(e) =>
                                            setGuarantorDetails((prev) => ({
                                                ...prev,
                                                relationship: e.target.value,
                                            }))
                                        }
                                        className="create-provisioning-criteria-input"
                                    >
                                        <option value="">Select Relationship</option>
                                        {guarantorRelationshipOptions.map((option) => (
                                            <option key={option.id} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* New Guarantor Fields */}
                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="firstName" className="create-provisioning-criteria-label">
                                            First Name <span>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={guarantorDetails.firstName}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    firstName: e.target.value,
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
                                            value={guarantorDetails.lastName}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    lastName: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>

                                <div className="create-provisioning-criteria-group">
                                    <label htmlFor="dateOfBirth" className="create-provisioning-criteria-label">
                                        Date of Birth
                                    </label>
                                    <DatePicker
                                        selected={guarantorDetails.dateOfBirth}
                                        onChange={(date) =>
                                            setGuarantorDetails((prev) => ({
                                                ...prev,
                                                dateOfBirth: date,
                                            }))
                                        }
                                        dateFormat="dd MMMM yyyy"
                                        className="create-provisioning-criteria-input"
                                    />
                                </div>

                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="address1" className="create-provisioning-criteria-label">
                                            Address 1
                                        </label>
                                        <input
                                            type="text"
                                            id="address1"
                                            value={guarantorDetails.address1}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    address1: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="address2" className="create-provisioning-criteria-label">
                                            Address 2
                                        </label>
                                        <input
                                            type="text"
                                            id="address2"
                                            value={guarantorDetails.address2}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    address2: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>

                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="city" className="create-provisioning-criteria-label">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={guarantorDetails.city}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    city: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="zip" className="create-provisioning-criteria-label">
                                            Zip
                                        </label>
                                        <input
                                            type="text"
                                            id="zip"
                                            value={guarantorDetails.zip}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    zip: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>

                                <div className="create-holiday-row">
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="mobile" className="create-provisioning-criteria-label">
                                            Mobile
                                        </label>
                                        <input
                                            type="text"
                                            id="mobile"
                                            value={guarantorDetails.mobile}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    mobile: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                    <div className="create-provisioning-criteria-group">
                                        <label htmlFor="residencePhone" className="create-provisioning-criteria-label">
                                            Residence Phone
                                        </label>
                                        <input
                                            type="text"
                                            id="residencePhone"
                                            value={guarantorDetails.residencePhone}
                                            onChange={(e) =>
                                                setGuarantorDetails((prev) => ({
                                                    ...prev,
                                                    residencePhone: e.target.value,
                                                }))
                                            }
                                            className="create-provisioning-criteria-input"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseCreateGuarantorModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitGuarantor}
                                className="create-provisioning-criteria-confirm"
                                disabled={isSubmittingGuarantor}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isRecoverFromGuarantorModalOpen && (
                <div className="create-provisioning-criteria-modal-overlay">
                    <div className="create-provisioning-criteria-modal-content">
                        <h4 className="create-modal-title">Recover From Guarantor</h4>
                        <p className="create-provisioning-criteria-label">Are you sure you want to recover from the guarantor?</p>

                        {/* Modal Actions */}
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={handleCloseRecoverFromGuarantorModal}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRecoverFromGuarantor}
                                className="create-provisioning-criteria-confirm"
                                disabled={isSubmittingRecoverFromGuarantor}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LoanDetails;
