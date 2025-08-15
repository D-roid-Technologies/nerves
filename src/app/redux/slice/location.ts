import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocalityInfo {
    administrative: Array<any>;
    informative: Array<any>;
}

export type LocationState = {
    city: string;
    continent: string;
    continentCode: string;
    countryCode: string;
    countryName: string;
    latitude: number;
    locality: string;
    localityInfo: LocalityInfo;
    localityLanguageRequested: string;
    longitude: number;
    lookupSource: string;
    plusCode: string;
    postcode: string;
    principalSubdivision: string;
    principalSubdivisionCode: string;
}

const initialState: LocationState = {
    city: "",
    continent: "",
    continentCode: "",
    countryCode: "",
    countryName: "",
    latitude: 0,
    locality: "",
    localityInfo: { administrative: [], informative: [] },
    localityLanguageRequested: "",
    longitude: 0,
    lookupSource: "",
    plusCode: "",
    postcode: "",
    principalSubdivision: "",
    principalSubdivisionCode: "",
};


export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        addLocation(state, action: PayloadAction<LocationState>) {
            state.city = action.payload.city;
            state.continent = action.payload.continent;
            state.continentCode = action.payload.continentCode;
            state.countryCode = action.payload.countryCode;
            state.countryName = action.payload.countryName;
            state.latitude = action.payload.latitude;
            state.locality = action.payload.locality;
            state.localityInfo = action.payload.localityInfo;
            state.localityLanguageRequested = action.payload.localityLanguageRequested;
            state.longitude = action.payload.longitude;
            state.lookupSource = action.payload.lookupSource;
            state.plusCode = action.payload.plusCode;
            state.postcode = action.payload.postcode;
            state.principalSubdivision = action.payload.principalSubdivision;
            state.principalSubdivisionCode = action.payload.principalSubdivisionCode;
        }
    }
})

export const { addLocation } = locationSlice.actions