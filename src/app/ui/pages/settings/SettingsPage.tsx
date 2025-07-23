import type React from "react";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Palette,
  Globe,
  Eye,
  EyeOff,
  Save,
  Camera,
  MapPin,
  Phone,
  Building,
  SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Smartphone,
  Languages,
  DollarSign,
  Package,
  Star,
  MessageSquare,
  Download,
  Trash2,
  LogOut,
} from "lucide-react";
import "./settings.css";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
}

interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  productRecommendations: boolean;
  priceAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  dataCollection: boolean;
  thirdPartySharing: boolean;
  marketingEmails: boolean;
}

interface AppearanceSettings {
  theme: string;
  language: string;
  currency: string;
  timezone: string;
  soundEnabled: boolean;
  animations: boolean;
  compactMode: boolean;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "",
    bio: "Passionate about technology and e-commerce",
    dateOfBirth: "1990-01-15",
    gender: "male",
  });

  const [billingAddress, setBillingAddress] = useState<AddressInfo>({
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  });

  const [shippingAddress, setShippingAddress] = useState<AddressInfo>({
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    productRecommendations: true,
    priceAlerts: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    thirdPartySharing: false,
    marketingEmails: true,
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    language: "en",
    currency: "USD",
    timezone: "America/New_York",
    soundEnabled: true,
    animations: true,
    compactMode: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "preferences", label: "Preferences", icon: SettingsIcon },
  ];

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressUpdate = (
    type: "billing" | "shipping",
    field: keyof AddressInfo,
    value: string
  ) => {
    if (type === "billing") {
      setBillingAddress((prev) => ({ ...prev, [field]: value }));
    } else {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleNotificationUpdate = (
    field: keyof NotificationSettings,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrivacyUpdate = (
    field: keyof PrivacySettings,
    value: string | boolean
  ) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppearanceUpdate = (
    field: keyof AppearanceSettings,
    value: string | boolean
  ) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, avatar: e.target?.result as string }));
        toast.success("Avatar updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log settings to console for backend integration
      console.log(`=== ${section.toUpperCase()} SETTINGS ===`);
      switch (section) {
        case "profile":
          console.log("Profile Data:", profile);
          break;
        case "addresses":
          console.log("Billing Address:", billingAddress);
          console.log("Shipping Address:", shippingAddress);
          break;
        case "notifications":
          console.log("Notification Settings:", notifications);
          break;
        case "privacy":
          console.log("Privacy Settings:", privacy);
          break;
        case "appearance":
          console.log("Appearance Settings:", appearance);
          break;
      }
      console.log("========================");

      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShippingToBilling = () => {
    setBillingAddress({ ...shippingAddress });
    toast.success("Shipping address copied to billing");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Account deletion requested");
      toast.success("Account deletion request submitted");
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    toast.success("Logged out successfully");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="tab-content">
            <div className="section-header">
              <User className="section-icon" />
              <div>
                <h2>Profile Information</h2>
                <p>Update your personal information and profile details</p>
              </div>
            </div>

            <div className="avatar-section">
              <div className="avatar-container">
                {profile.avatar ? (
                  <img
                    src={profile.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <User className="avatar-icon" />
                  </div>
                )}
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <Camera className="camera-icon" />
                </label>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden-input"
                />
              </div>
              <div className="avatar-info">
                <h3>Profile Picture</h3>
                <p>Upload a profile picture. Max size 5MB.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) =>
                    handleProfileUpdate("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) =>
                    handleProfileUpdate("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      handleProfileUpdate("email", e.target.value)
                    }
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      handleProfileUpdate("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) =>
                    handleProfileUpdate("dateOfBirth", e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) =>
                    handleProfileUpdate("gender", e.target.value)
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("profile")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="tab-content">
            <div className="section-header">
              <Lock className="section-icon" />
              <div>
                <h2>Account Security</h2>
                <p>Manage your password and account security settings</p>
              </div>
            </div>

            <div className="security-section">
              <h3>Change Password</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.newPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.confirmPassword}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handlePasswordChange}
                  disabled={isLoading}
                >
                  <Save className="btn-icon" />
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            <div className="danger-zone">
              <h3>Danger Zone</h3>
              <div className="danger-actions">
                <div className="danger-item">
                  <div>
                    <h4>Delete Account</h4>
                    <p>
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="btn-icon" />
                    Delete Account
                  </button>
                </div>

                <div className="danger-item">
                  <div>
                    <h4>Logout</h4>
                    <p>Sign out of your account on this device</p>
                  </div>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut className="btn-icon" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "addresses":
        return (
          <div className="tab-content">
            <div className="section-header">
              <MapPin className="section-icon" />
              <div>
                <h2>Address Management</h2>
                <p>Manage your billing and shipping addresses</p>
              </div>
            </div>

            <div className="addresses-container">
              <div className="address-section">
                <div className="address-header">
                  <h3>Billing Address</h3>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={copyShippingToBilling}
                  >
                    Copy from Shipping
                  </button>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={billingAddress.street}
                      onChange={(e) =>
                        handleAddressUpdate("billing", "street", e.target.value)
                      }
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) =>
                        handleAddressUpdate("billing", "city", e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={billingAddress.state}
                      onChange={(e) =>
                        handleAddressUpdate("billing", "state", e.target.value)
                      }
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressUpdate(
                          "billing",
                          "zipCode",
                          e.target.value
                        )
                      }
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={billingAddress.country}
                      onChange={(e) =>
                        handleAddressUpdate(
                          "billing",
                          "country",
                          e.target.value
                        )
                      }
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="address-section">
                <h3>Shipping Address</h3>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        handleAddressUpdate(
                          "shipping",
                          "street",
                          e.target.value
                        )
                      }
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressUpdate("shipping", "city", e.target.value)
                      }
                      placeholder="Enter city"
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        handleAddressUpdate("shipping", "state", e.target.value)
                      }
                      placeholder="Enter state"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressUpdate(
                          "shipping",
                          "zipCode",
                          e.target.value
                        )
                      }
                      placeholder="Enter ZIP code"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) =>
                        handleAddressUpdate(
                          "shipping",
                          "country",
                          e.target.value
                        )
                      }
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("addresses")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Addresses"}
              </button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="tab-content">
            <div className="section-header">
              <CreditCard className="section-icon" />
              <div>
                <h2>Payment Methods</h2>
                <p>Manage your payment methods and billing information</p>
              </div>
            </div>

            <div className="payment-methods">
              <div className="payment-card">
                <div className="card-info">
                  <CreditCard className="card-icon" />
                  <div>
                    <h4>Visa ending in 4242</h4>
                    <p>Expires 12/2025</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button type="button" className="edit-btn">
                    Edit
                  </button>
                  <button type="button" className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>

              <div className="payment-card">
                <div className="card-info">
                  <CreditCard className="card-icon" />
                  <div>
                    <h4>Mastercard ending in 8888</h4>
                    <p>Expires 06/2026</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button type="button" className="edit-btn">
                    Edit
                  </button>
                  <button type="button" className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>

              <button type="button" className="add-payment-btn">
                <CreditCard className="btn-icon" />
                Add New Payment Method
              </button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="tab-content">
            <div className="section-header">
              <Bell className="section-icon" />
              <div>
                <h2>Notification Preferences</h2>
                <p>
                  Choose how you want to be notified about updates and
                  activities
                </p>
              </div>
            </div>

            <div className="notification-groups">
              <div className="notification-group">
                <h3>Communication Preferences</h3>
                <div className="notification-items">
                  <div className="notification-item">
                    <div className="notification-info">
                      <Mail className="notification-icon" />
                      <div>
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "emailNotifications",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <Smartphone className="notification-icon" />
                      <div>
                        <h4>Push Notifications</h4>
                        <p>Receive push notifications on your device</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "pushNotifications",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <MessageSquare className="notification-icon" />
                      <div>
                        <h4>SMS Notifications</h4>
                        <p>Receive notifications via text message</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "smsNotifications",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-group">
                <h3>Order & Shopping</h3>
                <div className="notification-items">
                  <div className="notification-item">
                    <div className="notification-info">
                      <Package className="notification-icon" />
                      <div>
                        <h4>Order Updates</h4>
                        <p>Get notified about order status changes</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "orderUpdates",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <Star className="notification-icon" />
                      <div>
                        <h4>Product Recommendations</h4>
                        <p>Receive personalized product suggestions</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.productRecommendations}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "productRecommendations",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <DollarSign className="notification-icon" />
                      <div>
                        <h4>Price Alerts</h4>
                        <p>
                          Get notified when items in your wishlist go on sale
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.priceAlerts}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "priceAlerts",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-group">
                <h3>Marketing & Promotions</h3>
                <div className="notification-items">
                  <div className="notification-item">
                    <div className="notification-info">
                      <Bell className="notification-icon" />
                      <div>
                        <h4>Promotions</h4>
                        <p>
                          Receive notifications about sales and special offers
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.promotions}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "promotions",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <Mail className="notification-icon" />
                      <div>
                        <h4>Newsletter</h4>
                        <p>
                          Receive our weekly newsletter with updates and tips
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={(e) =>
                          handleNotificationUpdate(
                            "newsletter",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("notifications")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="tab-content">
            <div className="section-header">
              <Shield className="section-icon" />
              <div>
                <h2>Privacy & Security</h2>
                <p>
                  Control your privacy settings and data sharing preferences
                </p>
              </div>
            </div>

            <div className="privacy-groups">
              <div className="privacy-group">
                <h3>Profile Visibility</h3>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="public"
                      checked={privacy.profileVisibility === "public"}
                      onChange={(e) =>
                        handlePrivacyUpdate("profileVisibility", e.target.value)
                      }
                    />
                    <span className="radio-label">Public</span>
                    <small>Anyone can see your profile</small>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="friends"
                      checked={privacy.profileVisibility === "friends"}
                      onChange={(e) =>
                        handlePrivacyUpdate("profileVisibility", e.target.value)
                      }
                    />
                    <span className="radio-label">Friends Only</span>
                    <small>Only your friends can see your profile</small>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="profileVisibility"
                      value="private"
                      checked={privacy.profileVisibility === "private"}
                      onChange={(e) =>
                        handlePrivacyUpdate("profileVisibility", e.target.value)
                      }
                    />
                    <span className="radio-label">Private</span>
                    <small>Only you can see your profile</small>
                  </label>
                </div>
              </div>

              <div className="privacy-group">
                <h3>Contact Information</h3>
                <div className="privacy-items">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <Mail className="privacy-icon" />
                      <div>
                        <h4>Show Email Address</h4>
                        <p>Allow others to see your email address</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showEmail}
                        onChange={(e) =>
                          handlePrivacyUpdate("showEmail", e.target.checked)
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="privacy-item">
                    <div className="privacy-info">
                      <Phone className="privacy-icon" />
                      <div>
                        <h4>Show Phone Number</h4>
                        <p>Allow others to see your phone number</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.showPhone}
                        onChange={(e) =>
                          handlePrivacyUpdate("showPhone", e.target.checked)
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="privacy-group">
                <h3>Data & Analytics</h3>
                <div className="privacy-items">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <Shield className="privacy-icon" />
                      <div>
                        <h4>Data Collection</h4>
                        <p>
                          Allow us to collect usage data to improve our services
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.dataCollection}
                        onChange={(e) =>
                          handlePrivacyUpdate(
                            "dataCollection",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="privacy-item">
                    <div className="privacy-info">
                      <Globe className="privacy-icon" />
                      <div>
                        <h4>Third-party Sharing</h4>
                        <p>
                          Allow sharing of anonymized data with trusted partners
                        </p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.thirdPartySharing}
                        onChange={(e) =>
                          handlePrivacyUpdate(
                            "thirdPartySharing",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="privacy-item">
                    <div className="privacy-info">
                      <Mail className="privacy-icon" />
                      <div>
                        <h4>Marketing Emails</h4>
                        <p>Receive marketing emails from us and our partners</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy.marketingEmails}
                        onChange={(e) =>
                          handlePrivacyUpdate(
                            "marketingEmails",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("privacy")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Privacy Settings"}
              </button>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="tab-content">
            <div className="section-header">
              <Palette className="section-icon" />
              <div>
                <h2>Appearance & Theme</h2>
                <p>Customize the look and feel of your experience</p>
              </div>
            </div>

            <div className="appearance-groups">
              <div className="appearance-group">
                <h3>Theme</h3>
                <div className="theme-options">
                  <label className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={appearance.theme === "light"}
                      onChange={(e) =>
                        handleAppearanceUpdate("theme", e.target.value)
                      }
                    />
                    <div className="theme-preview light-theme">
                      <Sun className="theme-icon" />
                      <span>Light</span>
                    </div>
                  </label>

                  <label className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={appearance.theme === "dark"}
                      onChange={(e) =>
                        handleAppearanceUpdate("theme", e.target.value)
                      }
                    />
                    <div className="theme-preview dark-theme">
                      <Moon className="theme-icon" />
                      <span>Dark</span>
                    </div>
                  </label>

                  <label className="theme-option">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      checked={appearance.theme === "system"}
                      onChange={(e) =>
                        handleAppearanceUpdate("theme", e.target.value)
                      }
                    />
                    <div className="theme-preview system-theme">
                      <Monitor className="theme-icon" />
                      <span>System</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="appearance-group">
                <h3>Display Options</h3>
                <div className="appearance-items">
                  <div className="appearance-item">
                    <div className="appearance-info">
                      <Volume2 className="appearance-icon" />
                      <div>
                        <h4>Sound Effects</h4>
                        <p>Play sound effects for interactions</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.soundEnabled}
                        onChange={(e) =>
                          handleAppearanceUpdate(
                            "soundEnabled",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="appearance-item">
                    <div className="appearance-info">
                      <Palette className="appearance-icon" />
                      <div>
                        <h4>Animations</h4>
                        <p>Enable smooth animations and transitions</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.animations}
                        onChange={(e) =>
                          handleAppearanceUpdate("animations", e.target.checked)
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="appearance-item">
                    <div className="appearance-info">
                      <Building className="appearance-icon" />
                      <div>
                        <h4>Compact Mode</h4>
                        <p>Use a more compact layout to fit more content</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={appearance.compactMode}
                        onChange={(e) =>
                          handleAppearanceUpdate(
                            "compactMode",
                            e.target.checked
                          )
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("appearance")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Appearance"}
              </button>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="tab-content">
            <div className="section-header">
              <SettingsIcon className="section-icon" />
              <div>
                <h2>General Preferences</h2>
                <p>Configure your language, currency, and regional settings</p>
              </div>
            </div>

            <div className="preferences-groups">
              <div className="preferences-group">
                <h3>Localization</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Language</label>
                    <div className="input-wrapper">
                      <Languages className="input-icon" />
                      <select
                        value={appearance.language}
                        onChange={(e) =>
                          handleAppearanceUpdate("language", e.target.value)
                        }
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <div className="input-wrapper">
                      <DollarSign className="input-icon" />
                      <select
                        value={appearance.currency}
                        onChange={(e) =>
                          handleAppearanceUpdate("currency", e.target.value)
                        }
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Timezone</label>
                    <div className="input-wrapper">
                      <Globe className="input-icon" />
                      <select
                        value={appearance.timezone}
                        onChange={(e) =>
                          handleAppearanceUpdate("timezone", e.target.value)
                        }
                      >
                        <option value="America/New_York">
                          Eastern Time (ET)
                        </option>
                        <option value="America/Chicago">
                          Central Time (CT)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (MT)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (PT)
                        </option>
                        <option value="Europe/London">
                          Greenwich Mean Time (GMT)
                        </option>
                        <option value="Europe/Paris">
                          Central European Time (CET)
                        </option>
                        <option value="Asia/Tokyo">
                          Japan Standard Time (JST)
                        </option>
                        <option value="Australia/Sydney">
                          Australian Eastern Time (AET)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="preferences-group">
                <h3>Data Management</h3>
                <div className="data-actions">
                  <div className="data-item">
                    <div>
                      <h4>Export Data</h4>
                      <p>Download a copy of all your account data</p>
                    </div>
                    <button type="button" className="export-btn">
                      <Download className="btn-icon" />
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="save-btn"
                onClick={() => handleSaveSettings("preferences")}
                disabled={isLoading}
              >
                <Save className="btn-icon" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-content">
          <SettingsIcon className="header-icon" />
          <div>
            <h1>Settings</h1>
            <p>Manage your account settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="nav-icon" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
