import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1️⃣ Define the shape of the user state
interface UserState {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    isLoggedIn: boolean;
}

// Helper to load user from localStorage
const loadUserFromLocalStorage = (): UserState => {
    try {
        const serializedUser = localStorage.getItem('user');
        if (!serializedUser) return {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            isLoggedIn: false,
        };
        return JSON.parse(serializedUser) as UserState;
    } catch {
        return {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            isLoggedIn: false,
        };
    }
};

// 2️⃣ Initial state loaded from localStorage
const initialState: UserState = loadUserFromLocalStorage();

// 3️⃣ Define the payload shape for setUser
interface SetUserPayload {
    firstName: string;
    middleName?: string; // Optional
    lastName: string;
    email: string;
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Typed payload
        setUser: (state, action: PayloadAction<SetUserPayload>) => {
            state.firstName = action.payload.firstName;
            state.middleName = action.payload.middleName || '';
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.isLoggedIn = true;

            // Save to localStorage
            localStorage.setItem('user', JSON.stringify(state));
        },
        clearUser: (state) => {
            state.firstName = '';
            state.middleName = '';
            state.lastName = '';
            state.email = '';
            state.isLoggedIn = false;

            // Remove from localStorage
            localStorage.removeItem('user');
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;