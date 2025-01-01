import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { useLoading } from "../../../../context/LoadingContext";
import { API_CONFIG } from "../../../../config";
import "./SavingsDetails.css";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

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
                return <div className="general-tab">General Content</div>;
            case "transactions":
                return <div className="tab-content">Transactions Content</div>;
            case "charges":
                return <div className="tab-content">Charges Content</div>;
            case "documents":
                return <div className="tab-content">Documents Content</div>;
            case "notes":
                return <div className="tab-content">Notes Content</div>;
            case "standingInstructions":
                return <div className="tab-content">Standing Instructions Content</div>;
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
                <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>{' '}
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
                            <button className="dropdown-item">Deposit</button>
                            <button className="dropdown-item">Block Deposit</button>
                            <button className="dropdown-item">Withdraw</button>
                            <button className="dropdown-item">Block Withdrawal</button>
                            <button className="dropdown-item">Block Account</button>
                            <button className="dropdown-item">Hold Amount</button>
                            <button className="dropdown-item">Calculate Interest</button>
                            <button className="dropdown-item">Post Interest As On</button>

                            <div className="dropdown-submenu">
                                <button
                                    className="dropdown-item submenu-toggle"
                                    onClick={() => handleSubmenuToggle("more")}
                                >
                                    More <FaCaretRight className="submenu-icon" />
                                </button>
                                {activeSubmenu === "more" && (
                                    <div className="submenu-content">
                                        <button className="dropdown-item">Post Interest</button>
                                        <button className="dropdown-item">Add Charge</button>
                                        <button className="dropdown-item">Close</button>
                                        <button className="dropdown-item">Transfer Funds</button>
                                        <button className="dropdown-item">Assign Staff</button>
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
        </div>
    );
};

export default SavingsAccounts;
