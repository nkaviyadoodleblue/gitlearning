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
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCaseList, setIsLoading, setCaseData } = caseSlice.actions

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