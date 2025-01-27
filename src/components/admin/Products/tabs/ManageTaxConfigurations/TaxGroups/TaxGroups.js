import React, { useState } from "react";
import ViewTaxGroups from "./ViewTaxGroups";
import CreateTaxGroup from "./CreateTaxGroup";
import { Link } from "react-router-dom";

const TaxGroups = () => {
    const [activeTab, setActiveTab] = useState("viewTaxGroups");

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/manage-tax-configurations" className="breadcrumb-link">Manage Tax Configurations</Link> . Tax
                Groups
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === "viewTaxGroups" ? "active" : ""}`}
                    onClick={() => setActiveTab("viewTaxGroups")}
                >
                    View Tax Groups
                </button>
                <button
                    className={`tab-button ${activeTab === "createTaxGroup" ? "active" : ""}`}
                    onClick={() => setActiveTab("createTaxGroup")}
                >
                    Create Tax Group
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "viewTaxGroups" ? <ViewTaxGroups/> : <CreateTaxGroup/>}
            </div>
        </div>
    );
};

export default TaxGroups;
