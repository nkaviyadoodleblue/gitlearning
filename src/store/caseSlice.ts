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
    isSummaryLoading: boolean;     
    isStatusLoading: boolean; 
    caseData: any | null;

    summary: {
        totalPatients: number;
        activeCases: number;
        completed: number;
    } | null;

    caseStatus:{
        pendingReductions: number;
        activeCases: number;
        completedCases: number;
    } | null;
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
    isSummaryLoading: false,   
    isStatusLoading: false,
    summary: null,
    caseStatus: null
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
         setIsSummaryLoading: (state, action) => {
            state.isSummaryLoading = action.payload;
        },
        setIsStatusLoading: (state, action) => {
            state.isStatusLoading = action.payload;
        },
        setCaseData: (state, action) => {
            state.caseData = action.payload;
        },
        setSummary: (state,action)=>{
            state.summary=action.payload;
        },
        setCaseStatus: (state,action)=>{
            state.caseStatus=action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCaseList, setIsLoading, setIsSummaryLoading, setIsStatusLoading, setCaseData, setSummary,setCaseStatus } = caseSlice.actions

export default caseSlice.reducer;


export const getAllCaseData = ({ page = 0, limit = 100, search = "", id }): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoading(true))
    const { data, message, status } = await client.get(`/cases?page=${page + 1}&limit=${limit})&patientId=${id}`);
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

export const getCaseSummary=():AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsSummaryLoading(true));
    const { data, message, status } = await client.get(`/cases/patientSummary`);
    if (status) {
        dispatch(setSummary(data));
    } else {
        toast({
            description: message || "Failed to fetch patient summary",
            variant: "destructive"
        });
    }
    dispatch(setIsSummaryLoading(false));
    return status;
};

export const getCaseStatus=():AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsStatusLoading(true));
    const { data, message, status } = await client.get(`/cases/caseStatus`);
    if (status) {
        dispatch(setCaseStatus(data));
    } else {
        toast({
            description: message || "Failed to fetch case status",
            variant: "destructive"
        });
    }
    dispatch(setIsStatusLoading(false));
    return status;
};