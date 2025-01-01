// import React, { createContext, useState, useContext } from 'react';
//
// const NotificationsContext = createContext();
//
// export const useNotifications = () => {
//     const context = useContext(NotificationsContext);
//     if (!context) {
//         throw new Error('useNotifications must be used within a NotificationsProvider');
//     }
//     return context;
// };
//
// const NotificationsProvider = ({ children }) => {
//     const [notifications, setNotifications] = useState([]);
//
//     const addNotification = (message, type = 'info') => {
//         setNotifications((prev) => [...prev, { id: Date.now(), message, type }]);
//         // Automatically dismiss notifications after 5 seconds
//         setTimeout(() => {
//             setNotifications((prev) => prev.filter((n) => n.id !== notifications[0]?.id));
//         }, 5000);
//     };
//
//     return (
//         <NotificationsContext.Provider value={{ addNotification }}>
//             {children}
//             <div className="notifications-container">
//                 {notifications.map((n) => (
//                     <div key={n.id} className={`c-notification ${n.type}`}>
//                         {n.message}
//                     </div>
//                 ))}
//             </div>
//         </NotificationsContext.Provider>
//     );
// };
//
// export default NotificationsProvider;
