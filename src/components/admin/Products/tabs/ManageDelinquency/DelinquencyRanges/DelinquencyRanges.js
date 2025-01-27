import React, { useState } from "react";
import ViewDelinquencyRanges from "./ViewDelinquencyRanges";
import CreateDelinquencyRange from "./CreateDelinquencyRange";
import { Link } from "react-router-dom";

const DelinquencyRanges = () => {
    const [activeTab, setActiveTab] = useState("viewDelinquencyRanges");

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/manage-delinquency" className="breadcrumb-link">Manage Delinquency</Link> . Delinquency Ranges
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === "viewDelinquencyRanges" ? "active" : ""}`}
                    onClick={() => setActiveTab("viewDelinquencyRanges")}
                >
                    View Ranges
                </button>
                <button
                    className={`tab-button ${activeTab === "createDelinquencyRange" ? "active" : ""}`}
                    onClick={() => setActiveTab("createDelinquencyRange")}
                >
                    Create Range
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "viewDelinquencyRanges" ? (
                    <ViewDelinquencyRanges />
                ) : (
                    <CreateDelinquencyRange />
                )}
            </div>
        </div>
    );
};

export default DelinquencyRanges;
