// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1️⃣ Define the shape of the user state
interface UserState {
    providerId: string | null;
    uid: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
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
                firstName: null,
                lastName: null,
                email: null,
                phoneNumber: null,
                photoURL: null,
                isLoggedIn: false,
            };
        }
        return JSON.parse(serializedUser) as UserState;
    } catch {
        return {
            providerId: null,
            uid: null,
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: null,
            photoURL: null,
            isLoggedIn: false,
        };
    }
};

// 3️⃣ Initial state loaded from localStorage
const initialState: UserState = loadUserFromLocalStorage();

// 4️⃣ Define the payload type for setUser
type SetUserPayload = Omit<UserState, 'isLoggedIn'>;

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            state.providerId = action.payload.providerId;
            state.uid = action.payload.uid;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.phoneNumber = action.payload.phoneNumber;
            state.photoURL = action.payload.photoURL;
            state.isLoggedIn = true;

            console.log(state.email, state.isLoggedIn, state.uid)

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(state));
        },
        clearUser: (state) => {
            state.providerId = null;
            state.uid = null;
            state.firstName = null;
            state.lastName = null;
            state.email = null;
            state.phoneNumber = null;
            state.photoURL = null;
            state.isLoggedIn = false;

            // Remove from localStorage
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;