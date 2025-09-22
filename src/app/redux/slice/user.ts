// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1️⃣ Define the shape of the user state
export interface LocationS {
    streetNumber: string;
    streetName: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    geoCoordinates: {
        latitude: string;
        longitude: string;
    }; 
}

export interface PrimaryInformation {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    userType: string; // both, seller, buyer, admin
    nameInitials: string;
    uniqueIdentifier: string;
    gender: string;
    dateOfBirth: string;
    photoUrl: string;
    isLoggedIn: boolean;
    agreedToTerms: boolean;
    verifiedEmail: boolean;
    verifyPhoneNumber: boolean;
    twoFactorSettings: boolean;
    referralName: string;
    secondaryEmail: string;
    securityQuestion: string;
    securityAnswer: string;
    disability: boolean;
    disabilityType: string;
    educationalLevel: string;
    dateOfCreation: string;
}

export interface UserState {
    providerId: string | null;
    uid: string | null;
    primaryInformation: PrimaryInformation | null;
    location: LocationS | null;
    isLoggedIn: boolean;
}

// 2️⃣ Helper to load user from localStorage
const loadUserFromLocalStorage = (): UserState => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (!serializedUser) {
            return {
                providerId: null,
                uid: null,
                primaryInformation: null,
                location: null,
                isLoggedIn: false,
            };
        }
        return JSON.parse(serializedUser) as UserState;
    } catch {
        return {
            providerId: null,
            uid: null,
            primaryInformation: null,
            location: null,
            isLoggedIn: false,
        };
    }
};

// 3️⃣ Initial state loaded from localStorage
const initialState: UserState = loadUserFromLocalStorage();

// 4️⃣ Define the payload type for setUser
interface SetUserPayload {
    providerId: string;
    uid: string;
    primaryInformation: PrimaryInformation;
    location: LocationS;
}

interface UpdatePrimaryInformationPayload {
    primaryInformation: Partial<PrimaryInformation>;
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            state.providerId = action.payload.providerId;
            state.uid = action.payload.uid;
            state.primaryInformation = action.payload.primaryInformation;
            state.location = action.payload.location;
            state.isLoggedIn = true;

            localStorage.setItem('user', JSON.stringify(state));
        },
        clearUser: (state) => {
            state.providerId = null;
            state.uid = null;
            state.primaryInformation = null;
            state.location = null;
            state.isLoggedIn = false;

            localStorage.removeItem('user');
        },
        updatePrimaryInformationS: (state, action: PayloadAction<Partial<PrimaryInformation>>) => {
            if (state.primaryInformation) {
                state.primaryInformation = {
                    ...state.primaryInformation,
                    ...action.payload, // ✅ directly merge fields
                };
                localStorage.setItem("user", JSON.stringify(state));
            }
        },
        updateLocationS: (state, action: PayloadAction<Partial<LocationS>>) => {
            if (state.location) {
                state.location = {
                    ...state.location,
                    ...action.payload, // ✅ merge only the fields being updated
                };
                localStorage.setItem("user", JSON.stringify(state));
            }
        },
    },
});

export const { setUser, clearUser, updatePrimaryInformationS, updateLocationS } = userSlice.actions;
export default userSlice.reducer;