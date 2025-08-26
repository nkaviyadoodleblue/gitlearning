import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';
import { redirect } from "react-router";
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from '@/lib/storage';
import { set } from 'date-fns';

export interface PatientState {
    patientList: any[];
    isLoading: boolean;
    patientDetails: any | null;
    isPatientDetailsLoading: boolean;
}

const initialState: PatientState = {
    patientList: [],
    isLoading: false,
    patientDetails: null,
    isPatientDetailsLoading: false,
}

export const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatientList: (state, action) => {
            state.patientList = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setPatientDetails: (state, action) => {
            state.patientDetails = action.payload;
        },
        setIsPatientDetailsLoading: (state, action) => {
            state.isPatientDetailsLoading = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPatientList, setIsLoading, setPatientDetails, setIsPatientDetailsLoading } = patientSlice.actions

export default patientSlice.reducer;

export const getPatientData = (): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoading(true))
    const { data, message, status } = await client.get("/patients");
    if (status) {
        console.log(data?.data)
        dispatch(setPatientList(data?.data || []))
    } else {
        toast({
            description: message || "Failed to fetch patient data",
            variant: "destructive"
        });
    }
    dispatch(setIsLoading(false))
    return status;
};


export const getPatientDetails = (id: string): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsPatientDetailsLoading(true))
    const { data, message, status } = await client.get("/patients/" + id);
    if (status) {
        console.log(data?.data)
        dispatch(setPatientDetails(data?.data))
    } else {
        toast({
            description: message || "Failed to fetch patient details",
            variant: "destructive"
        });
    }
    dispatch(setIsPatientDetailsLoading(false))
    return status;
};