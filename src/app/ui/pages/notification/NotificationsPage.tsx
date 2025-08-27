import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  markAsRead,
  markOnboardingAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  cleanupExpiredNotifications,
  Notification,
} from "../../../redux/slice/notification";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationsPage.module.css";

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  // Clean up expired notifications on mount
  useEffect(() => {
    dispatch(cleanupExpiredNotifications());
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
      navigate(notification.actionUrl);
    }
  };

  const handleRemoveNotification = (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.stopPropagation();
    dispatch(removeNotification(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "onboarding":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
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
            width="24"
            height="24"
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
            width="24"
            height="24"
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
            width="24"
            height="24"
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
            width="24"
            height="24"
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

  const filteredNotifications = items.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.isRead;
      case "read":
        return notification.isRead;
      default:
        return true;
    }
  });

  return (
    <div className={styles.notificationsPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount} unread</span>
            )}
          </div>

          <div className={styles.actions}>
            {items.length > 0 && (
              <>
                <button
                  className={styles.actionButton}
                  onClick={() => dispatch(clearReadNotifications())}
                >
                  Clear Read
                </button>
                <button
                  className={styles.actionButtonDanger}
                  onClick={() => dispatch(clearAllNotifications())}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All ({items.length})
          </button>
          <button
            className={`${styles.filterTab} ${
              filter === "unread" ? styles.active : ""
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread ({items.filter((n) => !n.isRead).length})
          </button>
          <button
            className={`${styles.filterTab} ${
              filter === "read" ? styles.active : ""
            }`}
            onClick={() => setFilter("read")}
          >
            Read ({items.filter((n) => n.isRead).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {filteredNotifications.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
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
              <h3>
                {filter === "all"
                  ? "No notifications yet"
                  : filter === "unread"
                  ? "No unread notifications"
                  : "No read notifications"}
              </h3>
              <p>
                {filter === "all"
                  ? "You'll see important updates and messages here"
                  : filter === "unread"
                  ? "All caught up! No new notifications"
                  : "No read notifications to display"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
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
                  <div className={styles.notificationHeader}>
                    <h3 className={styles.notificationTitle}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className={styles.unreadDot}></span>
                    )}
                    <span className={styles.notificationTime}>
                      {formatTimeAgo(notification.createdAt ?? "")}
                    </span>
                  </div>

                  <p className={styles.notificationMessage}>
                    {notification.message}
                  </p>

                  {notification.actionText && (
                    <div className={styles.notificationAction}>
                      <span className={styles.actionText}>
                        {notification.actionText}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>
                  )}
                </div>

                <button
                  className={styles.removeButton}
                  onClick={(e) => handleRemoveNotification(e, notification.id)}
                  title="Remove notification"
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
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
