import { configureStore, ThunkAction } from '@reduxjs/toolkit'
import counterReducer from './counterSlice';
import { client } from '@/lib/client';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
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
