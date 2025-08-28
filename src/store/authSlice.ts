import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';
import { redirect } from "react-router";
import { deleteLocalStorage, getLocalStorage, setLocalStorage } from '@/lib/storage';

export interface CounterState {
    isLoginLoading: boolean;
    user: {
        username: string;
    } | null;
    currentPage: "patients" | "patient-details" | "balance-reduction" | "import" | "reports" | ""
}

const initialState: CounterState = {
    isLoginLoading: false,
    user: null,
    currentPage: ""
}

export const counterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoginLoading: (state, action) => {
            state.isLoginLoading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setIsLoginLoading, setUser, setCurrentPage } = counterSlice.actions

export default counterSlice.reducer;

export const login = (body: { username: string, password: string }): AppThunk<boolean> => async (dispatch, _getState, client) => {
    dispatch(setIsLoginLoading(true))
    const { data, message, status } = await client.post("/auth/login", body);
    if (!status) {
        toast({
            // title: "Error",
            description: message,
            variant: "destructive"
        });
    } else if (data?.token) {
        dispatch(setUser({
            token: data?.token,
            username: body.username
        }))
        setLocalStorage("token", data.token)
        setLocalStorage("username", body.username)
    }
    dispatch(setIsLoginLoading(false))
    return status;
};

export const logout = (): AppThunk<void> => async (dispatch) => {
    dispatch(setUser(null))
    deleteLocalStorage("token")
    deleteLocalStorage("username")
}

export const checkIsLoggedIn = (): AppThunk<void | boolean> => async (dispatch, getState) => {
    const user = getState().auth.user;
    const token = getLocalStorage("token");
    const username = getLocalStorage("username")

    if (user) return true;
    else if (token && username) {

        dispatch(setUser({
            token,
            username
        }))
        return true;
    } else {
        dispatch(setUser(null))
        deleteLocalStorage("token")
        deleteLocalStorage("username")
    }
}