import React, {useContext, useEffect, useState} from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import './AddClient.css';
import {useNavigate} from "react-router-dom";
import { API_CONFIG } from '../../config';
import axios from 'axios';
import { useLoading } from '../../context/LoadingContext';
import {AuthContext} from "../../context/AuthContext";

const AddClientForm = () => {
    const [legalForm, setLegalForm] = useState('PERSON');
    const [familyMembers, setFamilyMembers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [openSavingsAccount, setOpenSavingsAccount] = useState(false);
    const [offices, setOffices] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [office, setOffice] = useState('');
    const [staff, setStaff] = useState('');
    const { user } = useContext(AuthContext);

    const { startLoading, stopLoading } = useLoading();
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                stopLoading();
            }
        };

        fetchData().then();
        // eslint-disable-next-line
    }, []);


    const addFamilyMember = () => {
        setFamilyMembers([...familyMembers, {}]);
    };

    const removeFamilyMember = (index) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };

    const addAddress = () => {
        setAddresses([...addresses, {}]);
    };

    const removeAddress = (index) => {
        setAddresses(addresses.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        navigate('/clients');
    };

    return (
        <div className="form-container">
            <h2>Add Client</h2>
            <form className="client-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Office <span>*</span></label>
                        <select value={office} onChange={(e) => setOffice(e.target.value)} required>
                            <option value="">-- Select Office --</option>
                            {offices.map((office) => (
                                <option key={office.id} value={office.id}>
                                    {office.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Staff <span>*</span></label>
                        <select value={staff} onChange={(e) => setStaff(e.target.value)} required>
                            <option value="">-- Select Staff --</option>
                            {staffs.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Legal Form <span>*</span></label>
                    <select onChange={(e) => setLegalForm(e.target.value)}>
                        <option value="PERSON">Person</option>
                        <option value="ENTITY">Entity</option>
                    </select>
                </div>

                {legalForm === 'PERSON' && (
                    <>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name <span>*</span></label>
                                <input type="text" placeholder="Enter First Name"/>
                            </div>
                            <div className="form-group">
                                <label>Middle Name</label>
                                <input type="text" placeholder="Enter Middle Name"/>
                            </div>
                            <div className="form-group">
                                <label>Last Name <span>*</span></label>
                                <input type="text" placeholder="Enter Last Name"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="text" placeholder="Enter Mobile Number"/>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input type="date"/>
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select>
                                    <option value="">-- Select Gender --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Client Type</label>
                                <select>
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
                                <select>
                                    <option value="">-- Select Classification --</option>
                                    <option value="Rural">Rural</option>
                                    <option value="Urban">Urban</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>External ID</label>
                            <input type="text" placeholder="Enter External ID"/>
                        </div>
                        <div className="form-row">
                            <div className="form-group radio-group">
                                <label>Active</label>
                                <input
                                    type="checkbox"
                                    name="active"
                                    className="radio-input"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Submitted On</label>
                                <input type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                            </div>
                        </div>
                        <div className="form-group radio-group">
                            <label>Open Savings Account</label>
                            <input
                                type="checkbox"
                                name="openSavingsAccount"
                                className="radio-input"
                                checked={openSavingsAccount}
                                onChange={() => setOpenSavingsAccount(!openSavingsAccount)}
                            />
                        </div>
                    </>
                )}

                {legalForm === 'ENTITY' && (
                    <>
                        <div className="form-group">
                            <label>Name <span>*</span></label>
                            <input type="text" placeholder="Enter Name"/>
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="text" placeholder="Enter Mobile Number"/>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Incorporation Date</label>
                                <input type="date"/>
                            </div>
                            <div className="form-group">
                                <label>Incorporation Valid Until</label>
                                <input type="date"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Client Type</label>
                                <select>
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
                                <select>
                                    <option value="">-- Select Classification --</option>
                                    <option value="Rural">Rural</option>
                                    <option value="Urban">Urban</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Incorporation Number</label>
                                <input type="text" placeholder="Enter Incorporation Number"/>
                            </div>
                            <div className="form-group">
                                <label>Main Business Line</label>
                                <select>
                                    <option value="">-- Select Business Line --</option>
                                    <option value="Trading">Trading</option>
                                    {/* Add other options */}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Constitution</label>
                            <select>
                                <option value="PT">PT</option>
                                <option value="CV">CV</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Remarks</label>
                            <textarea rows="3" placeholder="Enter Remarks"></textarea>
                        </div>
                        <div className="form-row">
                            <div className="form-group radio-group">
                                <label>Active</label>
                                <input
                                    type="checkbox"
                                    name="activeEntity"
                                    className="radio-input"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Submitted On</label>
                                <input type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                            </div>
                        </div>
                        <div className="form-group radio-group">
                            <label>Open Savings Account</label>
                            <input
                                type="checkbox"
                                name="openSavingsAccountEntity"
                                className="radio-input"
                                checked={openSavingsAccount}
                                onChange={() => setOpenSavingsAccount(!openSavingsAccount)}
                            />
                        </div>
                    </>
                )}

                <div className="family-members">
                    <h3>Family Members</h3>
                    {familyMembers.map((member, index) => (
                        <div className="family-member-form" key={index}>
                            <h4>Family Member {index + 1}</h4>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name <span>*</span></label>
                                    <input type="text" placeholder="Enter First Name"/>
                                </div>
                                <div className="form-group">
                                    <label>Middle Name</label>
                                    <input type="text" placeholder="Enter Middle Name"/>
                                </div>
                                <div className="form-group">
                                    <label>Last Name <span>*</span></label>
                                    <input type="text" placeholder="Enter Last Name"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" placeholder="Enter Mobile Number"/>
                                </div>
                                <div className="form-group">
                                    <label>Age</label>
                                    <input type="number" min="1" max="150" placeholder="Enter Age"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group radio-group">
                                    <label>Is Dependent?</label>
                                    <input type="checkbox" className="checkbox-input"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Gender</label>
                                <select>
                                    <option value="">-- Select Gender --</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Profession</label>
                                <select>
                                    <option value="">-- Select Profession --</option>
                                    <option value="Business">Business Person</option>
                                    <option value="Employed">Employed</option>
                                    <option value="Self Employed">Self Employed</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marital Status</label>
                                    <select>
                                        <option value="">-- Select Marital Status --</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date"/>
                                </div>
                            </div>

                            <div className="remove-icon" onClick={() => removeFamilyMember(index)}>
                                <FaMinus className="react-icon-minus"/> Remove
                            </div>
                        </div>
                    ))}
                    {familyMembers.length < 4 && (
                        <div className="add-family-member" onClick={addFamilyMember}>
                            <FaPlus className="react-icon-plus"/> Add Family Member
                        </div>
                    )}
                </div>

                {/* Address Section */}
                <div className="addresses">
                    <h3>Addresses</h3>
                    {addresses.map((address, index) => (
                        <div className="address-form" key={index}>
                            <h4>Address {index + 1}</h4>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address Type <span>*</span></label>
                                    <select>
                                        <option value="">-- Select Address Type --</option>
                                        <option value="Permanent">Permanent</option>
                                        <option value="Present">Present</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Address Line 1</label>
                                    <input type="text" placeholder="Enter Address Line 1"/>
                                </div>
                                <div className="form-group">
                                    <label>Address Line 2</label>
                                    <input type="text" placeholder="Enter Address Line 2"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    <input type="text" placeholder="Enter Country"/>
                                </div>
                                <div className="form-group">
                                    <label>Province/State</label>
                                    <input type="text" placeholder="Enter Province/State"/>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" placeholder="Enter City"/>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input type="text" placeholder="Enter Postal Code"/>
                                </div>
                                <div className="form-group radio-group">
                                    <label>Is Active?</label>
                                    <input type="checkbox" className="checkbox-input"/>
                                </div>
                            </div>

                            <div className="remove-icon" onClick={() => removeAddress(index)}>
                                <FaMinus className="react-icon-minus"/>
                            </div>
                        </div>
                    ))}
                    {addresses.length < 4 && (
                        <div className="add-address" onClick={addAddress}>
                            <FaPlus className="react-icon-plus"/> Add Address
                        </div>
                    )}
                </div>

                <div className="submit-button-container">
                    <button type="submit" className="submit-button">Submit</button>
                    <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddClientForm;
