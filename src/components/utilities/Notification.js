// import React, { useState, useEffect } from "react";
// import axios from "axios";

const NotificationsPage = () => {
    // const [notifications, setNotifications] = useState([]);
    // const [error, setError] = useState(null);
    //
    // // Fetch notifications from the endpoint
    // const fetchNotifications = async () => {
    //     try {
    //         const response = await axios.get(
    //             "https://test.meysa.co.ke/fineract-provider/api/v1/notifications?isRead=false"
    //         );
    //         setNotifications(response.data);
    //         setError(null); // Reset any previous errors
    //     } catch (err) {
    //         setError("Failed to fetch notifications. Please try again.");
    //     }
    // };
    //
    // // Fetch notifications on component mount and periodically refresh
    // useEffect(() => {
    //     fetchNotifications();
    //
    //     const intervalId = setInterval(() => {
    //         fetchNotifications();
    //     }, 10000000000000000); // Refetch every 10 seconds
    //
    //     return () => clearInterval(intervalId); // Cleanup on component unmount
    // }, []);

    return (
        <div className="notifications-container">
            {/*<h1 className="notifications-title">Notifications</h1>*/}

            {/*{error && <p className="error-message">{error}</p>}*/}

            {/*<table className="notifications-table">*/}
            {/*    <thead>*/}
            {/*    <tr>*/}
            {/*        <th>Notification</th>*/}
            {/*        <th>Created At</th>*/}
            {/*    </tr>*/}
            {/*    </thead>*/}
            {/*    <tbody>*/}
            {/*    {notifications.length > 0 ? (*/}
            {/*        notifications.map((notification, index) => (*/}
            {/*            <tr key={index}>*/}
            {/*                <td>{notification.message || "No message provided"}</td>*/}
            {/*                <td>{new Date(notification.createdAt).toLocaleString()}</td>*/}
            {/*            </tr>*/}
            {/*        ))*/}
            {/*    ) : (*/}
            {/*        <tr>*/}
            {/*            <td colSpan="2">No notifications available</td>*/}
            {/*        </tr>*/}
            {/*    )}*/}
            {/*    </tbody>*/}
            {/*</table>*/}
        </div>
    );
};

export default NotificationsPage;
