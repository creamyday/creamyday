import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { ToastState } from '../types/toasts';


const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { success, message, id } = action.payload;
      state.toasts.push({
        id,
        color: success ? 'success' : 'danger',
        title: success ? '成功' : '失敗',
        content: Array.isArray(message) ? message.join('、') : message,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((item) => item.id !== action.payload);
    },
  }
});

export const pushToastAsync = createAsyncThunk(
  'toasts/pushToastAsync',
  async (payload: { success: boolean; message: string }, { dispatch, requestId }) => {
    dispatch(toastSlice.actions.addToast({ ...payload, id: requestId }));

    await new Promise((resolve) => setTimeout(resolve, 3000));

    dispatch(toastSlice.actions.removeToast(requestId));
  }
);

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;