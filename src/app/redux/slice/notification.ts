import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "onboarding" | "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  isRead: boolean;
  isPersistent?: boolean;
  expiresAt?: string;
  actionUrl?: string;
  actionText?: string;
  createdAt?: string;
}

interface NotificationState {
  items: Notification[];
  isOpen: boolean;
  unreadCount: number;
}

const initialState: NotificationState = {
  items: [],
  isOpen: false,
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action: PayloadAction<Notification>) {
        const notification = action.payload;

        // Check if onboarding notification already exists
        if (notification.type === "onboarding") {
          const existingOnboarding = state.items.find(
            (item) => item.type === "onboarding"
          );
          if (existingOnboarding) {
            return; // Don't add duplicate onboarding notification
          }
        }

        state.items.unshift(notification);
        if (!notification.isRead) {
          state.unreadCount += 1;
        }
      },
      prepare(
        type: Notification["type"],
        title: string,
        message: string,
        options: {
          isPersistent?: boolean;
          actionUrl?: string;
          actionText?: string;
          expiresIn?: number; // in milliseconds
        } = {}
      ) {
        const now = new Date().toISOString();
        const expiresAt = options.expiresIn
          ? new Date(Date.now() + options.expiresIn).toISOString()
          : undefined;

        return {
          payload: {
            id: `${type}_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            type,
            title,
            message,
            isRead: false,
            isPersistent: options.isPersistent || false,
            createdAt: now,
            expiresAt,
            actionUrl: options.actionUrl,
            actionText: options.actionText,
          },
        };
      },
    },

    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(
        (item) => item.id === action.payload
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    // Special action for onboarding notifications
    markOnboardingAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find(
        (item) => item.id === action.payload && item.type === "onboarding"
      );
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    removeNotification(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const notification = state.items[index];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(index, 1);
      }
    },

    clearAllNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },

    clearReadNotifications(state) {
      state.items = state.items.filter((item) => !item.isRead);
    },

    toggleNotificationDrawer(state) {
      state.isOpen = !state.isOpen;
    },

    closeNotificationDrawer(state) {
      state.isOpen = false;
    },

    // Clean up expired notifications
    cleanupExpiredNotifications(state) {
      const now = new Date().toISOString();
      const beforeCount = state.items.length;

      state.items = state.items.filter((item) => {
        // Don't remove onboarding notifications even if expired
        if (item.type === "onboarding") return true;

        if (!item.expiresAt) return true;

        const isExpired = new Date(item.expiresAt) <= new Date(now);
        if (isExpired && !item.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        return !isExpired;
      });
    },

    // Add onboarding notification for new users
    addOnboardingNotification(state) {
      const existingOnboarding = state.items.find(
        (item) => item.type === "onboarding"
      );

      if (!existingOnboarding) {
        const notification: Notification = {
          id: `onboarding_${Date.now()}`,
          type: "onboarding",
          title: "Welcome! Complete Your Profile",
          message:
            "Update your personal information to get the most out of your account.",
          isRead: false,
          isPersistent: true,
          createdAt: new Date().toISOString(),
          actionUrl: "/account",
          actionText: "Complete Profile",
        };

        state.items.unshift(notification);
        state.unreadCount += 1;
      }
    },

    updateUnreadCount(state) {
      state.unreadCount = state.items.filter((item) => !item.isRead).length;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markOnboardingAsRead,
  removeNotification,
  clearAllNotifications,
  clearReadNotifications,
  toggleNotificationDrawer,
  closeNotificationDrawer,
  cleanupExpiredNotifications,
  addOnboardingNotification,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
