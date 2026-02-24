import { configureStore } from '@reduxjs/toolkit';
import cartStore from './carts';
import toastStore from './toasts';

export const stores = configureStore({
  reducer: {
    carts: cartStore,
    toasts:toastStore
  },
})

export type RootState = ReturnType<typeof stores.getState>
export type AppDispatch = typeof stores.dispatch