import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';
import { redirect } from "react-router";
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from '@/lib/storage';
import { set } from 'date-fns';

export interface PatientState {
    patientList: {
        list: any[];
        totalPages: number;
        totalPatients: number;
        currentPage: number;
    };
    isLoading: boolean;
    patientDetails: any | null;
    isPatientDetailsLoading: boolean;
}

const initialState: PatientState = {
    patientList: {
        list: [],
        totalPages: 0,
        totalPatients: 0,
        currentPage: 0
    },
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

export const getPatientData = ({ page = 1, limit = 10, search = "" }): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoading(true))
    // const { data, message, status } = await client.get("/patients?page=" + (page || 1) + "&limit=" + limit);
//     const { data, message, status } = await client.get(
//     `/patients?page=${page || 1}&limit=${limit}&search=${encodeURIComponent(search)}`
//   );
const query = `/patients?page=${page || 1}&limit=${limit}` + (search ? `&search=${encodeURIComponent(search)}` : '');

const { data, message, status } = await client.get(query);

    if (status) {
        dispatch(setPatientList({
            list: data?.data.list,
            currentPage: data?.data.currentPage,
            totalPages: data?.data.totalPages,
            totalPatients: data?.data.totalPatients
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


export const getPatientDetails = (id: string): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsPatientDetailsLoading(true))
    const { data, message, status } = await client.get("/patients/details/" + id);
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



export const fetchPatients = (): AppThunk => async (dispatch, _getState, client) => {
  try {
    dispatch(setIsLoading(true));
    const { data, status, message } = await client.get("/patients?page=1&limit=1000");

    if (status) {
      dispatch(setPatientList({
        list: data?.data?.list || [],
        totalPages: data?.data?.totalPages,
        totalPatients: data?.data?.totalPatients,
        currentPage: data?.data?.currentPage
      }));
    } else {
      toast({
        description: message || "Failed to fetch patient list",
        variant: "destructive"
      });
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
    toast({
      description: "Something went wrong while fetching patients.",
      variant: "destructive"
    });
  } finally {
    dispatch(setIsLoading(false));
  }
};
