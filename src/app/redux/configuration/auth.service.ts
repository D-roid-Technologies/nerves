import { sendEmailVerification, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { LocationState } from "../slice/location";
import { LocationS, PrimaryInformation, setUser } from "../slice/user";
import { store } from "../store";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { Friends } from "../../utils/types/friends/interface/friendInterface";
import { Wallet } from "../../utils/types/wallets/interface/wallets";
import { Product } from "../../types/product";
import { setListedItems } from "../slice/products";
import { updateCartSlice } from "../slice/cart";


const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const splitFullNameBySpace = (name: any) => {
    const names: string[] = name.split(' ')
    return names
}
// const {city, countryName} = useLocation()

const getFirstInitials = (array: string[]) => {
    const firstInitials = array[0][0].toLocaleUpperCase();
    const secondInitials = array[1][0].toLocaleUpperCase();
    const initials = [firstInitials, secondInitials]
    return initials
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

interface FirebaseProviderData {
    providerId: string | null;
    uid: string | null;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
}

interface Notification {
    id: string;
    type: "order" | "system" | "message" | "promotion";
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string; // or Date
}

type OrderStatus =
    | "paid"
    | "sealed"
    | "dispatched"
    | "arrived"
    | "confirmed"
    | "returned"
    | "reviewed"
    | "cancelled";

type PaymentMethod = "card" | "wallet" | "bank_transfer" | "cash_on_delivery";

type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

// Interfaces for clarity
interface OrderItem {
    itemId: string;
    sellerId: string;
    buyerId: string;
    title: string;
    quantity: number;
    price: number;
    imageUrl: string;
}

interface OrderInter {
    orderId: string;
    items: OrderItem[];
    status: OrderStatus;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    paymentInfo: {
        method: PaymentMethod;
        transactionId: string;
        amount: number;
        currency: string;
        status: PaymentStatus;
    };
    orderTimeline: { status: OrderStatus; timestamp: string }[];
    createdAt: string; // or Date
}

interface ReviewInter {
    reviewId: string;
    itemId: string;
    reviewerId: string;
    rating: number; // 1 - 5 stars
    comment: string;
    images: string[];
    createdAt: string; // or Date
}

// Status type for purchased/sold items
type ItemStatus = "delivered" | "returned";

// Items listed by the user for sale
export interface ListedItem {
    itemId: string;
    title: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    images: string[];
    createdAt: string; // or Date
}

// Items the user has purchased
interface PurchasedItem {
    itemId: string;
    sellerId: string;
    title: string;
    price: number;
    quantity: number;
    status: ItemStatus;
    createdAt: string; // or Date
}

// Items the user has sold
interface SoldItem {
    itemId: string;
    buyerId: string;
    title: string;
    price: number;
    quantity: number;
    status: ItemStatus;
    createdAt: string; // or Date
}

// Group all myItems together
interface MyItems {
    listedForSale: ListedItem[];
    purchased: PurchasedItem[];
    sold: SoldItem[];
}

interface CartItem {
    product: Product & {
        sellerId: string;   // attach seller information
        total: number;      // derived field (price * quantity)
        addedAt: string;    // timestamp when added
    };
    quantity: number;
}

interface Cart {
    items: CartItem[];
}


export class AuthService {
    async handleGoogleSignin() {
        const currentDateTime = getCurrentDateTime();
        const signInData = signInWithPopup(auth, provider).then(async (res: { user: { refreshToken: string; providerData: { photoURL: any; }[]; uid: any; }; }) => {
            const providerData = res.user.providerData[0] as FirebaseProviderData;
            const userDocRef = doc(collection(db, "nerveaccount"), res.user.uid);
            const gottenNames: string[] = splitFullNameBySpace(providerData.displayName);
            const allInitials: string[] = getFirstInitials(gottenNames);
            const nerveAccount = {
                user: {
                    primaryInformation: {
                        firstName: capitalizeFirstLetter(gottenNames[0]),
                        lastName: capitalizeFirstLetter(gottenNames[1]),
                        middleName: "",
                        email: providerData.email,
                        phone: "",
                        userType: "Buyer",
                        nameInitials: `${allInitials[0].toUpperCase()}${allInitials[1].toUpperCase()}`,
                        uniqueIdentifier: res.user.uid,
                        gender: "",
                        dateOfBirth: "",
                        photoUrl: providerData.photoURL,
                        isLoggedIn: true,
                        agreedToTerms: true,
                        verifiedEmail: false,
                        verifyPhoneNumber: false,
                        twoFactorSettings: false,
                        referralName: "",
                        secondaryEmail: "",
                        securityQuestion: "",
                        securityAnswer: "",
                        disability: false,
                        disabilityType: "",
                        educationalLevel: "",
                        dateOfCreation: currentDateTime,
                    },
                    location: {
                        streetNumber: "",
                        streetName: "",
                        city: "",
                        state: "",
                        country: "",
                        postalCode: "",
                        geoCoordinates: {
                            latitude: "",
                            longitude: "",
                        },
                    },
                },
                cart: [] as Cart[],
                notifications: [] as Notification[],
                orders: [] as OrderInter[],
                reviews: [] as ReviewInter[],
                myItems: [] as MyItems[],
                friends: [] as Friends[],
                wallet: {} as Wallet,
            };
            await setDoc(userDocRef, nerveAccount);
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                const fetchedUserData = userSnapshot.data();
                const primaryInformation = fetchedUserData.user.primaryInformation;

                store.dispatch(setUser({
                    providerId: providerData.providerId || "",
                    uid: providerData.uid || "",
                    primaryInformation: {
                        firstName: capitalizeFirstLetter(gottenNames[0] || ""),
                        lastName: capitalizeFirstLetter(gottenNames[1] || ""),
                        middleName: "",
                        email: providerData.email || "",
                        phone: providerData.phoneNumber || "",
                        userType: "user",
                        nameInitials: `${(gottenNames[0]?.[0] || "").toUpperCase()}${(gottenNames[1]?.[0] || "").toUpperCase()}`,
                        uniqueIdentifier: providerData.uid || "",
                        gender: "",
                        dateOfBirth: "",
                        photoUrl: providerData.photoURL || "",
                        isLoggedIn: true,
                        agreedToTerms: true,
                        verifiedEmail: false,
                        verifyPhoneNumber: false,
                        twoFactorSettings: false,
                        referralName: "",
                        secondaryEmail: "",
                        securityQuestion: "",
                        securityAnswer: "",
                        disability: false,
                        disabilityType: "",
                        educationalLevel: "",
                        dateOfCreation: getCurrentDateTime(),
                    },
                    location: {
                        streetNumber: "",
                        streetName: "",
                        city: "",
                        state: "",
                        country: "",
                        postalCode: "",
                        geoCoordinates: {
                            latitude: "",
                            longitude: "",
                        },
                    },
                }));

                toast.success(`Welcome to Nerves ${primaryInformation.firstName}`, {
                    style: { background: "#4BB543", color: "#fff" },
                });

                return { success: true };
            } else {
                toast.error("User Information does not exist 🚫", {
                    style: { background: "#ff4d4f", color: "#fff" },
                });
                return null;
            }

        }).catch((err) => {
            console.error("Error during registration:", err);
            toast.error(`Error creating your Account 🚫`, {
                style: { background: "#ff4d4f", color: "#fff" },
            });
            return null;
        })
        return signInData
    }
    async handleUserLogin() {
        try {
            // 1️⃣ Sign in with Google
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const providerData = user.providerData[0] as FirebaseProviderData;

            // 2️⃣ Reference Firestore document
            const userDocRef = doc(collection(db, "nerveaccount"), user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                toast.error("User account does not exist. Please sign up first 🚫", {
                    style: { background: "#ff4d4f", color: "#fff" },
                });
                return null;
            }

            // 3️⃣ Fetch user data from Firestore
            const fetchedUserData = userSnapshot.data();
            const primaryInformation = fetchedUserData.user.primaryInformation;
            const location = fetchedUserData.user.location;
            const cart = fetchedUserData.cart;
            const friends = fetchedUserData.friends;
            const myItems = fetchedUserData.myItems;
            const notifications = fetchedUserData.notifications;
            const orders = fetchedUserData.orders;
            const reviews = fetchedUserData.reviews;
            const wallet = fetchedUserData.wallet;

            // 4️⃣ Update Redux store
            store.dispatch(setUser({
                providerId: providerData.providerId || "",
                uid: user.uid || "",
                primaryInformation: {
                    ...primaryInformation,
                    isLoggedIn: true, // ensure user is marked as logged in
                },
                location: location || {
                    streetNumber: "",
                    streetName: "",
                    city: "",
                    state: "",
                    country: "",
                    postalCode: "",
                    geoCoordinates: { latitude: "", longitude: "" },
                },
            }));

            store.dispatch(updateCartSlice(cart));

            toast.success(`Welcome back, ${primaryInformation.firstName}!`, {
                style: { background: "#4BB543", color: "#fff" },
            });

            return { success: true };
        } catch (err) {
            console.error("Error during login:", err);
            toast.error(`Error logging in 🚫`, {
                style: { background: "#ff4d4f", color: "#fff" },
            });
            return null;
        }
    }
    async fetchAllListedItems() {
        try {
            const usersSnapshot = await getDocs(collection(db, "nerveaccount"));
            const allUsers: any = usersSnapshot.docs.map(doc => doc.data());

            // Flatten all listed items
            const allListedItems: ListedItem[] = allUsers.flatMap((user: { myItems: any[]; }) =>
                user.myItems.flatMap(myItem => myItem.listedForSale)
            );

            // Store in Redux
            store.dispatch(setListedItems(allListedItems));
            return allListedItems;
        } catch (err) {
            console.error("Error fetching all listed items:", err);
            return [];
        }
    };
    async updatePrimaryInformation(partialUpdateData: Partial<PrimaryInformation>) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("User not authenticated", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const userId = currentUser.uid;
            const userDocRef = doc(db, "nerveaccount", userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                toast.error("User not found", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const currentData = userSnapshot.data();

            // ✅ Merge only primaryInformation
            const updatedPrimaryInfo = {
                ...currentData.user.primaryInformation,
                ...partialUpdateData,
            };

            // Save back to Firestore
            await updateDoc(userDocRef, {
                "user.primaryInformation": updatedPrimaryInfo,
            });

            // console.log("Updated Primary Info:", updatedPrimaryInfo);
            // toast.success("Profile updated successfully!");
        } catch (error) {
            // console.error("Error updating primary information:", error);
            toast.error(`Failed to update profile: ${error}`);
        }
    }
    async updateLocation(partialUpdateData: Partial<LocationS>) {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("User not authenticated", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const userId = currentUser.uid;
            const userDocRef = doc(db, "nerveaccount", userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                toast.error("User not found", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const currentData = userSnapshot.data();

            // ✅ Merge only location
            const updatedLocation = {
                ...currentData.user.location,
                ...partialUpdateData,
            };

            // Save back to Firestore
            await updateDoc(userDocRef, {
                "user.location": updatedLocation,
            });

            // console.log("Updated Location:", updatedLocation);
            // toast.success("Location updated successfully!");
        } catch (error) {
            // console.error("Error updating location:", error);
            toast.error(`Failed to update location: ${error}`);
        }
    }

}

export const authService = new AuthService()