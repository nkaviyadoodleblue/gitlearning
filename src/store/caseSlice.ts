import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';
import { redirect } from "react-router";
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from '@/lib/storage';
import { set } from 'date-fns';

export interface CaseState {
    caseList: {
        list: any[];
        totalPages: number;
        totalCases: number;
        currentPage: number;
    };
    isLoading: boolean;
    caseData: any | null;
    isStepLoading: boolean;
}

const initialState: CaseState = {
    caseList: {
        list: [],
        totalPages: 0,
        totalCases: 0,
        currentPage: 0
    },
    caseData: null,
    isLoading: false,
    isStepLoading: false
}

export const caseSlice = createSlice({
    name: 'case',
    initialState,
    reducers: {
        setCaseList: (state, action) => {
            state.caseList = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setCaseData: (state, action) => {
            state.caseData = action.payload;
        },
        setIsStepLoading: (state, action) => {
            state.isStepLoading = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCaseList, setIsLoading, setCaseData, setIsStepLoading } = caseSlice.actions

export default caseSlice.reducer;


export const getAllCaseData = ({ page = 0, limit = 100, search = "", id }): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoading(true))
    const { data, message, status } = await client.get(`/cases?page=${page + 1}&limit=${limit}&patientId=${id}`);
    if (status) {
        dispatch(setCaseList({
            list: data?.data.list,
            currentPage: data?.data.currentPage,
            totalPages: data?.data.totalPages,
            totalCases: data?.data.totalCases
        }))
    } else {
        toast({
            description: message || "Failed to fetch patient data",
            variant: "destructive"
        });
    }
    dispatch(setIsLoading(false))
    return status;
};

export const getCaseData = ({ id }): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoading(true))
    dispatch(setCaseData(null))
    const { data, message, status } = await client.get(`/cases/${id}`);
    if (status) {

        dispatch(setCaseData(data?.data))
        // dispatch(setCaseList({
        //     list: data?.data.list,
        //     currentPage: data?.data.currentPage,
        //     totalPages: data?.data.totalPages,
        //     totalCases: data?.data.totalCases
        // }))
    } else {
        toast({
            description: message || "Failed to fetch patient data",
            variant: "destructive"
        });
    }
    dispatch(setIsLoading(false))
    return status;
};

export const updateCaseStep = ({ id, stepId, reductionAmount }): AppThunk<void> => async (dispatch, _getState, client) => {
    dispatch(setIsStepLoading(true))
    dispatch(setCaseData(null))
    const { data, message, status } = await client.put(`/cases/${id}/steps/${stepId}`, { reductionAmount });
    console.log(data, message, status);
    if (status) {
        dispatch(setCaseData(data?.data))
        // dispatch(setCaseList({
        //     list: data?.data.list,
        //     currentPage: data?.data.currentPage,
        //     totalPages: data?.data.totalPages,
        //     totalCases: data?.data.totalCases
        // }))
    } else {
        toast({
            description: message || "Failed to update case step",
            variant: "destructive"
        });
    }
    dispatch(setIsStepLoading(false))
};

export const updateAppointments = ({ appointments, caseId }): AppThunk<void> => async (dispatch, _getState, client) => {
    // dispatch(setIsStepLoading(true))
    // dispatch(setCaseData(null))

    //     providerName: { type: String, required: true },
    //     treatmentDetails: { type: String, required: true },
    //     procedureDate: { type: Date, required: true },
    //     currentBalance: { type: Number, required: true },
    //     finalBalance: { type: Number },
    //     reduction: { type: Number },
    //     status: {
    //         type: String,
    //         enum: ['Not Started', 'Pending', 'Completed'],
    //         default: 'Not Started'
    //     },
    // attorney: { type: String }, // Added to match CSV
    // dateOfInjury: { type: Date } // Added to match CSV
    console.log({ appointments, caseId })

    let ap = {
        "id": 1,
        "dateOfEntry": "2025-09-17",
        "status": "Pending",
        "notes": "Initial consultation - Active case",
        "typeOfRequest": "without Affidavit",
        "facilityProvider": "Courtney Stephen",
        "procedureDate": "2025-07-28",
        "billAmount": 0
    }

    const normalizedAppointments = appointments.map(item => {
        return {
            providerName: item?.facilityProvider,
            procedureDate: item?.procedureDate,
            currentBalance: item?.billAmount,
            status: item?.status,
            treatmentDetails: item?.notes || "-",

        }

    })
    // return;
    const { data, message, status } = await client.put(`/cases/${caseId}/appointments/`, { appointments: normalizedAppointments });

    if (status) {
        dispatch(setCaseData(data?.data))
        // dispatch(setCaseList({
        //     list: data?.data.list,
        //     currentPage: data?.data.currentPage,
        //     totalPages: data?.data.totalPages,
        //     totalCases: data?.data.totalCases
        // }))
    } else {
        toast({
            description: message || "Failed to update case step",
            variant: "destructive"
        });
    }
    // dispatch(setIsStepLoading(false))
};