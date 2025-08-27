// hooks/useNotifications.ts
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  addNotification,
  addOnboardingNotification,
  cleanupExpiredNotifications,
  removeNotification,
} from "../redux/slice/notification";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const notifications = useSelector((state: RootState) => state.notification);

  // Handle user registration - add onboarding notification
  const handleUserRegistration = () => {
    if (user.isLoggedIn && user.primaryInformation?.firstName) {
      // Check if any onboarding notification already exists
      const hasOnboardingNotification = notifications.items.some(
        (item) => item.type === "onboarding"
      );

      if (!hasOnboardingNotification) {
        dispatch(addOnboardingNotification());
      }
    }
  };

  // Handle user login - check if onboarding notification should be shown
  const handleUserLogin = () => {
    if (user.isLoggedIn) {
      // Check if user profile is incomplete
      const hasIncompleteProfile =
        !user.primaryInformation?.firstName ||
        !user.primaryInformation?.lastName ||
        !user.primaryInformation?.email;

      if (hasIncompleteProfile) {
        // Check if any onboarding notification already exists
        const hasOnboardingNotification = notifications.items.some(
          (item) => item.type === "onboarding"
        );

        if (!hasOnboardingNotification) {
          dispatch(addOnboardingNotification());
        }
      } else {
        // If profile is complete, remove any onboarding notifications
        const onboardingNotifications = notifications.items.filter(
          (item) => item.type === "onboarding"
        );

        onboardingNotifications.forEach((notification) => {
          dispatch(removeNotification(notification.id));
        });
      }
    }
  };

  // Add success notification
  const addSuccessNotification = (title: string, message: string) => {
    dispatch(addNotification("success", title, message));
  };

  // Add error notification
  const addErrorNotification = (title: string, message: string) => {
    dispatch(addNotification("error", title, message));
  };

  // Add warning notification
  const addWarningNotification = (title: string, message: string) => {
    dispatch(addNotification("warning", title, message));
  };

  // Add info notification
  const addInfoNotification = (
    title: string,
    message: string,
    actionUrl?: string,
    actionText?: string
  ) => {
    dispatch(
      addNotification("info", title, message, { actionUrl, actionText })
    );
  };

  // Clean up expired notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(cleanupExpiredNotifications());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    notifications: notifications.items,
    unreadCount: notifications.unreadCount,
    isOpen: notifications.isOpen,
    handleUserRegistration,
    handleUserLogin,
    addSuccessNotification,
    addErrorNotification,
    addWarningNotification,
    addInfoNotification,
  };
};
    