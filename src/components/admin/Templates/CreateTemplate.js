import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateTemplate.css';
import { useLoading } from '../../../context/LoadingContext';
import { API_CONFIG } from '../../../config';
import { AuthContext } from '../../../context/AuthContext';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CreateTemplateForm = () => {
    const [step, setStep] = useState(1);
    const [entityOptions, setEntityOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);
    const { user } = useContext(AuthContext);
    const { startLoading, stopLoading } = useLoading();
    const [templateForm, setTemplateForm] = useState({
        entity: '',
        type: '',
        name: '',
        mapper: [{ key: '', value: '' }],
        content: ''
    });
    const [formIsValid, setFormIsValid] = useState(false);

    useEffect(() => {
        fetchTemplateOptions();
    }, []);

    const fetchTemplateOptions = async () => {
        startLoading();
        try {
            const response = await axios.get(`${API_CONFIG.baseURL}/templates/template`, {
                headers: {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                },
            });

            setEntityOptions(response.data.entities || []);
            setTypeOptions(response.data.types || []);
        } catch (error) {
            console.error('Error fetching template options:', error);
        } finally {
            stopLoading();
        }
    };

    const validateForm = () => {
        const { entity, type, name } = templateForm;
        setFormIsValid(entity && type && name);
    };

    useEffect(() => {
        validateForm();
    }, [templateForm]);

    const goNext = () => setStep((prev) => prev + 1);
    const goBack = () => setStep((prev) => prev - 1);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setTemplateForm({ ...templateForm, [name]: value });
    };

    const addMapperRow = () => {
        if (templateForm.mapper.length < 5) {
            setTemplateForm({
                ...templateForm,
                mapper: [...templateForm.mapper, { key: '', value: '' }]
            });
        }
    };

    const removeMapperRow = (index) => {
        if (templateForm.mapper.length > 1) {
            const newMapper = [...templateForm.mapper];
            newMapper.splice(index, 1);
            setTemplateForm({ ...templateForm, mapper: newMapper });
        }
    };

    const handleMapperChange = (index, field, value) => {
        const newMapper = [...templateForm.mapper];
        newMapper[index][field] = value;
        setTemplateForm({ ...templateForm, mapper: newMapper });
    };

    const handleSubmitTemplate = () => {
        console.log('Submitting template:', templateForm);
        // Implement actual submission logic here
    };

    return (
        <div className="template-form-container">
            <div className="template-with-indicator">
                <div className="template-stage-indicator">
                    <div className={`template-stage ${step === 1 ? 'current' : step > 1 ? 'completed' : ''}`} onClick={() => setStep(1)}>
                        <div className="template-circle"></div>
                        <span>Basic Info</span>
                    </div>
                    <div className={`template-stage ${step === 2 ? 'current' : step > 2 ? 'completed' : ''}`} onClick={() => setStep(2)}>
                        <div className="template-circle"></div>
                        <span>Advanced Options</span>
                    </div>
                    <div className={`template-stage ${step === 3 ? 'current' : step > 3 ? 'completed' : ''}`} onClick={() => setStep(3)}>
                        <div className="template-circle"></div>
                        <span>Content</span>
                    </div>
                    <div className={`template-stage ${step === 4 ? 'current' : ''}`} onClick={() => setStep(4)}>
                        <div className="template-circle"></div>
                        <span>Review & Submit</span>
                    </div>
                </div>

                <form className="template-form">
                    {step === 1 && (
                        <div className="template-form-section">
                            <label>Entity <span className="asterisk">*</span></label>
                            <select name="entity" value={templateForm.entity} onChange={handleFormChange} required>
                                <option value="">Select Entity</option>
                                {entityOptions.map((entity) => (
                                    <option key={entity.id} value={entity.id}>{entity.name}</option>
                                ))}
                            </select>

                            <label>Type <span className="asterisk">*</span></label>
                            <select name="type" value={templateForm.type} onChange={handleFormChange} required>
                                <option value="">Select Type</option>
                                {typeOptions.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>

                            <label>Template Name <span className="asterisk">*</span></label>
                            <input type="text" name="name" value={templateForm.name} onChange={handleFormChange} required />

                            <div className="template-navigation-buttons">
                                <button
                                    type="button"
                                    className="template-cancel-button"
                                    onClick={() => window.location.href = '/admin'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="template-next-button"
                                    onClick={goNext}
                                    disabled={!formIsValid}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="template-form-section">
                            <h3>Advanced Options( Add mappers )</h3>
                            {templateForm.mapper.map((mapper, index) => (
                                <div key={index} className="template-mapper-row">
                                    <input
                                        type="text"
                                        placeholder="Mapper Key"
                                        value={mapper.key}
                                        onChange={(e) => handleMapperChange(index, 'key', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mapper Value"
                                        value={mapper.value}
                                        onChange={(e) => handleMapperChange(index, 'value', e.target.value)}
                                    />
                                    {index === 0 && templateForm.mapper.length < 5 && (
                                        <FaPlus
                                            className="template-add-icon"
                                            onClick={addMapperRow}
                                        />
                                    )}
                                    {index > 0 && (
                                        <FaMinus
                                            className="template-remove-icon"
                                            onClick={() => removeMapperRow(index)}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="template-navigation-buttons">
                                <button type="button" className="template-back-button" onClick={goBack}>Back</button>
                                <button type="button" className="template-next-button" onClick={goNext}>Next</button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="template-form-section">
                            <h3>Template Content</h3>
                            <ReactQuill
                                value={templateForm.content}
                                onChange={(content) => setTemplateForm({ ...templateForm, content })}
                                theme="snow"
                                className="template-quill-editor"
                            />

                            <div className="template-navigation-buttons">
                                <button type="button" className="template-back-button" onClick={goBack}>Back</button>
                                <button type="button" className="template-next-button" onClick={goNext}>Next</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="template-form-section template-review-section">
                            <h3>Review & Submit</h3>
                            <div className="review-content">
                                <div className="review-column">
                                    <p><strong>Entity:</strong> {templateForm.entity}</p>
                                    <p><strong>Type:</strong> {templateForm.type}</p>
                                    <p><strong>Name:</strong> {templateForm.name}</p>
                                </div>
                                <div className="review-column">
                                    <p><strong>Content:</strong></p>
                                    <div className="review-content-box">
                                        {templateForm.content}
                                    </div>
                                </div>
                            </div>
                            <div className="review-mapper-section">
                                <p><strong>Mapper:</strong></p>
                                <ul className="mapper-list">
                                    {templateForm.mapper.map((mapper, index) => (
                                        <li key={index}><strong>{mapper.key}</strong>: {mapper.value}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="template-navigation-buttons">
                                <button type="button" className="template-back-button" onClick={goBack}>Back</button>
                                <button type="button" className="template-submit-button" onClick={handleSubmitTemplate} disabled={!formIsValid}>Submit</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateTemplateForm;
