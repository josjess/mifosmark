import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { API_CONFIG } from '../../../config';
import { NotificationContext } from '../../../context/NotificationContext';
import { useLoading } from '../../../context/LoadingContext'; // Importing the loader context

const ManageEmployeesModal = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useContext(NotificationContext);
    const { startLoading, stopLoading } = useLoading(); // Loader context hooks

    const [employees, setEmployees] = useState([]);
    const [newEmployeeData, setNewEmployeeData] = useState({
        firstName: '',
        lastName: '',
        mobileNumber: '',
        email: '',
        officeId: '',
        active: true,
    });
    const [offices, setOffices] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const API_BASE_URL = API_CONFIG.baseURL;
            const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

            const headers = {
                'Authorization': `Basic ${AUTH_TOKEN}`,
                'Content-Type': 'application/json',
                'Fineract-Platform-TenantId': 'default',
            };

            try {
                startLoading();
                const [employeesResponse, officesResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/staff`, { headers }),
                    fetch(`${API_BASE_URL}/offices`, { headers })
                ]);

                const employeesData = await employeesResponse.json();
                const officesData = await officesResponse.json();

                setEmployees(employeesData);
                setOffices(officesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                showNotification('Error fetching data', 'error');
            } finally {
                stopLoading();
            }
        };

        fetchEmployees();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployeeData({ ...newEmployeeData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const API_BASE_URL = API_CONFIG.baseURL;
        const AUTH_TOKEN = user.base64EncodedAuthenticationKey;

        const headers = {
            'Authorization': `Basic ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            'Fineract-Platform-TenantId': 'default',
        };

        const payload = {
            firstname: newEmployeeData.firstName,
            lastname: newEmployeeData.lastName,
            mobileNo: newEmployeeData.mobileNumber,
            email: newEmployeeData.email,
            officeId: parseInt(newEmployeeData.officeId),
            active: newEmployeeData.active,
        };

        try {
            startLoading();
            const response = await fetch(`${API_BASE_URL}/staff`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                showNotification(`Error: ${errorData.message || errorData.errors.map(err => err.defaultUserMessage).join(', ')}`, 'error');
            } else {
                showNotification('Employee created successfully!', 'success');
                closeModal();
            }
        } catch (error) {
            showNotification('Error connecting to API', 'error');
            console.error('Error:', error);
        } finally {
            stopLoading();
        }
    };

    return (
        <div>
            <h2 className="modal-title">Manage Employees</h2>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    type="text"
                    name="firstName"
                    value={newEmployeeData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="lastName"
                    value={newEmployeeData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                />
                <label>Mobile Number</label>
                <input
                    type="text"
                    name="mobileNumber"
                    value={newEmployeeData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Mobile Number"
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={newEmployeeData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <label>Office</label>
                <select
                    name="officeId"
                    value={newEmployeeData.officeId}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Office</option>
                    {offices.map((office) => (
                        <option key={office.id} value={office.id}>
                            {office.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>

            <h3>Current Employees</h3>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>
                        {employee.firstname} {employee.lastname} - {employee.mobileNo} - {employee.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageEmployeesModal;
