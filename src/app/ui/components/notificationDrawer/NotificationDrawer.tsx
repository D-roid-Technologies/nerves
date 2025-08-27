import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  toggleNotificationDrawer,
  markAsRead,
  markOnboardingAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  cleanupExpiredNotifications,
  Notification,
} from "../../../redux/slice/notification";
import styles from "./NotificationDrawer.module.css";
import { useNavigate } from "react-router-dom";

const NotificationDrawer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  // Clean up expired notifications on mount and periodically
  useEffect(() => {
    dispatch(cleanupExpiredNotifications());

    // Set up interval to clean expired notifications every 5 minutes
    const interval = setInterval(() => {
      dispatch(cleanupExpiredNotifications());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleNotificationClick = (notification: Notification) => {
    // For onboarding notifications, use the special markOnboardingAsRead action
    if (notification.type === "onboarding") {
      if (!notification.isRead) {
        dispatch(markOnboardingAsRead(notification.id));
      }
    } else if (!notification.isRead) {
      // For other notifications, use the regular markAsRead
      dispatch(markAsRead(notification.id));
    }

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      dispatch(toggleNotificationDrawer());
      navigate(notification.actionUrl);
    }
  };

  const handleRemoveNotification = (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation(); // Prevent triggering the notification click
    dispatch(removeNotification(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "onboarding":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case "success":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22,4 12,14.01 9,11.01" />
          </svg>
        );
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case "error":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.notificationDrawer}>
          <div className={styles.notificationHeader}>
            <div className={styles.headerContent}>
              <h2>Notifications</h2>
              {unreadCount > 0 && (
                <span className={styles.unreadBadge}>{unreadCount}</span>
              )}
            </div>
            <div className={styles.headerActions}>
              {items.length > 0 && (
                <>
                  <button
                    className={styles.clearButton}
                    onClick={() => dispatch(clearReadNotifications())}
                    title="Clear read notifications"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </>
              )}
              <button
                className={styles.closeButton}
                onClick={() => dispatch(toggleNotificationDrawer())}
                title="Close notifications"
              >
                &times;
              </button>
            </div>
          </div>

          <div className={styles.notificationItems}>
            {items.length === 0 ? (
              <div className={styles.emptyNotifications}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <p>No notifications yet</p>
                <span>You'll see important updates here</span>
              </div>
            ) : (
              items.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.isRead ? styles.unread : ""
                  } ${
                    notification.type === "onboarding" ? styles.onboarding : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>
                      {notification.title}
                      {!notification.isRead && (
                        <span className={styles.unreadDot}></span>
                      )}
                    </div>
                    <div className={styles.notificationMessage}>
                      {notification.message}
                    </div>
                    <div className={styles.notificationTime}>
                      {formatTimeAgo(notification.createdAt ?? "")}
                    </div>
                    {notification.actionText && (
                      <div className={styles.notificationAction}>
                        {notification.actionText}
                      </div>
                    )}
                  </div>

                  <button
                    className={styles.removeButton}
                    onClick={(e) =>
                      handleRemoveNotification(e, notification.id)
                    }
                    title="Remove notification"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className={styles.notificationFooter}>
              <button
                className={styles.clearAllButton}
                onClick={() => dispatch(clearAllNotifications())}
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationDrawer;
