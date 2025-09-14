// NotificationBell.jsx
import React, { useState } from 'react';
import { Bell, X, Users, Calendar, MessageCircle, Award } from 'lucide-react';
import '../styles/notification.css'; // Import the CSS file

const NotificationBell = () => {
    const [hasNotification, setHasNotification] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'group_invite',
            title: 'Group Invitation',
            message: 'Aarav invited you to join GYM group',
            time: '2 min ago',
            icon: Users,
            unread: true,
            iconColor: 'blue'
        },
        {
            id: 2,
            type: 'task_due',
            title: 'Task Due Soon',
            message: 'Complete workout plan review by tomorrow',
            time: '1 hour ago',
            icon: Calendar,
            unread: true,
            iconColor: 'orange'
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'Sarah commented on your workout progress',
            time: '3 hours ago',
            icon: MessageCircle,
            unread: false,
            iconColor: 'green'
        },
        {
            id: 4,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: 'You completed 7 days streak',
            time: '1 day ago',
            icon: Award,
            unread: false,
            iconColor: 'purple'
        }
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, unread: false } : n
        ));
    };

    const clearAll = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
        setHasNotification(false);
    };

    const addNewNotification = () => {
        setNotifications([...notifications, {
            id: Date.now(),
            type: 'new',
            title: 'New Notification',
            message: 'This is a new test notification',
            time: 'Just now',
            icon: Bell,
            unread: true,
            iconColor: 'cyan'
        }]);
        setHasNotification(true);
    };

    return (
        <div className="notification-container">
            <div className="bell-wrapper">
                {/* Bell Container */}
                <div className="bell-container" onClick={toggleDropdown}>
                    <Bell className={`bell-icon ${hasNotification ? 'has-notification' : ''}`} />

                    {/* Notification Badge */}
                    {unreadCount > 0 && (
                        <div className="notification-badge">
                            <div className="badge-ping"></div>
                            <div className="badge-count">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </div>
                        </div>
                    )}

                </div>

                {/* Notification Dropdown */}
                {showDropdown && (
                    <>
                        <div className="notification-dropdown">
                            <div className="dropdown-container">
                                {/* Header */}
                                <div className="dropdown-header">
                                    <h3 className="dropdown-title">Notifications</h3>
                                    <div className="header-actions">
                                        {unreadCount > 0 && (
                                            <button onClick={clearAll} className="mark-all-read">
                                                Mark all read
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowDropdown(false)}
                                            className="close-button"
                                        >
                                            <X className="close-icon" />
                                        </button>
                                    </div>
                                </div>

                                {/* Notifications List */}
                                <div className="notifications-list">
                                    {notifications.map((notification) => {
                                        const IconComponent = notification.icon;
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`notification-item ${notification.unread ? 'unread' : ''}`}
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <div className="notification-content">
                                                    {/* Icon */}
                                                    <div className={`notification-icon ${notification.iconColor}`}>
                                                        <IconComponent />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="notification-details">
                                                        <div className="notification-header">
                                                            <h4 className="notification-title">
                                                                {notification.title}
                                                            </h4>
                                                            {notification.unread && (
                                                                <div className="unread-dot"></div>
                                                            )}
                                                        </div>
                                                        <p className="notification-message">
                                                            {notification.message}
                                                        </p>
                                                        <p className="notification-time">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Hover Indicator */}
                                                <div className="hover-indicator"></div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div className="dropdown-footer">
                                    <button className="view-all-button">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Click Outside Overlay */}
                        <div
                            className="click-overlay"
                            onClick={() => setShowDropdown(false)}
                        ></div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationBell;