import React, { useState } from "react";
import ViewTaxComponents from "./ViewTaxComponents";
import CreateTaxComponent from "./CreateTaxComponent";
import { Link } from "react-router-dom";

const TaxComponents = () => {
    const [activeTab, setActiveTab] = useState("viewTaxComponents");

    return (
        <div className="tab-products-page neighbor-element">
            <h2 className="page-heading">
                <Link to="/manage-tax-configurations" className="breadcrumb-link">Manage Tax Configurations</Link> . Tax
                Components
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === "viewTaxComponents" ? "active" : ""}`}
                    onClick={() => setActiveTab("viewTaxComponents")}
                >
                    View Tax Components
                </button>
                <button
                    className={`tab-button ${activeTab === "createTaxComponent" ? "active" : ""}`}
                    onClick={() => setActiveTab("createTaxComponent")}
                >
                    Create Tax Component
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "viewTaxComponents" ? <ViewTaxComponents/> : <CreateTaxComponent/>}
            </div>
        </div>
    );
};

export default TaxComponents;
