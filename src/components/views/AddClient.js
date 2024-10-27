import React, {useContext, useEffect, useState} from 'react';
import { FaPlus } from 'react-icons/fa';
import './AddClient.css';
import {useNavigate} from "react-router-dom";
import { API_CONFIG } from '../../config';
import axios from 'axios';
import { useLoading } from '../../context/LoadingContext';
import {AuthContext} from "../../context/AuthContext";

const AddClientForm = () => {
    const [legalForm, setLegalForm] = useState('PERSON');
    // const [familyMembers, setFamilyMembers] = useState([]);
    // const [addresses, setAddresses] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [openSavingsAccount, setOpenSavingsAccount] = useState(false);
    const [offices, setOffices] = useState([]);
    const [staffs, setStaffs] = useState([]);

    const [office, setOffice] = useState('');
    const [staff, setStaff] = useState('');
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const [name, setName] = useState('');

    const [gender, setGender] = useState('');
    const [clientType, setClientType] = useState('');
    const [clientClassification, setClientClassification] = useState('');
    const [externalId, setExternalId] = useState('');
    const [submittedOn, setSubmittedOn] = useState(new Date().toISOString().split('T')[0]);
    const [incorporationDate, setIncorporationDate] = useState('');
    const [incorporationValidUntil, setIncorporationValidUntil] = useState('');
    const [incorporationNumber, setIncorporationNumber] = useState('');
    const [mainBusinessLine, setMainBusinessLine] = useState('');
    const [constitution, setConstitution] = useState('');
    const [remarks, setRemarks] = useState('');


    const goNext = () => {
        if (step === 1 && isStep1Complete) setStep(step + 1);
        if (step === 2 && isStep2Complete) setStep(step + 1);
    };
    const goBack = () => setStep(step - 1);

    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, newFamilyMember]);
        setNewFamilyMember({
            firstName: '',
            middleName: '',
            lastName: '',
            mobileNumber: '',
            age: '',
            isDependent: false,
            gender: '',
            profession: '',
            maritalStatus: '',
            dateOfBirth: '',
        });
        setShowModal(false);
    };

    const removeFamilyMember = (index) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };

    const [familyMembers, setFamilyMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newFamilyMember, setNewFamilyMember] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        mobileNumber: '',
        age: '',
        isDependent: false,
        gender: '',
        profession: '',
        maritalStatus: '',
        dateOfBirth: '',
    })

    const INITIAL_ADDRESS = {
        addressType: '',
        addressLine1: '',
        addressLine2: '',
        country: '',
        province: '',
        city: '',
        postalCode: '',
        isActive: false,
    };

    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState(INITIAL_ADDRESS);

    const addAddress = () => {
        setAddresses([...addresses, newAddress]);
        setNewAddress(INITIAL_ADDRESS);
        setShowAddressModal(false);
    };
    const isStep1Complete =
        office.id !== '' &&
        staff.id !== '' &&
        legalForm !== '' &&
        ((legalForm === 'PERSON' && firstName !== '' && lastName !== '') || (legalForm === 'ENTITY' && name !== ''));

    const isStep2Complete =
        (legalForm === 'PERSON' &&
            dateOfBirth !== '' &&
            gender !== '' &&
            clientType !== '' &&
            clientClassification !== '') ||
        (legalForm === 'ENTITY' &&
            incorporationDate !== '' &&
            incorporationValidUntil !== '' &&
            clientType !== '' &&
            clientClassification !== '');
    // const isStep3Complete = familyMembers.length > 0;
    //
    // const isStep4Complete = addresses.length > 0;

    const isFormComplete = isStep1Complete && isStep2Complete;

    const removeAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };



    useEffect(() => {
        const fetchData = async () => {
            startLoading();

            try {
                const headers = {
                    Authorization: `Basic ${user.base64EncodedAuthenticationKey}`,
                    'Fineract-Platform-TenantId': 'default',
                    'Content-Type': 'application/json',
                };

                const [officesResponse, staffResponse] = await Promise.all([
                    axios.get(`${API_CONFIG.baseURL}/offices`, { headers }),
                    axios.get(`${API_CONFIG.baseURL}/staff`, { headers })
                ]);

                setOffices(officesResponse.data);
                setStaffs(staffResponse.data);
                // console.log(officesResponse.data, staffResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                stopLoading();
            }
        };

        fetchData().then();
        // eslint-disable-next-line
    }, []);

    const handleCancel = () => {
        navigate('/clients');
    };

    return (
        <div className="form-container-client">
            <h2>Onboard New Client</h2>

            <div className="with-indicator">
                <div className="stage-indicator">
                    <div className={`stage ${step === 1 ? 'current' : step > 1 ? 'completed' : ''}`}
                         onClick={() => setStep(1)}>
                        <div className="circle"></div>
                        <span>Basic Details</span>
                    </div>
                    <div className={`stage ${step === 2 ? 'current' : step > 2 ? 'completed' : ''}`}
                         onClick={() => setStep(2)}>
                        <div className="circle"></div>
                        <span>Additional Details</span>
                    </div>
                    <div className={`stage ${step === 3 ? 'current' : step > 3 ? 'completed' : ''}`}
                         onClick={() => setStep(3)}>
                        <div className="circle"></div>
                        <span>Family Members</span>
                    </div>
                    <div className={`stage ${step === 4 ? 'current' : step > 4 ? 'completed' : ''}`}
                         onClick={() => setStep(4)}>
                        <div className="circle"></div>
                        <span>Addresses</span>
                    </div>
                    <div className={`stage ${step === 5 ? 'current' : ''}`} onClick={() => setStep(5)}>
                        <div className="circle"></div>
                        <span>Review & Submit</span>
                    </div>
                </div>

                <form className="client-form">
                    {step === 1 && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Office <span>*</span></label>
                                    <select value={office} onChange={(e) => setOffice(e.target.value)} required>
                                        <option value="">-- Select Office --</option>
                                        {offices.map((office) => (
                                            <option key={office.id} value={office.id}>{office.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Staff <span>*</span></label>
                                    <select value={staff} onChange={(e) => setStaff(e.target.value)} required>
                                        <option value="">-- Select Staff --</option>
                                        {staffs.map((staff) => (
                                            <option key={staff.id} value={staff.id}>{staff.displayName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Legal Form <span>*</span></label>
                                <select onChange={(e) => setLegalForm(e.target.value)} value={legalForm}>
                                    <option value="PERSON">Person</option>
                                    <option value="ENTITY">Entity</option>
                                </select>
                            </div>
                            {legalForm === 'PERSON' ? (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>First Name <span>*</span></label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Enter First Name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Middle Name</label>
                                            <input
                                                type="text"
                                                value={middleName}
                                                onChange={(e) => setMiddleName(e.target.value)}
                                                placeholder="Enter Middle Name"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Name <span>*</span></label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Enter Last Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox">
                                        <input type="checkbox" checked={isActive}
                                                   onChange={() => setIsActive(!isActive)}/>
                                            <label>Activate Client</label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Name <span>*</span></label>
                                        <input type="text" placeholder="Enter Name" value={name}
                                               onChange={(e) => setName(e.target.value)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox">
                                        <input type="checkbox" checked={isActive}
                                                   onChange={() => setIsActive(!isActive)}/>
                                            <label>Activate Client</label>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="navigation-buttons">
                                <button onClick={handleCancel} className="cancel-button">cancel</button>
                                <button onClick={goNext} className="next-button" disabled={!((step === 1 && isStep1Complete))}>Next</button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {legalForm === 'PERSON' ? (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                value={dateOfBirth}
                                                onChange={(e) => setDateOfBirth(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                            >
                                                <option value="">-- Select Gender --</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Client Type</label>
                                            <select
                                                value={clientType}
                                                onChange={(e) => setClientType(e.target.value)}
                                            >
                                                <option value="">-- Select Client Type --</option>
                                                <option value="COR">COR</option>
                                                <option value="IND">IND</option>
                                                <option value="Borrower">Borrower</option>
                                                <option value="Counter-party">Counter-party</option>
                                                <option value="Shareholder">Shareholder</option>
                                                <option value="Investor">Investor</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Client Classification</label>
                                            <select
                                                value={clientClassification}
                                                onChange={(e) => setClientClassification(e.target.value)}
                                            >
                                                <option value="">-- Select Classification --</option>
                                                <option value="Rural">Rural</option>
                                                <option value="Urban">Urban</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>External ID</label>
                                        <input
                                            type="text"
                                            value={externalId}
                                            onChange={(e) => setExternalId(e.target.value)}
                                            placeholder="Enter External ID"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Submitted On</label>
                                        <input type="date" defaultValue={new Date().toISOString().split('T')[0]}
                                               value={submittedOn}
                                               onChange={(e) => setSubmittedOn(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="checkbox">
                                            <input type="checkbox" checked={openSavingsAccount}
                                                   onChange={() => setOpenSavingsAccount(!openSavingsAccount)}/>
                                            <label>Open Savings Account</label>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Incorporation Date</label>
                                            <input
                                                type="date"
                                                value={incorporationDate}
                                                onChange={(e) => setIncorporationDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Incorporation Valid Until</label>
                                            <input
                                                type="date"
                                                value={incorporationValidUntil}
                                                onChange={(e) => setIncorporationValidUntil(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Client Type</label>
                                            <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                                                <option value="">-- Select Client Type --</option>
                                                <option value="COR">COR</option>
                                                <option value="IND">IND</option>
                                                <option value="Borrower">Borrower</option>
                                                <option value="Counter-party">Counter-party</option>
                                                <option value="Shareholder">Shareholder</option>
                                                <option value="Investor">Investor</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Client Classification</label>
                                            <select value={clientClassification}
                                                    onChange={(e) => setClientClassification(e.target.value)}>
                                                <option value="">-- Select Classification --</option>
                                                <option value="Rural">Rural</option>
                                                <option value="Urban">Urban</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Incorporation Number</label>
                                            <input
                                                type="text"
                                                value={incorporationNumber}
                                                onChange={(e) => setIncorporationNumber(e.target.value)}
                                                placeholder="Enter Incorporation Number"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Main Business Line</label>
                                            <select
                                                value={mainBusinessLine}
                                                onChange={(e) => setMainBusinessLine(e.target.value)}
                                            >
                                                <option value="">-- Select Business Line --</option>
                                                <option value="Trading">Trading</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Constitution</label>
                                            <select
                                                value={constitution}
                                                onChange={(e) => setConstitution(e.target.value)}
                                            >
                                                <option value="PT">PT</option>
                                                <option value="CV">CV</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Remarks</label>
                                            <textarea
                                                rows="3"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                                placeholder="Enter Remarks"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Submitted On</label>
                                            <input type="date" defaultValue={new Date().toISOString().split('T')[0]} value={submittedOn}
                                                   onChange={(e) => setSubmittedOn(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="checkbox">
                                                <input type="checkbox" checked={openSavingsAccount}
                                                       onChange={() => setOpenSavingsAccount(!openSavingsAccount)}/>
                                                <label>Open Savings Account</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button" disabled={!((step === 2 && isStep2Complete))}>Next</button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div>
                            <div className="t-head">
                                <h3>Family Members</h3>
                                <span className="add-family-member" onClick={() => setShowModal(true)}>
                                    <FaPlus className="react-icon-plus"/> Add Family Member
                                </span>
                            </div>
                            <table className="family-members-table">
                                <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Mobile Number</th>
                                    <th>Age</th>
                                    <th>Dependent</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {familyMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">No family members added.</td>
                                    </tr>
                                ) : (
                                    familyMembers.map((member, index) => (
                                        <tr key={index}>
                                            <td>{member.firstName}</td>
                                            <td>{member.middleName}</td>
                                            <td>{member.lastName}</td>
                                            <td>{member.mobileNumber}</td>
                                            <td>{member.age}</td>
                                            <td>{member.isDependent ? 'Yes' : 'No'}</td>
                                            <td>
                                                <span className="remove-icon" onClick={() => removeFamilyMember(index)}>
                                                     Remove
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>

                            {showModal && (
                                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <h3>Add Family Member</h3>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={newFamilyMember.firstName}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            firstName: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Middle Name"
                                                    value={newFamilyMember.middleName}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            middleName: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={newFamilyMember.lastName}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            lastName: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Mobile Number"
                                                    value={newFamilyMember.mobileNumber}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            mobileNumber: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="number"
                                                    placeholder="Age"
                                                    value={newFamilyMember.age}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({...newFamilyMember, age: e.target.value})
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <select
                                                    value={newFamilyMember.gender}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            gender: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">-- Select Gender --</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <select
                                                    value={newFamilyMember.profession}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            profession: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">-- Select Profession --</option>
                                                    <option value="Business">Business Person</option>
                                                    <option value="Employed">Employed</option>
                                                    <option value="Self Employed">Self Employed</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <select
                                                    value={newFamilyMember.maritalStatus}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            maritalStatus: e.target.value
                                                        })
                                                    }
                                                >
                                                    <option value="">-- Select Marital Status --</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Married">Married</option>
                                                    <option value="Divorced">Divorced</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                placeholder="Date of Birth"
                                                value={newFamilyMember.dateOfBirth}
                                                onChange={(e) =>
                                                    setNewFamilyMember({
                                                        ...newFamilyMember,
                                                        dateOfBirth: e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={newFamilyMember.isDependent}
                                                    onChange={(e) =>
                                                        setNewFamilyMember({
                                                            ...newFamilyMember,
                                                            isDependent: e.target.checked
                                                        })
                                                    }
                                                />
                                                <label>Dependent</label>
                                            </div>
                                        </div>
                                        <div className="modal-buttons">
                                            <button onClick={addFamilyMember} className="submit-button">Save</button>
                                            <button onClick={() => setShowModal(false)}
                                                    className="cancel-button">Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <div className="t-head">
                                <h3>Addresses</h3>
                                <span className="add-address" onClick={() => setShowAddressModal(true)}>
                                    <FaPlus className="react-icon-plus"/> Add Address
                                </span>
                            </div>
                            <table className="address-table">
                                <thead>
                                <tr>
                                    <th>Address Type</th>
                                    <th>Address Line 1</th>
                                    <th>Address Line 2</th>
                                    <th>Country</th>
                                    <th>Province/State</th>
                                    <th>City</th>
                                    <th>Postal Code</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {addresses.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">No addresses added.</td>
                                    </tr>
                                ) : (
                                    addresses.map((address, index) => (
                                        <tr key={index}>
                                            <td>{address.addressType}</td>
                                            <td>{address.addressLine1}</td>
                                            <td>{address.addressLine2}</td>
                                            <td>{address.country}</td>
                                            <td>{address.province}</td>
                                            <td>{address.city}</td>
                                            <td>{address.postalCode}</td>
                                            <td>
                                                <span className="remove-icon" onClick={() => removeAddress(index)}>
                                                    Remove
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>

                            {showAddressModal && (
                                <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <h3>Add Address</h3>
                                        <div className="form-group">
                                            <select
                                                value={newAddress.addressType}
                                                onChange={(e) =>
                                                    setNewAddress({...newAddress, addressType: e.target.value})
                                                }
                                            >
                                                <option value="">-- Select Address Type --</option>
                                                <option value="Permanent">Permanent</option>
                                                <option value="Present">Present</option>
                                            </select>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Address Line 1"
                                                    value={newAddress.addressLine1}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, addressLine1: e.target.value})
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Address Line 2"
                                                    value={newAddress.addressLine2}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, addressLine2: e.target.value})
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Country"
                                                    value={newAddress.country}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, country: e.target.value})
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Province/State"
                                                    value={newAddress.province}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, province: e.target.value})
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    value={newAddress.city}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, city: e.target.value})
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Postal Code"
                                                    value={newAddress.postalCode}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, postalCode: e.target.value})
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group checkbox">
                                            <div className="checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={newAddress.isActive}
                                                    onChange={(e) =>
                                                        setNewAddress({...newAddress, isActive: e.target.checked})
                                                    }
                                                />
                                                <label>Is Active?</label>
                                            </div>
                                        </div>

                                        <div className="modal-buttons">
                                            <button onClick={addAddress} className="submit-button">Save</button>
                                            <button onClick={() => setShowAddressModal(false)}
                                                    className="cancel-button">Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button onClick={goNext} className="next-button">Next</button>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <>
                            <h3>Review & Submit</h3>
                            <div className="review-section">
                                <div className="review-section-column">
                                    <p>
                                        <strong>Office:</strong> {offices.find((o) => o.id === parseInt(office))?.name || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Staff:</strong> {staffs.find((s) => s.id === parseInt(staff))?.displayName || "N/A"}
                                    </p>

                                    <p><strong>Legal Form:</strong> {legalForm}</p>
                                    <p><strong>Client Activation:</strong> {isActive ? "Yes" : "No"}</p>
                                    {legalForm === 'PERSON' ? (
                                        <>
                                            <p><strong>First Name:</strong> {firstName}</p>
                                            <p><strong>Middle Name:</strong> {middleName}</p>
                                            <p><strong>Last Name:</strong> {lastName}</p>
                                        </>
                                    ) : (
                                        <p><strong>Entity Name:</strong> {name}</p>
                                    )}
                                    <p><strong>Mobile Number:</strong> {mobileNumber}</p>
                                    <p><strong>Date of Birth:</strong> {dateOfBirth}</p>
                                    <p><strong>Gender:</strong> {gender}</p>
                                    <p><strong>Client Type:</strong> {clientType}</p>
                                    <p><strong>Client Classification:</strong> {clientClassification}</p>
                                    <p><strong>External ID:</strong> {externalId}</p>
                                    <p><strong>Submitted On:</strong> {submittedOn}</p>
                                    <p><strong>Open Savings Account:</strong> {openSavingsAccount ? "Yes" : "No"}</p>
                                </div>
                                <div className="review-section-column">
                                    <h4>Family Members</h4>
                                    {familyMembers.length > 0 ? (
                                        familyMembers.map((member, index) => (
                                            <div key={index}>
                                                <p><strong>Family Member {index + 1}</strong></p>
                                                <p><strong>First Name:</strong> {member.firstName}</p>
                                                <p><strong>Middle Name:</strong> {member.middleName}</p>
                                                <p><strong>Last Name:</strong> {member.lastName}</p>
                                                <p><strong>Mobile Number:</strong> {member.mobileNumber}</p>
                                                <p><strong>Age:</strong> {member.age}</p>
                                                <p><strong>Dependent:</strong> {member.isDependent ? "Yes" : "No"}</p>
                                                <p><strong>Gender:</strong> {member.gender}</p>
                                                <p><strong>Profession:</strong> {member.profession}</p>
                                                <p><strong>Marital Status:</strong> {member.maritalStatus}</p>
                                                <p><strong>Date of Birth:</strong> {member.dateOfBirth}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No family members added.</p>
                                    )}
                                    <h4>Addresses</h4>
                                    {addresses.length > 0 ? (
                                        addresses.map((address, index) => (
                                            <div key={index}>
                                                <p><strong>Address {index + 1}</strong></p>
                                                <p><strong>Address Type:</strong> {address.addressType}</p>
                                                <p><strong>Address Line 1:</strong> {address.addressLine1}</p>
                                                <p><strong>Address Line 2:</strong> {address.addressLine2}</p>
                                                <p><strong>Country:</strong> {address.country}</p>
                                                <p><strong>Province/State:</strong> {address.province}</p>
                                                <p><strong>City:</strong> {address.city}</p>
                                                <p><strong>Postal Code:</strong> {address.postalCode}</p>
                                                <p><strong>Is Active:</strong> {address.isActive ? "Yes" : "No"}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No addresses added.</p>
                                    )}
                                </div>
                            </div>
                            <div className="navigation-buttons">
                                <button onClick={goBack} className="back-button">Back</button>
                                <button type="submit" className="submit-button" disabled={!isFormComplete}>Submit</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );

};

export default AddClientForm;
