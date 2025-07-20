import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1️⃣ Define the shape of the user state
interface UserState {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    isLoggedIn: boolean;
}

// 2️⃣ Initial state with type
const initialState: UserState = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    isLoggedIn: false,
};

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
        setUser: (state: { firstName: any; middleName: any; lastName: any; email: any; isLoggedIn: boolean; }, action: PayloadAction<SetUserPayload>) => {
            state.firstName = action.payload.firstName;
            state.middleName = action.payload.middleName || '';
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.isLoggedIn = true;
        },
        clearUser: (state: { firstName: string; middleName: string; lastName: string; email: string; isLoggedIn: boolean; }) => {
            state.firstName = '';
            state.middleName = '';
            state.lastName = '';
            state.email = '';
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
