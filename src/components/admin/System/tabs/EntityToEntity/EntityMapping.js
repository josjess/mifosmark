import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useLoading } from '../../../../../context/LoadingContext';
import { API_CONFIG } from '../../../../../config';
import { Link } from 'react-router-dom';
import './EntityMapping.css';
import { FiLink } from 'react-icons/fi';

const EntityMapping = () => {
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [mappings, setMappings] = useState([]);
    const [selectedMapping, setSelectedMapping] = useState(null);
    const [fieldData, setFieldData] = useState({ firstField: [], secondField: [] });
    const [formValues, setFormValues] = useState({ first: '', second: '' });
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchMappings();
    }, []);

    const fetchMappings = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/entitytoentitymapping`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });
            setMappings(response.data || []);
        } catch (error) {
            console.error('Error fetching entity mappings:', error);
        } finally {
            stopLoading();
        }
    };

    const fetchFieldData = async (mappingType) => {
        const parts = mappingType.split('access_to_');

        const firstPart = parts[0].replace(/_/g, '');

        const secondPartRaw = parts[1];
        const secondPart = secondPartRaw.includes('/')
            ? secondPartRaw.split('/').pop()
            : secondPartRaw.replace(/_/g, '');

        try {
            const [firstResponse, secondResponse] = await Promise.all([
                axios.get(`${API_CONFIG.baseURL}/${firstPart}s`, {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                    },
                }),
                axios.get(`${API_CONFIG.baseURL}/${secondPart}`, {
                    headers: {
                        Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                        'Fineract-Platform-TenantId': 'default',
                    },
                }),
            ]);
            setFieldData({
                firstField: firstResponse.data || [],
                secondField: secondResponse.data || [],
            });
        } catch (error) {
            console.error('Error fetching field data:', error);
        }
    };

    const handleRowClick = (mapping) => {
        setSelectedMapping(mapping);
        fetchFieldData(mapping.mappingTypes);
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formValues.first || !formValues.second) {
            alert('Both fields are mandatory. Please fill them before submitting.');
            return;
        }
        console.log(`Submitted Values for Mapping ID ${selectedMapping?.id}:`, formValues);
        // axios.post(`${API_CONFIG.baseURL}/entitytoentitymapping/${selectedMapping?.id}`, {
        //     firstEntityId: formValues.first,
        //     secondEntityId: formValues.second,
        // }, {
        //     headers: {
        //         Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
        //         'Fineract-Platform-TenantId': 'default',
        //     },
        // }).then((response) => {
        //     console.log('Successfully submitted:', response.data);
        //     alert('Mapping successfully submitted!');
        // }).catch((error) => {
        //     console.error('Error submitting mapping:', error);
        //     alert('Failed to submit mapping. Please try again.');
        // });
    };

    const paginatedMappings = mappings.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const transformMappingType = (mappingType) => {
        const parts = mappingType.split('access_to_');
        return (
            <>
                {parts[0].replace(/_/g, ' ')}
                <FiLink className="mapping-icon" />
                {parts[1].replace(/_/g, ' ')}
            </>
        );
    };

    const transformMappingTypeToTitle = (mappingType) => {
        if (!mappingType) return '';
        const sentenceCase = mappingType
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase());
        return sentenceCase;
    };

    return (
        <div className="entity-mapping-page">
            <h2 className="page-heading">
                <Link to="/system" className="breadcrumb-link">System</Link> . Entity to Entity Mapping
            </h2>
            <div className="mapping-controls">
                <div className="page-size-selector">
                    <label>Rows per page:</label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            <table className="mapping-table">
                <thead>
                <tr>
                    <th>Mapping Between Entities</th>
                </tr>
                </thead>
                <tbody>
                {paginatedMappings.length > 0 ? (
                    paginatedMappings.map((mapping) => (
                        <>
                            <tr
                                key={mapping.id}
                                onClick={() => handleRowClick(mapping)}
                                className={`clickable-row ${
                                    selectedMapping?.id === mapping.id ? 'active-row' : ''
                                }`}
                            >
                                <td>{transformMappingType(mapping.mappingTypes)}</td>
                            </tr>
                            {selectedMapping?.id === mapping.id && (
                                <tr className="entity-mapping-form">
                                    <td colSpan="1">
                                        <div className="entity-mapping-form">
                                            <h3 className="entity-mapping-form-title">
                                                {transformMappingTypeToTitle(mapping.mappingTypes)}
                                            </h3>
                                            <form onSubmit={handleSubmit} className={'entity-form'}>
                                                <div className="entity-mapping-form-row">
                                                    <div className="entity-mapping-form-group">
                                                        <label
                                                            htmlFor="firstField">{selectedMapping?.mappingTypes.split('access_to_')[0].replace(/_/g, ' ') || 'First Entity'}<span>*</span></label>
                                                        <select
                                                            id="firstField"
                                                            name="first"
                                                            value={formValues.first}
                                                            onChange={handleFieldChange}
                                                            className="entity-mapping-select"
                                                        >
                                                            {/*<option value="all">All</option>*/}
                                                            <option value="">Select</option>
                                                            {fieldData.firstField.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="entity-mapping-form-group">
                                                        <label
                                                            htmlFor="secondField">{selectedMapping?.mappingTypes.split('access_to_')[1]?.replace(/_/g, ' ').split('/').pop() || 'Second Entity'}<span>*</span></label>
                                                        <select
                                                            id="secondField"
                                                            name="second"
                                                            value={formValues.second}
                                                            onChange={handleFieldChange}
                                                            className="entity-mapping-select"
                                                        >
                                                            {/*<option value="all">All</option>*/}
                                                            <option value="">Select</option>
                                                            {fieldData.secondField.map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="entity-mapping-submit-button"
                                                    disabled={!formValues.first || !formValues.second || formValues.first === "all" || formValues.second === "all"}
                                                >
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))
                ) : (
                    <tr>
                        <td colSpan="1" className="no-data">
                            No mappings available
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {mappings.length > pageSize && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                        Start
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {Math.ceil(mappings.length / pageSize)}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, Math.ceil(mappings.length / pageSize))
                            )
                        }
                        disabled={currentPage === Math.ceil(mappings.length / pageSize)}
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setCurrentPage(Math.ceil(mappings.length / pageSize))}
                        disabled={currentPage === Math.ceil(mappings.length / pageSize)}
                    >
                        End
                    </button>
                </div>
            )}
        </div>
    );
};

export default EntityMapping;
