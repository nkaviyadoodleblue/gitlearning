import { createSlice } from '@reduxjs/toolkit'
import { AppThunk } from './index';
import { toast } from '@/hooks/use-toast';

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

export const login = (body: { username: string, password: string }): AppThunk<void> => async (dispatch, getState, client) => {
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
        localStorage.setItem("token", data.token)
        localStorage.setItem("username", body.username)
    }
    dispatch(setIsLoginLoading(false))

};

export const logout = () => async (dispatch) => {
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("username")
}