import React, {useContext, useEffect, useState} from 'react';
import {FaEdit, FaPlus, FaTrash} from 'react-icons/fa';
import './AddClient.css';
import {useNavigate} from "react-router-dom";
import { API_CONFIG } from '../../../config';
import axios from 'axios';
import { useLoading } from '../../../context/LoadingContext';
import {AuthContext} from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const stages = [
    "Basic User Info",
    "Additional Details",
    "Family Members",
    "Addresses",
];

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
        if (currentEditIndex !== null) {
            const updatedFamilyMembers = [...familyMembers];
            updatedFamilyMembers[currentEditIndex] = newFamilyMember;
            setFamilyMembers(updatedFamilyMembers);
        } else {
            setFamilyMembers([...familyMembers, newFamilyMember]);
        }

        setCurrentEditIndex(null);
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
        if (currentEditAddressIndex !== null) {
            const updatedAddresses = [...addresses];
            updatedAddresses[currentEditAddressIndex] = newAddress;
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, newAddress]);
        }

        setCurrentEditAddressIndex(null);
        setNewAddress({
            addressType: '',
            addressLine1: '',
            addressLine2: '',
            country: '',
            province: '',
            city: '',
            postalCode: '',
            isActive: false,
        });
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
            incorporationNumber !== '' &&
            submittedOn !== '');
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

    const [currentStage, setCurrentStage] = useState(0);
    const [completedStages, setCompletedStages] = useState(new Set());
    const [allStagesComplete, setAllStagesComplete] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);
    const [currentEditAddressIndex, setCurrentEditAddressIndex] = useState(null);


    useEffect(() => {
        setAllStagesComplete(
            completedStages.size === stages.length
        );
    }, [completedStages, stages.length]);

    const renderStageTracker = () => {
        const trackerStages = allStagesComplete
            ? [...stages, "Preview"]
            : stages;

        return (
            <div className="staged-form-stage-tracker">
                {trackerStages.map((stage, index) => (
                    <div
                        key={stage}
                        className={`staged-form-stage ${
                            index === currentStage
                                ? "staged-form-active"
                                : completedStages.has(stage)
                                    ? "staged-form-completed"
                                    : "staged-form-unvisited"
                        }`}
                        onClick={() => {
                            if (completedStages.has(stage)) {
                                setCurrentStage(index);
                            }
                        }}
                    >
                        <span className="staged-form-stage-circle">{index + 1}</span>
                        <span className="staged-form-stage-label">{stage}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderStageContent = () => {
        switch (stages[currentStage]) {
            case "Basic User Info":
                return (
                    <div className="staged-form-basic-info">
                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="office">
                                    Office <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="office"
                                    value={office}
                                    onChange={(e) => setOffice(e.target.value)}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Office --</option>
                                    {offices.map((office) => (
                                        <option key={office.id} value={office.id}>
                                            {office.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="staged-form-field">
                                <label htmlFor="staff">
                                    Staff <span className="staged-form-required">*</span>
                                </label>
                                <select
                                    id="staff"
                                    value={staff}
                                    onChange={(e) => setStaff(e.target.value)}
                                    className="staged-form-select"
                                    required
                                >
                                    <option value="">-- Select Staff --</option>
                                    {staffs.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.displayName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="staged-form-field">
                            <label htmlFor="legalForm">
                                Legal Form <span className="staged-form-required">*</span>
                            </label>
                            <select
                                id="legalForm"
                                value={legalForm}
                                onChange={(e) => setLegalForm(e.target.value)}
                                className="staged-form-select"
                            >
                                <option value="PERSON">Person</option>
                                <option value="ENTITY">Entity</option>
                            </select>
                        </div>

                        {legalForm === "PERSON" ? (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="firstName">
                                            First Name <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter First Name"
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="middleName">Middle Name</label>
                                        <input
                                            id="middleName"
                                            type="text"
                                            value={middleName}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Middle Name"
                                        />
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="lastName">
                                            Last Name <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Last Name"
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                        <input
                                            id="mobileNumber"
                                            type="text"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="name">
                                            Name <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Name"
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="mobileNumber">Mobile Number</label>
                                        <input
                                            id="mobileNumber"
                                            type="text"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="staged-form-field">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                />
                                Activate Client
                            </label>
                        </div>
                    </div>
                );

            case "Additional Details":
                return (
                    <div className="staged-form-additional-details">
                        {legalForm === "PERSON" ? (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="dateOfBirth">
                                            Date of Birth <span className="staged-form-required">*</span>
                                        </label>
                                        <DatePicker
                                            id="dateOfBirth"
                                            selected={dateOfBirth ? new Date(dateOfBirth) : null}
                                            onChange={(date) =>
                                                setDateOfBirth(date.toISOString().split("T")[0])
                                            }
                                            className="staged-form-input"
                                            placeholderText="Select Date of Birth"
                                            dateFormat="MMMM d, yyyy"
                                            showPopperArrow={false}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            minDate={new Date(1900, 0, 1)}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="gender">
                                            Gender <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="gender"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="staged-form-select"
                                        >
                                            <option value="">-- Select Gender --</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="clientType">
                                            Client Type <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="clientType"
                                            value={clientType}
                                            onChange={(e) => setClientType(e.target.value)}
                                            className="staged-form-select"
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
                                    <div className="staged-form-field">
                                        <label htmlFor="clientClassification">
                                            Client Classification <span className="staged-form-required">*</span>
                                        </label>
                                        <select
                                            id="clientClassification"
                                            value={clientClassification}
                                            onChange={(e) => setClientClassification(e.target.value)}
                                            className="staged-form-select"
                                        >
                                            <option value="">-- Select Classification --</option>
                                            <option value="Rural">Rural</option>
                                            <option value="Urban">Urban</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incorporationDate">
                                            Incorporation Date <span className="staged-form-required">*</span>
                                        </label>
                                        <DatePicker
                                            id="incorporationDate"
                                            selected={incorporationDate ? new Date(incorporationDate) : null}
                                            onChange={(date) =>
                                                setIncorporationDate(date.toISOString().split("T")[0])
                                            }
                                            className="staged-form-select"
                                            placeholderText="Select Incorporation Date"
                                            dateFormat="MMMM d, yyyy"
                                            showPopperArrow={false}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            minDate={new Date(1900, 0, 1)}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="incorporationValidUntil">
                                            Valid Until <span className="staged-form-required">*</span>
                                        </label>
                                        <DatePicker
                                            id="incorporationValidUntil"
                                            selected={incorporationValidUntil ? new Date(incorporationValidUntil) : null}
                                            onChange={(date) =>
                                                setIncorporationValidUntil(date.toISOString().split("T")[0])
                                            }
                                            className="staged-form-input"
                                            placeholderText="Select Valid Until Date"
                                            dateFormat="MMMM d, yyyy"
                                            showPopperArrow={false}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            minDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="incorporationNumber">
                                            Incorporation Number <span className="staged-form-required">*</span>
                                        </label>
                                        <input
                                            id="incorporationNumber"
                                            type="text"
                                            value={incorporationNumber}
                                            onChange={(e) => setIncorporationNumber(e.target.value)}
                                            className="staged-form-input"
                                            placeholder="Enter Incorporation Number"
                                            required
                                        />
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="mainBusinessLine">Main Business Line</label>
                                        <select
                                            id="mainBusinessLine"
                                            value={mainBusinessLine}
                                            onChange={(e) => setMainBusinessLine(e.target.value)}
                                            className="staged-form-select"
                                        >
                                            <option value="">-- Select Business Line --</option>
                                            <option value="Trading">Trading</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="staged-form-row">
                                    <div className="staged-form-field">
                                        <label htmlFor="constitution">Constitution</label>
                                        <select
                                            id="constitution"
                                            value={constitution}
                                            onChange={(e) => setConstitution(e.target.value)}
                                            className="staged-form-select"
                                        >
                                            <option value="PT">PT</option>
                                            <option value="CV">CV</option>
                                        </select>
                                    </div>
                                    <div className="staged-form-field">
                                        <label htmlFor="remarks">Remarks</label>
                                        <textarea
                                            id="remarks"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            className="staged-form-textarea"
                                            placeholder="Enter Remarks"
                                        ></textarea>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="staged-form-row">
                            <div className="staged-form-field">
                                <label htmlFor="submittedOn">
                                    Submitted On <span className="staged-form-required">*</span>
                                </label>
                                <DatePicker
                                    id="submittedOn"
                                    selected={submittedOn ? new Date(submittedOn) : null}
                                    onChange={(date) => {
                                        setSubmittedOn(date.toISOString().split("T")[0]);
                                    }}
                                    className="staged-form-input"
                                    placeholderText="Select Submission Date"
                                    dateFormat="MMMM d, yyyy"
                                    showPopperArrow={false}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={new Date(1900, 0, 1)}
                                    maxDate={new Date()}
                                />
                            </div>

                            <div className="staged-form-field">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={openSavingsAccount}
                                        onChange={() => setOpenSavingsAccount(!openSavingsAccount)}
                                    />
                                    Open Savings Account
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case "Family Members":
                return (
                    <div className="staged-form-family-members">
                        <div className="t-head">
                            <h3>Family Members</h3>
                            <div
                                className="add-family-member"
                                onClick={() => setShowModal(true)}
                            >
                                <FaPlus className="react-icon-plus"/> Add Family Member
                            </div>
                        </div>
                        <table className="staged-form-table">
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
                                    <td colSpan="7" className="staged-form-no-data">
                                        No family members added.
                                    </td>
                                </tr>
                            ) : (
                                familyMembers.map((member, index) => (
                                    <tr key={index}>
                                        <td>{member.firstName}</td>
                                        <td>{member.middleName}</td>
                                        <td>{member.lastName}</td>
                                        <td>{member.mobileNumber}</td>
                                        <td>{member.age}</td>
                                        <td>{member.isDependent ? "Yes" : "No"}</td>
                                        <td>
                                            <button
                                                className="edit-icon"
                                                onClick={() => handleEditFamilyMember(index)}
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button
                                                className="remove-icon"
                                                onClick={() => removeFamilyMember(index)}
                                            >
                                                <FaTrash/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                );

            case "Addresses":
                return (
                    <div className="staged-form-addresses">
                        <div className="t-head">
                            <h3>Addresses</h3>
                            <div
                                className="add-family-member"
                                onClick={() => setShowAddressModal(true)}
                            >
                                <FaPlus className="react-icon-plus"/> Add Address
                            </div>
                        </div>
                        <table className="staged-form-table">
                            <thead>
                            <tr>
                                <th>Address Type</th>
                                <th>Address Line 1</th>
                                <th>Country</th>
                                <th>Province</th>
                                <th>City</th>
                                <th>Postal Code</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {addresses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="staged-form-no-data">
                                        No addresses added.
                                    </td>
                                </tr>
                            ) : (
                                addresses.map((address, index) => (
                                    <tr key={index}>
                                        <td>{address.addressType}</td>
                                        <td>{address.addressLine1}</td>
                                        <td>{address.country}</td>
                                        <td>{address.province}</td>
                                        <td>{address.city}</td>
                                        <td>{address.postalCode}</td>
                                        <td>{address.isActive ? "Yes" : "No"}</td>
                                        <td>
                                            <button
                                                className="edit-icon"
                                                onClick={() => handleEditAddress(index)}
                                            >
                                                <FaEdit/>
                                            </button>
                                            <button
                                                className="remove-icon"
                                                onClick={() => removeAddress(index)}
                                            >
                                                <FaTrash/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderPreviewSection = () => {
        const getOfficeName = () => {
            const officeObj = offices.find((o) => o.id === parseInt(office));
            return officeObj ? officeObj.name : "N/A";
        };

        const getStaffName = () => {
            const staffObj = staffs.find((s) => s.id === parseInt(staff));
            return staffObj ? staffObj.displayName : "N/A";
        };

        const transformFamilyMembers = () =>
            familyMembers.length > 0
                ? familyMembers.map((member) => ({
                    "First Name": member.firstName || "N/A",
                    "Middle Name": member.middleName || "N/A",
                    "Last Name": member.lastName || "N/A",
                    "Mobile Number": member.mobileNumber || "N/A",
                    Age: member.age || "N/A",
                    Gender: member.gender || "N/A",
                    Profession: member.profession || "N/A",
                    "Marital Status": member.maritalStatus || "N/A",
                    "Date of Birth": member.dateOfBirth
                        ? format(new Date(member.dateOfBirth), "MMMM d, yyyy")
                        : "N/A",
                    Dependent: member.isDependent ? "Yes" : "No",
                }))
                : null;

        const transformAddresses = () =>
            addresses.length > 0
                ? addresses.map((address) => ({
                    "Address Type": address.addressType || "N/A",
                    "Address Line 1": address.addressLine1 || "N/A",
                    "Address Line 2": address.addressLine2 || "N/A",
                    Country: address.country || "N/A",
                    Province: address.province || "N/A",
                    City: address.city || "N/A",
                    "Postal Code": address.postalCode || "N/A",
                    Active: address.isActive ? "Yes" : "No",
                }))
                : null;

        const stageData = [
            {
                title: "Basic User Info",
                data: {
                    Office: getOfficeName(),
                    Staff: getStaffName(),
                    "Legal Form": legalForm || "N/A",
                    ...(legalForm === "PERSON"
                        ? {
                            "First Name": firstName || "N/A",
                            "Middle Name": middleName || "N/A",
                            "Last Name": lastName || "N/A",
                            "Mobile Number": mobileNumber || "N/A",
                        }
                        : {
                            Name: name || "N/A",
                            "Mobile Number": mobileNumber || "N/A",
                        }),
                    "Active Client": isActive ? "Yes" : "No",
                },
            },
            {
                title: "Additional Details",
                data: {
                    ...(legalForm === "PERSON"
                        ? {
                            "Date of Birth": dateOfBirth
                                ? format(new Date(dateOfBirth), "MMMM d, yyyy")
                                : "N/A",
                            Gender: gender || "N/A",
                            "Client Type": clientType || "N/A",
                            "Client Classification": clientClassification || "N/A",
                        }
                        : {
                            "Incorporation Date": incorporationDate
                                ? format(new Date(incorporationDate), "MMMM d, yyyy")
                                : "N/A",
                            "Valid Until": incorporationValidUntil
                                ? format(new Date(incorporationValidUntil), "MMMM d, yyyy")
                                : "N/A",
                            "Incorporation Number": incorporationNumber || "N/A",
                            "Main Business Line": mainBusinessLine || "N/A",
                            Constitution: constitution || "N/A",
                            Remarks: remarks || "N/A",
                            "Submitted On": submittedOn
                                ? format(new Date(submittedOn), "MMMM d, yyyy")
                                : "N/A",
                            "Open Savings Account": openSavingsAccount ? "Yes" : "No",
                        }),
                },
            },
            {
                title: "Family Members",
                data: transformFamilyMembers(),
            },
            {
                title: "Addresses",
                data: transformAddresses(),
            },
        ];

        return (
            <div className="staged-form-preview-section">
                <h2 className="preview-header">Form Preview</h2>
                {stageData.map(({ title, data }, index) => (
                    <div key={title} className="staged-form-preview-block">
                        <div className="staged-form-preview-header">
                            <h4 className="preview-stage-title">{title}</h4>
                            <button
                                className="staged-form-edit-button"
                                onClick={() => setCurrentStage(index)}
                            >
                                Edit
                            </button>
                        </div>
                        {data && typeof data === "object" && !Array.isArray(data) ? (
                            <div className="staged-form-preview-table-wrapper">
                                <table className="staged-form-preview-table">
                                    <thead>
                                    <tr>
                                        <th>Field</th>
                                        <th>Value</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(data).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value || "N/A"}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : Array.isArray(data) && data.length > 0 ? (
                            <table className="staged-form-preview-table">
                                <thead>
                                <tr>
                                    {Object.keys(data[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, idx) => (
                                    <tr key={idx}>
                                        {Object.values(item).map((value, i) => (
                                            <td key={i}>
                                                {typeof value === "object"
                                                    ? JSON.stringify(value)
                                                    : value || "N/A"}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="no-data-message">No data available for this section.</p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const handleNextStage = () => {
        if (currentStage < stages.length) {
            const stageComplete =
                (currentStage === 0 && isStep1Complete) ||
                (currentStage === 1 && isStep2Complete) ||
                (currentStage === 2 && familyMembers.length > 0) ||
                (currentStage === 3 && addresses.length > 0);

            if (stageComplete) {
                setCompletedStages((prev) => {
                    const updatedStages = new Set(prev);
                    updatedStages.add(stages[currentStage]);
                    return updatedStages;
                });
                setCurrentStage((prev) => prev + 1);
            }
        }
    };

    const handleSubmit = () => {
        if (allStagesComplete) {
            console.log("Form submitted successfully!");
        }
    };

    const handleEditFamilyMember = (index) => {
        setCurrentEditIndex(index);
        setNewFamilyMember(familyMembers[index]);
        setShowModal(true);
    };

    const handleEditAddress = (index) => {
        setCurrentEditAddressIndex(index);
        setNewAddress(addresses[index]);
        setShowAddressModal(true);
    };

    return (
        <>
            <div className="staged-form-add-client">
                {renderStageTracker()}
                <div className="staged-form-stage-content">
                    {currentStage === stages.length && allStagesComplete ? (
                        renderPreviewSection()
                    ) : (
                        renderStageContent()
                    )}
                </div>
                <div className="staged-form-stage-buttons">
                    <button
                        onClick={() => setCurrentStage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentStage === 0}
                        className="staged-form-button-previous"
                    >
                        Previous
                    </button>
                    {currentStage < stages.length && (
                        <button
                            onClick={handleNextStage}
                            className="staged-form-button-next"
                            disabled={
                                (currentStage === 0 && !isStep1Complete) ||
                                (currentStage === 1 && !isStep2Complete) ||
                                (currentStage === 2 && familyMembers.length === 0) ||
                                (currentStage === 3 && addresses.length === 0)
                            }
                        >
                            Next
                        </button>
                    )}
                    {currentStage === stages.length && (
                        <button
                            onClick={handleSubmit}
                            className="staged-form-button-next"
                            disabled={!allStagesComplete}
                        >
                            Submit
                        </button>
                    )}
                </div>
            </div>
            {showModal && (
                <div className="create-provisioning-criteria-modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="create-provisioning-criteria-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="create-modal-title">Add Family Member</h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmFirstName" className="create-provisioning-criteria-label">
                                    First Name <span>*</span>
                                </label>
                                <input
                                    id="fmFirstName"
                                    type="text"
                                    value={newFamilyMember.firstName}
                                    onChange={(e) =>
                                        setNewFamilyMember({ ...newFamilyMember, firstName: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter First Name"
                                    required
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmMiddleName" className="create-provisioning-criteria-label">
                                    Middle Name
                                </label>
                                <input
                                    id="fmMiddleName"
                                    type="text"
                                    value={newFamilyMember.middleName}
                                    onChange={(e) =>
                                        setNewFamilyMember({ ...newFamilyMember, middleName: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Middle Name"
                                />
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmLastName" className="create-provisioning-criteria-label">
                                    Last Name <span>*</span>
                                </label>
                                <input
                                    id="fmLastName"
                                    type="text"
                                    value={newFamilyMember.lastName}
                                    onChange={(e) =>
                                        setNewFamilyMember({ ...newFamilyMember, lastName: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Last Name"
                                    required
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmMobileNumber" className="create-provisioning-criteria-label">
                                    Mobile Number
                                </label>
                                <input
                                    id="fmMobileNumber"
                                    type="text"
                                    value={newFamilyMember.mobileNumber}
                                    onChange={(e) =>
                                        setNewFamilyMember({
                                            ...newFamilyMember,
                                            mobileNumber: e.target.value,
                                        })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmAge" className="create-provisioning-criteria-label">
                                    Age <span>*</span>
                                </label>
                                <input
                                    id="fmAge"
                                    type="number"
                                    required
                                    min="0"
                                    max="120"
                                    value={newFamilyMember.age}
                                    onChange={(e) =>
                                        setNewFamilyMember({
                                            ...newFamilyMember,
                                            age: e.target.value,
                                        })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Age"
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmGender" className="create-provisioning-criteria-label">
                                    Gender <span>*</span>
                                </label>
                                <select
                                    id="fmGender"
                                    value={newFamilyMember.gender}
                                    onChange={(e) =>
                                        setNewFamilyMember({...newFamilyMember, gender: e.target.value})
                                    }
                                    className="create-provisioning-criteria-select"
                                >
                                    <option value="">-- Select Gender --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmProfession" className="create-provisioning-criteria-label">
                                    Profession <span>*</span>
                                </label>
                                <select
                                    id="fmProfession"
                                    value={newFamilyMember.profession}
                                    onChange={(e) =>
                                        setNewFamilyMember({
                                            ...newFamilyMember,
                                            profession: e.target.value,
                                        })
                                    }
                                    className="create-provisioning-criteria-select"
                                    required
                                >
                                    <option value="">-- Select Profession --</option>
                                    <option value="Business">Business Person</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Self Employed">Self Employed</option>
                                    <option value="Student">Student</option>
                                    <option value="Unemployed">Unemployed</option>
                                </select>
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmMaritalStatus" className="create-provisioning-criteria-label">
                                    Marital Status
                                </label>
                                <select
                                    id="fmMaritalStatus"
                                    value={newFamilyMember.maritalStatus}
                                    onChange={(e) =>
                                        setNewFamilyMember({
                                            ...newFamilyMember,
                                            maritalStatus: e.target.value,
                                        })
                                    }
                                    className="create-provisioning-criteria-select"
                                >
                                    <option value="">-- Select Marital Status --</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>
                        </div>

                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="fmDateOfBirth" className="create-provisioning-criteria-label">
                                    Date of Birth <span>*</span>
                                </label>
                                <div className="date-picker-container">
                                    <DatePicker
                                        id="fmDateOfBirth"
                                        selected={newFamilyMember.dateOfBirth ? new Date(newFamilyMember.dateOfBirth) : new Date()}
                                        onChange={(date) =>
                                            setNewFamilyMember({
                                                ...newFamilyMember,
                                                dateOfBirth: date.toISOString().split("T")[0],
                                            })
                                        }
                                        className="create-provisioning-criteria-input"
                                        placeholderText="Select Date"
                                        dateFormat="MMMM d, yyyy"
                                        showPopperArrow={false}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        minDate={new Date(1900, 0, 1)}
                                        maxDate={new Date()}
                                    />
                                </div>
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label className="create-provisioning-criteria-label">
                                    <input
                                        type="checkbox"
                                        checked={newFamilyMember.isDependent}
                                        onChange={(e) =>
                                            setNewFamilyMember({
                                                ...newFamilyMember,
                                                isDependent: e.target.checked,
                                            })
                                        }
                                    /> Dependent
                                </label>
                            </div>
                        </div>

                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setShowModal(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addFamilyMember}
                                className="create-provisioning-criteria-confirm"
                                disabled={
                                    !newFamilyMember.firstName ||
                                    !newFamilyMember.lastName ||
                                    !newFamilyMember.age ||
                                    !newFamilyMember.gender
                                }
                            >
                                {currentEditIndex !== null ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showAddressModal && (
                <div
                    className="create-provisioning-criteria-modal-overlay"
                    onClick={() => setShowAddressModal(false)}
                >
                    <div
                        className="create-provisioning-criteria-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="create-modal-title">
                            {currentEditAddressIndex !== null ? "Edit Address" : "Add Address"}
                        </h4>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="addressType" className="create-provisioning-criteria-label">
                                    Address Type <span>*</span>
                                </label>
                                <select
                                    id="addressType"
                                    value={newAddress.addressType}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, addressType: e.target.value })
                                    }
                                    className="create-provisioning-criteria-select"
                                >
                                    <option value="">-- Select Address Type --</option>
                                    <option value="Permanent">Permanent</option>
                                    <option value="Present">Present</option>
                                </select>
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label
                                    htmlFor="addressLine1"
                                    className="create-provisioning-criteria-label"
                                >
                                    Address Line 1 <span>*</span>
                                </label>
                                <input
                                    id="addressLine1"
                                    type="text"
                                    value={newAddress.addressLine1}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, addressLine1: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Address Line 1"
                                    required
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label
                                    htmlFor="addressLine2"
                                    className="create-provisioning-criteria-label"
                                >
                                    Address Line 2
                                </label>
                                <input
                                    id="addressLine2"
                                    type="text"
                                    value={newAddress.addressLine2}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, addressLine2: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Address Line 2"
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="country" className="create-provisioning-criteria-label">
                                    Country <span>*</span>
                                </label>
                                <input
                                    id="country"
                                    type="text"
                                    value={newAddress.country}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, country: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Country"
                                    required
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="province" className="create-provisioning-criteria-label">
                                    Province/State <span>*</span>
                                </label>
                                <input
                                    id="province"
                                    type="text"
                                    value={newAddress.province}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, province: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Province/State"
                                    required
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label htmlFor="city" className="create-provisioning-criteria-label">
                                    City <span>*</span>
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    value={newAddress.city}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, city: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter City"
                                    required
                                />
                            </div>
                            <div className="create-provisioning-criteria-group">
                                <label
                                    htmlFor="postalCode"
                                    className="create-provisioning-criteria-label"
                                >
                                    Postal Code <span>*</span>
                                </label>
                                <input
                                    id="postalCode"
                                    type="text"
                                    value={newAddress.postalCode}
                                    onChange={(e) =>
                                        setNewAddress({ ...newAddress, postalCode: e.target.value })
                                    }
                                    className="create-provisioning-criteria-input"
                                    placeholder="Enter Postal Code"
                                    required
                                />
                            </div>
                        </div>
                        <div className="create-holiday-row">
                            <div className="create-provisioning-criteria-group">
                                <label className='create-provisioning-criteria-label'>
                                    <input
                                        type="checkbox"
                                        checked={newAddress.isActive}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, isActive: e.target.checked })
                                        }
                                    />  Is Active?
                                </label>
                            </div>
                        </div>
                        <div className="create-provisioning-criteria-modal-actions">
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="create-provisioning-criteria-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addAddress}
                                className="create-provisioning-criteria-confirm"
                                disabled={
                                    !newAddress.addressType ||
                                    !newAddress.addressLine1 ||
                                    !newAddress.country ||
                                    !newAddress.city ||
                                    !newAddress.postalCode
                                }
                            >
                                {currentEditAddressIndex !== null ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );

};

export default AddClientForm;
