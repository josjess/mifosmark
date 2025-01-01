import React, {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../../../context/AuthContext";
import {useLoading} from "../../../../context/LoadingContext";
import {API_CONFIG} from "../../../../config";
import './LoanDetails.css'
import {FaCaretLeft, FaCaretRight} from "react-icons/fa";

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

                        {/* Loan Summary Section */}
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
                                    {label: "Principal", field: "principal"},
                                    {label: "Interest", field: "interest"},
                                    {label: "Fees", field: "feeCharges"},
                                    {label: "Penalties", field: "penaltyCharges"},
                                    {label: "Total", field: "total"},
                                ].map(({label, field}) => (
                                    <tr key={field}>
                                        <td>{label}</td>
                                        <td>{loanDetails?.summary?.[`${field}Charged`] || "-"}</td>
                                        <td>{loanDetails?.summary?.[`${field}Paid`] || "-"}</td>
                                        <td>{loanDetails?.summary?.[`${field}Waived`] || "-"}</td>
                                        <td>{loanDetails?.summary?.[`${field}WrittenOff`] || "-"}</td>
                                        <td>{loanDetails?.summary?.[`${field}Outstanding`] || "-"}</td>
                                        <td>{loanDetails?.summary?.[`${field}Overdue`] || "-"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

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
                                    <td className="value">{loanDetails?.purpose || "N/A"}</td>
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
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Interest Rate</td>
                                    <td className="value">
                                        {loanDetails?.annualInterestRate
                                            ? `${loanDetails.annualInterestRate}%`
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">Amortization</td>
                                    <td className="value">
                                        {loanDetails?.amortizationType?.value || "N/A"}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "accountDetails":
                return <div className="tab-content">Account Details Content</div>;
            case "repaymentSchedule":
                return <div className="tab-content">Repayment Schedule Content</div>;
            case "transactions":
                return <div className="tab-content">Transactions Content</div>;
            case "delinquencyTags":
                return <div className="tab-content">Delinquency Tags Content</div>;
            case "loanCollateralDetails":
                return <div className="tab-content">Loan Collateral Details Content</div>;
            case "loanReschedules":
                return <div className="tab-content">Loan Reschedules Content</div>;
            case "loanDocuments":
                return <div className="tab-content">Loan Documents Content</div>;
            case "notes":
                return <div className="tab-content">Notes Content</div>;
            case "standingInstructions":
                return <div className="tab-content">Standing Instructions Content</div>;
            case "externalAssetOwner":
                return <div className="tab-content">External Asset Owner Content</div>;
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
                <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>{' '}
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
                            <button className="dropdown-item">Add Loan Charge</button>
                            <button className="dropdown-item">ForeClosure</button>
                            <button className="dropdown-item">Make Repayment</button>
                            <button className="dropdown-item">Undo Disbursal</button>
                            <button className="dropdown-item">Assign Loan Officer</button>
                            <button className="dropdown-item">Prepay Loan</button>
                            <button className="dropdown-item">Charge-Off</button>
                            <button className="dropdown-item">Re-Age</button>
                            <button className="dropdown-item">Re-Amortize</button>

                            <div className="dropdown-submenu">
                                <button
                                    className="dropdown-item submenu-toggle"
                                    onClick={() => handleSubmenuToggle("payments")}
                                >
                                    Payments <FaCaretRight className={'submenu-icon'}/>
                                </button>
                                {activeSubmenu === "payments" && (
                                    <div className="submenu-content">
                                        <button className="dropdown-item">Goodwill Credit</button>
                                        <button className="dropdown-item">Payout Refund</button>
                                        <button className="dropdown-item">Merchant Issued Refund</button>
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
                                        <button className="dropdown-item">Waive Interest</button>
                                        <button className="dropdown-item">Reschedule</button>
                                        <button className="dropdown-item">Write Off</button>
                                        <button className="dropdown-item">Close (as Rescheduled)</button>
                                        <button className="dropdown-item">Close</button>
                                        <button className="dropdown-item">Loan Screen Report</button>
                                        <button className="dropdown-item">View Guarantors</button>
                                        <button className="dropdown-item">Create Guarantor</button>
                                        <button className="dropdown-item">Recover From Guarantor</button>
                                        <button className="dropdown-item">Sell Loan</button>
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
                        "general",
                        "accountDetails",
                        "repaymentSchedule",
                        "transactions",
                        "delinquencyTags",
                        "loanCollateralDetails",
                        "loanReschedules",
                        "loanDocuments",
                        "notes",
                        "standingInstructions",
                        "externalAssetOwner",
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
                        <FaCaretRight/>
                    </button>
                )}
            </div>

            <div className="client-tab-content">{renderTabContent()}</div>
        </div>
    );
};

export default LoanDetails;
