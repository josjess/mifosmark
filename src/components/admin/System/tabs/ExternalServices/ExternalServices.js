import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExternalServices.css";
import { FaServer, FaEnvelope, FaSms, FaBell } from "react-icons/fa";

const ExternalServices = () => {
    const navigate = useNavigate();

    const services = [
        { name: "Amazon S3 Service", icon: <FaServer />, color: "#4c84ff", text: "Manage Amazon S3 Service Configurations", link: "/amzons3" },
        { name: "Email Service", icon: <FaEnvelope />, color: "#28a745", text: "Manage Email Service Configurations", link: "/email-service" },
        { name: "SMS Service", icon: <FaSms />, color: "#f39c12", text: "Manage SMS Service Configurations", link: "/sms-service" },
        { name: "Notification Service", icon: <FaBell />, color: "#e74c3c", text: "Manage Notification Service Configurations", link: "/notification-service" },
    ];

    return (
        <div className="external-services-page neighbor-element">
            <h2 className="external-services-heading">
                <Link to="/system" className="breadcrumb-link">System</Link> . External Services
            </h2>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="service-card"
                        onClick={() => navigate(service.link)}
                    >
                        <div className="service-icon" style={{ color: service.color }}>
                            {service.icon}
                        </div>
                        <h4 className="service-title">{service.name}</h4>
                        <p className="service-description">{service.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExternalServices;
