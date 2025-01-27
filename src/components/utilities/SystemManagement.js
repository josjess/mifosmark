import React, {useContext, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import "./SystemManagement.css";

const SystemManagement = () => {
    const { componentVisibility, toggleComponentVisibility } = useContext(AuthContext);
    const [ expandedGroup, setExpandedGroup] = useState(null);

    const formatComponentName = (name) => {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const groupComponents = (components) => {
        const grouped = {};

        components.forEach((componentId) => {
            const [prefix, ...rest] = componentId.split('-');

            if (!grouped[prefix]) {
                grouped[prefix] = [];
            }

            if (rest.length > 1) {
                const subgroupName = rest.join('-');
                grouped[prefix].push({ subgroup: subgroupName, componentId });
            } else {
                grouped[prefix].push({ subgroup: null, componentId });
            }
        });

        return grouped;
    };

    const groupedComponents = groupComponents(Object.keys(componentVisibility));

    const handleGroupToggle = (group) => {
        setExpandedGroup(expandedGroup === group ? null : group);
    };

    return (
        <div className="system-management neighbor-element">
            <h2 className="system-management-header">Component Visibility Settings</h2>
            <div className="system-management-content">
                <div className="system-management-table">
                    <h3>Toggle Components</h3>
                    {Object.keys(groupedComponents).map((group) => (
                        <div key={group} className="system-management-group">
                            <h4 onClick={() => handleGroupToggle(group)} style={{ cursor: 'pointer' }}>
                                {formatComponentName(group)}
                            </h4>
                            {expandedGroup === group &&
                                groupedComponents[group].map(({ subgroup, componentId }) => (
                                    <div key={componentId} className="system-management-toggle-row">
                                        <span className="system-management-toggle-name">
                                            {formatComponentName(subgroup ? `${group}-${subgroup}` : componentId)}
                                        </span>
                                        <label className="system-management-toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={componentVisibility[componentId]}
                                                onChange={() => toggleComponentVisibility(componentId)}
                                            />
                                            <span className="system-management-slider"></span>
                                        </label>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                <div className="system-management-table">
                    <h3>Current Component States</h3>
                    {Object.keys(groupedComponents).map((group) => (
                        <div key={group} className="system-management-group">
                            <h4 onClick={() => handleGroupToggle(group)} style={{ cursor: 'pointer' }}>
                                {formatComponentName(group)}
                            </h4>
                            {expandedGroup === group &&
                                groupedComponents[group].map(({ subgroup, componentId }) => (
                                    <div key={componentId} className="system-management-state-row">
                                        <span className="system-management-state-name">
                                            {formatComponentName(subgroup ? `${group}-${subgroup}` : componentId)}
                                        </span>
                                        <span
                                            className={`system-management-state-value ${
                                                componentVisibility[componentId] ? "visible" : "hidden-color"
                                            }`}
                                        >
                                            {componentVisibility[componentId] === true
                                                ? "Visible"
                                                : componentVisibility[componentId] === false
                                                    ? "Hidden"
                                                    : "Unknown"}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SystemManagement;
