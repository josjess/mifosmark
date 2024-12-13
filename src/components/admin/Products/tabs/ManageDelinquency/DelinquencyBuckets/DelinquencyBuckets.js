import React, { useState } from "react";
import ViewDelinquencyBuckets from "./ViewDelinquencyBuckets";
import CreateDelinquencyBucket from "./CreateDelinquencyBucket";
import { Link } from "react-router-dom";

const DelinquencyBuckets = () => {
    const [activeTab, setActiveTab] = useState("viewDelinquencyBuckets");

    return (
        <div className="tab-products-page">
            <h2 className="page-heading">
                <Link to="/manage-delinquency" className="breadcrumb-link">Manage Delinquency</Link> . Delinquency Buckets
            </h2>
            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === "viewDelinquencyBuckets" ? "active" : ""}`}
                    onClick={() => setActiveTab("viewDelinquencyBuckets")}
                >
                    View Buckets
                </button>
                <button
                    className={`tab-button ${activeTab === "createDelinquencyBucket" ? "active" : ""}`}
                    onClick={() => setActiveTab("createDelinquencyBucket")}
                >
                    Create Bucket
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "viewDelinquencyBuckets" ? (
                    <ViewDelinquencyBuckets />
                ) : (
                    <CreateDelinquencyBucket />
                )}
            </div>
        </div>
    );
};

export default DelinquencyBuckets;
