import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';

import {axiosInstance} from "@/lib/client";
import { getLocalStorage } from "@/lib/storage";

export interface ReportState {
  reportData: any | null;
  isLoading: boolean;
}

const initialState: ReportState = {
  reportData: null,
  isLoading: false,
};

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setReportData, setIsLoading } = reportSlice.actions;
export default reportSlice.reducer;


export const fetchPatientReport = (
  patientId: string
): AppThunk<boolean> => async (dispatch, _getState, client) => {
  dispatch(setIsLoading(true));
  try {
    const { data } = await client.get(
      `/cases/patient/${patientId}/report-json`
    );

    if (data) {
      dispatch(setReportData(data));
      return true;
    } else {
      toast({ description: "Failed to fetch report", variant: "destructive" });
      return false;
    }
  } catch (err) {
    console.error("Report API error:", err);
    toast({ description: "Error fetching report", variant: "destructive" });
    return false;
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const downloadPatientReport = (
  patientId: string
): AppThunk<void> => async (_dispatch, _getState) => {
  try {
    const token = getLocalStorage("token");

    const response = await axiosInstance.get(
      `/cases/patient/${patientId}/export-excel`,
      {
        responseType: "arraybuffer", 
        headers: {
          "x-auth-token": token,
        },
      }
    );

    const contentType = response.headers["content-type"];
    console.log("Downloaded content-type:", contentType);

    if (
      contentType !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast({
        description: "Invalid file format received",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([response.data], { type: contentType });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Patient_Report_${patientId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Excel download error:", error);
    toast({
      description: "Failed to download report",
      variant: "destructive",
    });
  }
};
