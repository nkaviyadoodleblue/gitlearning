import { configureStore, ThunkAction } from '@reduxjs/toolkit'
import authReducer from './authSlice';
import { client } from '@/lib/client';
import patientReducer from './patientSlice';
import caseReducer from './caseSlice';

export const store = configureStore({
    reducer: {
        patient: patientReducer,
        auth: authReducer,
        case: caseReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: client,
            },
        })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Reusable thunk type with extra argument
export type AppThunk<ReturnType = void> = ThunkAction<
    Promise<ReturnType>,
    RootState,
    typeof client,
    any
>;
