import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import {
  addOnboardingNotification,
  addNotification,
  removeNotification,
} from "../redux/slice/notification";

const UserManager: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const notification = useSelector((state: RootState) => state.notification);

  // Check for onboarding notification when user logs in or registers
  useEffect(() => {
    if (user.isLoggedIn) {
      // Check if user profile is incomplete
      const hasIncompleteProfile =
        !user.primaryInformation?.firstName ||
        !user.primaryInformation?.lastName ||
        !user.primaryInformation?.email ||
        !user.primaryInformation?.phone;

      if (hasIncompleteProfile) {
        // Check if any onboarding notification exists (read or unread)
        const hasAnyOnboardingNotification = notification.items.some(
          (item) => item.type === "onboarding"
        );

        if (!hasAnyOnboardingNotification) {
          dispatch(addOnboardingNotification());
        }
      } else {
        // If profile is complete, remove any onboarding notifications
        const onboardingNotifications = notification.items.filter(
          (item) => item.type === "onboarding"
        );

        onboardingNotifications.forEach((notification) => {
          dispatch(removeNotification(notification.id));
        });
      }
    }
  }, [user.isLoggedIn, user.primaryInformation, dispatch, notification.items]);

  // Add welcome notification for new users (optional)
  // useEffect(() => {
  //   if (user.isLoggedIn && user.primaryInformation?.firstName) {
  //     // Check if this is a first-time login (you might want to add a flag to user state)
  //     // For now, we'll just show a welcome message if they don't have other notifications
  //     if (notification.items.length === 0) {
  //       dispatch(
  //         addNotification(
  //           "success",
  //           "Welcome to Nerve Systems Network!",
  //           `Hi ${user.primaryInformation.firstName}! Thanks for joining our community.`,
  //           {
  //             expiresIn: 24 * 60 * 60 * 1000, // 24 hours
  //           }
  //         )
  //       );
  //     }
  //   }
  // }, [
  //   user.isLoggedIn,
  //   user.primaryInformation?.firstName,
  //   dispatch,
  //   notification.items.length,
  // ]);

  return null; // This component doesn't render anything
};

export default UserManager;
