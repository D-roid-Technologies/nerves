import type React from "react";
import { useEffect, useState } from "react";
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
  Settings as SettingsIcon,
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
  Key,
  X,
  Copy,
  Tag,
} from "lucide-react";
import "./settings.css";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../redux/store";
import {
  updateLocationS,
  updatePrimaryInformationS,
  UserState,
} from "../../../redux/slice/user";
import { authService } from "../../../redux/configuration/auth.service";

// Payment Method Interface
interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expMonth: number;
  expYear: number;
  brand: string;
  isDefault: boolean;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  });

  const user = useSelector((state: RootState) => state.user);

  const [profile, setProfile] = useState<UserState>({
    providerId: null,
    uid: null,
    isLoggedIn: false,
    primaryInformation: {
      firstName: user.primaryInformation?.firstName || "",
      lastName: user.primaryInformation?.lastName || "",
      middleName: user.primaryInformation?.middleName || "",
      email: user.primaryInformation?.email || "",
      phone: user.primaryInformation?.phone || "",
      userType: user.primaryInformation?.userType || "both",
      nameInitials: user.primaryInformation?.nameInitials || "",
      uniqueIdentifier: user.primaryInformation?.uniqueIdentifier || "",
      gender: user.primaryInformation?.gender || "",
      dateOfBirth: user.primaryInformation?.dateOfBirth || "",
      photoUrl: user.primaryInformation?.photoUrl || "",
      isLoggedIn: user.primaryInformation?.isLoggedIn || false,
      agreedToTerms: user.primaryInformation?.agreedToTerms || false,
      verifiedEmail: user.primaryInformation?.verifiedEmail || false,
      verifyPhoneNumber: user.primaryInformation?.verifyPhoneNumber || false,
      twoFactorSettings: user.primaryInformation?.twoFactorSettings || false,
      referralName: user.primaryInformation?.referralName || "",
      secondaryEmail: user.primaryInformation?.secondaryEmail || "",
      securityQuestion: user.primaryInformation?.securityQuestion || "",
      securityAnswer: user.primaryInformation?.securityAnswer || "",
      disability: user.primaryInformation?.disability || false,
      disabilityType: user.primaryInformation?.disabilityType || "",
      educationalLevel: user.primaryInformation?.educationalLevel || "",
      dateOfCreation:
        user.primaryInformation?.dateOfCreation || new Date().toISOString(),
    },
    location: {
      streetNumber: user.location?.streetNumber || "",
      streetName: user.location?.streetName || "",
      city: user.location?.city || "",
      state: user.location?.state || "",
      country: user.location?.country || "",
      postalCode: user.location?.postalCode || "",
      geoCoordinates: {
        latitude: user.location?.geoCoordinates?.latitude || "",
        longitude: user.location?.geoCoordinates?.longitude || "",
      },
    },
  });

  // Update initial address states to be empty
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    productRecommendations: true,
    priceAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    thirdPartySharing: false,
    marketingEmails: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "system",
    language: "en",
    currency: "NGN",
    timezone: "Africa/Lagos",
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

  const handleProfileUpdate = <
    Section extends keyof UserState,
    Field extends keyof NonNullable<UserState[Section]>
  >(
    field: Field,
    value: NonNullable<UserState[Section]>[Field],
    section: Section
  ) => {
    setProfile((prev) => {
      const currentSection = prev[section] ?? {};

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        } as NonNullable<UserState[Section]>,
      };
    });
  };

  const handleAddressUpdate = <
    Field extends keyof NonNullable<UserState["location"]>
  >(
    field: Field,
    value: NonNullable<UserState["location"]>[Field]
  ) => {
    setProfile((prev) => {
      const currentLocation = prev.location ?? {
        streetNumber: "",
        streetName: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        geoCoordinates: { latitude: "", longitude: "" },
      };

      return {
        ...prev,
        location: {
          ...currentLocation,
          [field]: value,
        },
      };
    });
  };

  const handleNotificationUpdate = (
    field: keyof typeof notifications,
    value: boolean
  ) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrivacyUpdate = (
    field: keyof typeof privacy,
    value: string | boolean
  ) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppearanceUpdate = (
    field: keyof typeof appearance,
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`=== ${section.toUpperCase()} SETTINGS ===`);
      switch (section) {
        case "profile":
          await authService
            .updatePrimaryInformation({
              firstName: profile.primaryInformation?.firstName,
              lastName: profile.primaryInformation?.lastName,
              middleName: profile.primaryInformation?.middleName,
              email: profile.primaryInformation?.email,
              phone: profile.primaryInformation?.phone,
              userType: profile.primaryInformation?.userType,
              nameInitials: profile.primaryInformation?.nameInitials,
              uniqueIdentifier: profile.primaryInformation?.uniqueIdentifier,
              gender: profile.primaryInformation?.gender,
              dateOfBirth: profile.primaryInformation?.dateOfBirth,
              photoUrl: profile.primaryInformation?.photoUrl,
              isLoggedIn: profile.primaryInformation?.isLoggedIn,
              agreedToTerms: profile.primaryInformation?.agreedToTerms,
              verifiedEmail: profile.primaryInformation?.verifiedEmail,
              verifyPhoneNumber: profile.primaryInformation?.verifyPhoneNumber,
              twoFactorSettings: profile.primaryInformation?.twoFactorSettings,
              referralName: profile.primaryInformation?.referralName,
              secondaryEmail: profile.primaryInformation?.secondaryEmail,
              securityQuestion: profile.primaryInformation?.securityQuestion,
              securityAnswer: profile.primaryInformation?.securityAnswer,
              disability: profile.primaryInformation?.disability,
              disabilityType: profile.primaryInformation?.disabilityType,
              educationalLevel: profile.primaryInformation?.educationalLevel,
              dateOfCreation: profile.primaryInformation?.dateOfCreation,
            })
            .then(() => {
              store.dispatch(
                updatePrimaryInformationS({
                  firstName: profile.primaryInformation?.firstName,
                  lastName: profile.primaryInformation?.lastName,
                  middleName: profile.primaryInformation?.middleName,
                  email: profile.primaryInformation?.email,
                  phone: profile.primaryInformation?.phone,
                  userType: profile.primaryInformation?.userType,
                  nameInitials: profile.primaryInformation?.nameInitials,
                  uniqueIdentifier:
                    profile.primaryInformation?.uniqueIdentifier,
                  gender: profile.primaryInformation?.gender,
                  dateOfBirth: profile.primaryInformation?.dateOfBirth,
                  photoUrl: profile.primaryInformation?.photoUrl,
                  isLoggedIn: profile.primaryInformation?.isLoggedIn,
                  agreedToTerms: profile.primaryInformation?.agreedToTerms,
                  verifiedEmail: profile.primaryInformation?.verifiedEmail,
                  verifyPhoneNumber:
                    profile.primaryInformation?.verifyPhoneNumber,
                  twoFactorSettings:
                    profile.primaryInformation?.twoFactorSettings,
                  referralName: profile.primaryInformation?.referralName,
                  secondaryEmail: profile.primaryInformation?.secondaryEmail,
                  securityQuestion:
                    profile.primaryInformation?.securityQuestion,
                  securityAnswer: profile.primaryInformation?.securityAnswer,
                  disability: profile.primaryInformation?.disability,
                  disabilityType: profile.primaryInformation?.disabilityType,
                  educationalLevel:
                    profile.primaryInformation?.educationalLevel,
                  dateOfCreation: profile.primaryInformation?.dateOfCreation,
                })
              );
              toast.success("Primary information updated successfully", {
                style: { background: "#4BB543", color: "#fff" },
              });
            })
            .catch(() => {
              toast.error("Failed to update primary information", {
                style: { background: "#ff4d4f", color: "#fff" },
              });
            });
          break;
        case "addresses":
          await authService
            .updateLocation({
              streetNumber: profile.location?.streetNumber,
              streetName: profile.location?.streetName,
              city: profile.location?.city,
              state: profile.location?.state,
              country: profile.location?.country,
              postalCode: profile.location?.postalCode,
              geoCoordinates: {
                latitude: user.location?.geoCoordinates?.latitude || "",
                longitude: user.location?.geoCoordinates?.longitude || "",
              },
            })
            .then(() => {
              store.dispatch(
                updateLocationS({
                  streetNumber: profile.location?.streetNumber || "",
                  streetName: profile.location?.streetName || "",
                  city: profile.location?.city || "",
                  state: profile.location?.state || "",
                  country: profile.location?.country || "",
                  postalCode: profile.location?.postalCode || "",
                  geoCoordinates: {
                    latitude: profile.location?.geoCoordinates?.latitude || "",
                    longitude:
                      profile.location?.geoCoordinates?.longitude || "",
                  },
                })
              );
              toast.success("Location information updated successfully", {
                style: { background: "#4BB543", color: "#fff" },
              });
            })
            .catch(() => {
              toast.error("Failed to update Location information", {
                style: { background: "#ff4d4f", color: "#fff" },
              });
            });
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
      // toast.success(`${section} settings saved successfully`);
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShippingToBilling = () => {
    setShippingAddress({ ...billingAddress });
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

  // Payment Methods Functions
  const handleAddPaymentMethod = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setNewPaymentMethod({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      isDefault: false,
    });
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewPaymentMethod((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setNewPaymentMethod((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return value;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setNewPaymentMethod((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }));
  };

  const handleSubmitPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log card info to console
    console.log("Card Information:", {
      cardNumber: newPaymentMethod.cardNumber,
      expiryDate: newPaymentMethod.expiryDate,
      cardholderName: newPaymentMethod.cardholderName,
      isDefault: newPaymentMethod.isDefault,
    });

    // Basic validation
    if (
      !newPaymentMethod.cardNumber ||
      newPaymentMethod.cardNumber.replace(/\s/g, "").length !== 16
    ) {
      toast.error("Please enter a valid 16-digit card number", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    if (
      !newPaymentMethod.expiryDate ||
      !/^\d{2}\/\d{2}$/.test(newPaymentMethod.expiryDate)
    ) {
      toast.error("Please enter a valid expiry date (MM/YY)", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    if (!newPaymentMethod.cvv || newPaymentMethod.cvv.length < 3) {
      toast.error("Please enter a valid CVV", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    if (!newPaymentMethod.cardholderName) {
      toast.error("Please enter cardholder name", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to add payment method
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Extract last 4 digits and card brand
      const last4 = newPaymentMethod.cardNumber.slice(-4);
      const [expMonth, expYear] = newPaymentMethod.expiryDate.split("/");

      // Create a mock payment method (in a real app, this would come from your payment processor)
      const newMethod: PaymentMethod = {
        id: `pm_${Math.random().toString(36).substr(2, 9)}`,
        type: "card",
        last4,
        expMonth: parseInt(expMonth),
        expYear: parseInt(expYear) + 2000, // Convert YY to YYYY
        brand: "visa", // This would be detected from the card number in a real app
        isDefault: newPaymentMethod.isDefault || paymentMethods.length === 0,
      };

      // If this is set as default, unset any existing default
      if (newMethod.isDefault) {
        setPaymentMethods((prev) =>
          prev.map((pm) => ({ ...pm, isDefault: false }))
        );
      }

      setPaymentMethods((prev) => [...prev, newMethod]);
      toast.success("Payment method added successfully", {
        style: { background: "#4BB543", color: "#fff" },
      });
      handleClosePaymentModal();
    } catch (error) {
      toast.error("Failed to add payment method", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePaymentMethod = (id: string) => {
    if (
      window.confirm("Are you sure you want to remove this payment method?")
    ) {
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      toast.success("Payment method removed", {
        style: { background: "#4BB543", color: "#fff" },
      });
    }
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    toast.success("Default payment method updated", {
      style: { background: "#4BB543", color: "#fff" },
    });
  };
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [userCountry, setUserCountry] = useState<string>("");

  useEffect(() => {
    // Check if geolocation is available
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state);

        // Listen for permission changes
        result.onchange = () => {
          setLocationPermission(result.state);
          if (result.state === "granted") {
            getUserCountry();
          }
        };

        if (result.state === "granted") {
          getUserCountry();
        }
      });
    }
  }, []);

  const getUserCountry = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Use a geocoding service to get country from coordinates
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.countryName) {
                setUserCountry(data.countryName);
                handleAddressUpdate("country", data.countryName);
              }
            })
            .catch((error) => {
              console.error("Error getting location:", error);
              // Don't set to denied if the geocoding fails, just keep as granted
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermission("denied");
          }
        },
        { timeout: 10000 }
      );
    }
  };
  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted");
          getUserCountry();
        },
        (error) => {
          // Handle different error types
          if (error.code === error.PERMISSION_DENIED) {
            setLocationPermission("denied");
          } else {
            // For other errors (timeout, position unavailable), keep as prompt
            setLocationPermission("prompt");
            toast.error("Could not get your location. Please try again.", {
              style: { background: "#ff4d4f", color: "#fff" },
            });
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };
  // List of countries by region (grouped by continent)
  const countriesByRegion = {
    Africa: [
      "Nigeria",
      "South Africa",
      "Egypt",
      "Kenya",
      "Ghana",
      "Morocco",
      "Ethiopia",
    ],
    Asia: [
      "China",
      "India",
      "Japan",
      "South Korea",
      "Indonesia",
      "Thailand",
      "Vietnam",
    ],
    Europe: [
      "United Kingdom",
      "Germany",
      "France",
      "Italy",
      "Spain",
      "Netherlands",
      "Switzerland",
    ],
    "North America": [
      "United States",
      "Canada",
      "Mexico",
      "Costa Rica",
      "Panama",
    ],
    "South America": ["Brazil", "Argentina", "Colombia", "Chile", "Peru"],
    Oceania: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
  };

  // Get countries that are likely close to the user's detected country
  const getNearbyCountries = () => {
    if (!userCountry) return Object.values(countriesByRegion).flat();

    // Find which region the user's country belongs to
    for (const [region, countries] of Object.entries(countriesByRegion)) {
      if (countries.includes(userCountry)) {
        return countries;
      }
    }

    return Object.values(countriesByRegion).flat();
  };

  // referral name genertor

  interface GenerateReferralNameParams {
    firstName: string;
    uniqueIdentifier: string;
  }

  const generateReferralName = (
    firstName: GenerateReferralNameParams["firstName"],
    uniqueIdentifier: GenerateReferralNameParams["uniqueIdentifier"]
  ): string => {
    if (!firstName || !uniqueIdentifier) return "";

    // Clean and normalize the inputs
    const cleanFirstName: string = firstName
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
    const cleanUniqueId: string = uniqueIdentifier
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    let namepart: string = cleanFirstName.substring(0, 4).padEnd(4, "x");

    let idPart: string =
      cleanUniqueId.length >= 6
        ? cleanUniqueId.slice(-6)
        : cleanUniqueId.padEnd(6, Math.random().toString(36).substring(2, 8));

    const referralName: string = (namepart + idPart).substring(0, 10);

    return referralName.toUpperCase();
  };
  // Add this useEffect to automatically generate and set referral name
  useEffect(() => {
    const firstName = profile.primaryInformation?.firstName;
    const uniqueIdentifier = profile.primaryInformation?.uniqueIdentifier;

    if (
      firstName &&
      uniqueIdentifier &&
      !profile.primaryInformation?.referralName
    ) {
      const generatedReferralName = generateReferralName(
        firstName,
        uniqueIdentifier
      );
      handleProfileUpdate(
        "referralName",
        generatedReferralName,
        "primaryInformation"
      );
    }
  }, [
    profile.primaryInformation?.firstName,
    profile.primaryInformation?.uniqueIdentifier,
  ]);

  // Add this function for copying to clipboard
  const copyReferralName = async () => {
    const referralName = profile.primaryInformation?.referralName;
    if (!referralName) {
      toast.error("No referral name to copy", {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(referralName);
      toast.success("Referral name copied to clipboard!", {
        style: { background: "#4BB543", color: "#fff" },
      });
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = referralName;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Referral name copied to clipboard!", {
          style: { background: "#4BB543", color: "#fff" },
        });
      } catch (err) {
        toast.error("Failed to copy referral name", {
          style: { background: "#ff4d4f", color: "#fff" },
        });
      }

      document.body.removeChild(textArea);
    }
  };

  const nearbyCountries = getNearbyCountries();
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
                {user.primaryInformation?.photoUrl ? (
                  <img
                    src={user.primaryInformation.photoUrl}
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
              {/* Primary Information */}
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profile.primaryInformation?.firstName || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "firstName",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                  placeholder="Enter first name"
                />
              </div>

              <div className="form-group">
                <label>Middle Name</label>
                <input
                  type="text"
                  value={profile.primaryInformation?.middleName || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "middleName",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                  placeholder="Enter middle name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profile.primaryInformation?.lastName || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "lastName",
                      e.target.value,
                      "primaryInformation"
                    )
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
                    value={user.primaryInformation?.email || ""}
                    readOnly
                    placeholder="Enter email address"
                    className="read-only-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Secondary Email</label>
                <input
                  type="email"
                  value={profile.primaryInformation?.secondaryEmail || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "secondaryEmail",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                  placeholder="Enter secondary email"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    value={profile.primaryInformation?.phone || ""}
                    onChange={(e) =>
                      handleProfileUpdate(
                        "phone",
                        e.target.value,
                        "primaryInformation"
                      )
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>User Type</label>
                <select
                  value={profile.primaryInformation?.userType || "both"}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "userType",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="form-group">
                <label>Unique Identifier</label>
                <div className="input-wrapper">
                  <Key className="input-icon" />
                  <input
                    type="text"
                    value={user.primaryInformation?.uniqueIdentifier || ""}
                    readOnly
                    placeholder="Unique identifier"
                    className="read-only-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={profile.primaryInformation?.gender || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "gender",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={profile.primaryInformation?.dateOfBirth || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "dateOfBirth",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Educational Level</label>
                <select
                  value={profile.primaryInformation?.educationalLevel || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "educationalLevel",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                >
                  <option value="">Select educational level</option>
                  <option value="No formal education">
                    No formal education
                  </option>
                  <option value="Primary education">Primary education</option>
                  <option value="Secondary education">
                    Secondary education
                  </option>
                  <option value="Senior Secondary Certificate Examination (SSCE)">
                    Senior Secondary Certificate Examination (SSCE)
                  </option>
                  <option value="National Diploma (ND)">
                    National Diploma (ND)
                  </option>
                  <option value="Higher National Diploma (HND)">
                    Higher National Diploma (HND)
                  </option>
                  <option value="Bachelor's degree">Bachelor's degree</option>
                  <option value="Master's degree">Master's degree</option>
                  <option value="Doctorate degree">Doctorate degree</option>
                  <option value="Professional certification">
                    Professional certification
                  </option>
                  <option value="Trade/Vocational training">
                    Trade/Vocational training
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Referral Name</label>
                <div className="input-wrapper">
                  <Tag className="input-icon" />
                  <input
                    type="text"
                    value={
                      profile.primaryInformation?.referralName ||
                      generateReferralName(
                        profile.primaryInformation?.firstName ?? "",
                        profile.primaryInformation?.uniqueIdentifier ?? ""
                      )
                    }
                    readOnly
                    placeholder="Auto-generated referral name"
                    className="read-only-input"
                  />
                  <button
                    type="button"
                    className="copy-btn-input"
                    onClick={copyReferralName}
                    title="Copy referral name"
                  >
                    <Copy className="copy-icon" size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Security Question</label>
                <select
                  value={profile.primaryInformation?.securityQuestion || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "securityQuestion",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                >
                  <option value="">Select a security question</option>
                  <option value="What was the name of your first pet?">
                    What was the name of your first pet?
                  </option>
                  <option value="What is your mother's maiden name?">
                    What is your mother's maiden name?
                  </option>
                  <option value="What was the name of your first school?">
                    What was the name of your first school?
                  </option>
                  <option value="In what city were you born?">
                    In what city were you born?
                  </option>
                  <option value="What is the name of your favorite teacher?">
                    What is the name of your favorite teacher?
                  </option>
                  <option value="What was your childhood nickname?">
                    What was your childhood nickname?
                  </option>
                  <option value="What is the name of the street you grew up on?">
                    What is the name of the street you grew up on?
                  </option>
                  <option value="What was the make of your first car?">
                    What was the make of your first car?
                  </option>
                  <option value="What is your favorite book?">
                    What is your favorite book?
                  </option>
                  <option value="What is the name of your best childhood friend?">
                    What is the name of your best childhood friend?
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Security Answer</label>
                <input
                  type="text"
                  value={profile.primaryInformation?.securityAnswer || ""}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "securityAnswer",
                      e.target.value,
                      "primaryInformation"
                    )
                  }
                  placeholder="Enter security answer"
                />
              </div>

              <div className="form-group">
                <label>Disability</label>
                <select
                  value={profile.primaryInformation?.disability ? "yes" : "no"}
                  onChange={(e) =>
                    handleProfileUpdate(
                      "disability",
                      e.target.value === "yes",
                      "primaryInformation"
                    )
                  }
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              {profile.primaryInformation?.disability && (
                <div className="form-group">
                  <label>Disability Type</label>
                  <select
                    value={profile.primaryInformation?.disabilityType || ""}
                    onChange={(e) =>
                      handleProfileUpdate(
                        "disabilityType",
                        e.target.value,
                        "primaryInformation"
                      )
                    }
                  >
                    <option value="">Select disability type</option>
                    <option value="Visual impairment">Visual impairment</option>
                    <option value="Hearing impairment">
                      Hearing impairment
                    </option>
                    <option value="Physical disability">
                      Physical disability
                    </option>
                    <option value="Cognitive disability">
                      Cognitive disability
                    </option>
                    <option value="Learning disability">
                      Learning disability
                    </option>
                    <option value="Speech and language disability">
                      Speech and language disability
                    </option>
                    <option value="Mental health condition">
                      Mental health condition
                    </option>
                    <option value="Neurological condition">
                      Neurological condition
                    </option>
                    <option value="Chronic illness">Chronic illness</option>
                    <option value="Multiple disabilities">
                      Multiple disabilities
                    </option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to specify">
                      Prefer not to specify
                    </option>
                  </select>
                </div>
              )}
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

                {/* <div className="danger-item">
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
                </div> */}
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
                {locationPermission === "prompt" && (
                  <div className="location-permission-prompt">
                    <p>
                      Allow location access to automatically detect your country
                      for faster address setup.
                    </p>
                    <button
                      type="button"
                      className="location-permission-btn"
                      onClick={requestLocationPermission}
                    >
                      Allow Location Access
                    </button>
                  </div>
                )}
                {locationPermission === "denied" && (
                  <div className="location-permission-denied">
                    <p>
                      Location access denied. Please enable location permissions
                      in your browser settings to auto-detect your country.
                    </p>
                    <button
                      type="button"
                      className="location-permission-btn"
                      onClick={() => {
                        // Guide user to browser settings
                        toast(
                          "Please enable location permissions in your browser settings",
                          {
                            icon: "ℹ️",
                            style: { background: "#3B82F6", color: "#fff" },
                          }
                        );
                      }}
                    >
                      How to Enable Location
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="addresses-container">
              {/* Shipping Address */}
              <div className="address-section">
                <div className="address-header">
                  <h3>Shipping Address</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Street Number</label>
                    <input
                      type="text"
                      value={profile.location?.streetNumber}
                      onChange={(e) =>
                        handleAddressUpdate("streetNumber", e.target.value)
                      }
                      placeholder="Street number"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Street Name</label>
                    <input
                      type="text"
                      value={profile.location?.streetName}
                      onChange={(e) =>
                        handleAddressUpdate("streetName", e.target.value)
                      }
                      placeholder="Street name"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={profile.location?.city}
                      onChange={(e) =>
                        handleAddressUpdate("city", e.target.value)
                      }
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={profile.location?.state}
                      onChange={(e) =>
                        handleAddressUpdate("state", e.target.value)
                      }
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={profile.location?.postalCode}
                      onChange={(e) =>
                        handleAddressUpdate("postalCode", e.target.value)
                      }
                      placeholder="ZIP code"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={profile.location?.country}
                      onChange={(e) =>
                        handleAddressUpdate("country", e.target.value)
                      }
                    >
                      <option value="">Select Country</option>
                      {userCountry && (
                        <option value={userCountry}>
                          {userCountry} (Detected)
                        </option>
                      )}
                      {nearbyCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                      <option disabled>--- Other Countries ---</option>
                      {Object.values(countriesByRegion)
                        .flat()
                        .filter((country) => !nearbyCountries.includes(country))
                        .map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
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
                  <div className="form-group">
                    <label>Street Number</label>
                    <input
                      type="text"
                      value={profile.location?.streetNumber}
                      onChange={(e) =>
                        handleAddressUpdate("streetNumber", e.target.value)
                      }
                      placeholder="Street number"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Street Name</label>
                    <input
                      type="text"
                      value={profile.location?.streetName}
                      onChange={(e) =>
                        handleAddressUpdate("streetName", e.target.value)
                      }
                      placeholder="Street name"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={profile.location?.city}
                      onChange={(e) =>
                        handleAddressUpdate("city", e.target.value)
                      }
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={profile.location?.state}
                      onChange={(e) =>
                        handleAddressUpdate("state", e.target.value)
                      }
                      placeholder="State"
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={profile.location?.postalCode}
                      onChange={(e) =>
                        handleAddressUpdate("postalCode", e.target.value)
                      }
                      placeholder="ZIP code"
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={profile.location?.country}
                      onChange={(e) =>
                        handleAddressUpdate("country", e.target.value)
                      }
                    >
                      <option value="">Select Country</option>
                      {userCountry && (
                        <option value={userCountry}>
                          {userCountry} (Detected)
                        </option>
                      )}
                      {nearbyCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                      <option disabled>--- Other Countries ---</option>
                      {Object.values(countriesByRegion)
                        .flat()
                        .filter((country) => !nearbyCountries.includes(country))
                        .map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
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
                // Remove the location permission check from disabled state
                // Users should be able to save addresses even without location access
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
              {paymentMethods.length === 0 ? (
                <div className="empty-payment-state">
                  <CreditCard className="empty-state-icon" />
                  <h3>No payment methods added yet</h3>
                  <p>
                    Add a payment method to make purchases and manage your
                    billing.
                  </p>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.id} className="payment-card">
                    <div className="card-info">
                      <CreditCard className="card-icon" />
                      <div>
                        <h4>
                          {method.brand.charAt(0).toUpperCase() +
                            method.brand.slice(1)}{" "}
                          •••• {method.last4}
                        </h4>
                        <p>
                          Expires {method.expMonth.toString().padStart(2, "0")}/
                          {method.expYear.toString().slice(2)}{" "}
                          {method.isDefault && "(Default)"}
                        </p>
                      </div>
                    </div>
                    <div className="card-actions">
                      {!method.isDefault && (
                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            handleSetDefaultPaymentMethod(method.id)
                          }
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button
                type="button"
                className="add-payment-btn"
                onClick={handleAddPaymentMethod}
              >
                <CreditCard className="btn-icon" />
                Add New Payment Method
              </button>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="modal-overlay">
                <div className="payment-modal">
                  <div className="modal-header">
                    <h3>Add Payment Method</h3>
                    <button
                      type="button"
                      className="modal-close"
                      onClick={handleClosePaymentModal}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitPaymentMethod}>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={newPaymentMethod.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={newPaymentMethod.expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={newPaymentMethod.cvv}
                          onChange={handlePaymentInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={newPaymentMethod.cardholderName}
                        onChange={handlePaymentInputChange}
                        placeholder="Onyekachi Godswill"
                        required
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={newPaymentMethod.isDefault}
                          onChange={handlePaymentInputChange}
                        />
                        Set as default payment method
                      </label>
                    </div>

                    <div className="modal-actions">
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={handleClosePaymentModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="save-btn"
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Payment Method"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
                        <option value="NGN">NGN - Nigerian Naira (₦)</option>
                        <option value="USD">USD - US Dollar ($)</option>
                        <option value="EUR">EUR - Euro (€)</option>
                        <option value="GBP">GBP - British Pound (£)</option>
                        {/* ...other currency options */}
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
              {/* 
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
              </div> */}
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
