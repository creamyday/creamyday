interface CartProps {
  isShow: boolean;
  products: Record<string, any>[];
  final_total:number;
  total:number;
}

import { createSlice, current } from '@reduxjs/toolkit';

const initialState: CartProps = {
  isShow: false,
  products: [],
  final_total:0,
  total:0,
}

export const cartStore = createSlice({
  name: 'carts',
  initialState,
  reducers:{
    changeShow:function(state,action){
      state.isShow = action.payload;
    },
    changeQty: function (state, action) {
      const index = state.products.findIndex(item => item.id === action.payload.id);

      if (index !== -1) {
        state.products[index].qty = action.payload.qty;
      }
    },
    addProduct: function (state, action) {
      console.log('addProduct state', current(state));
      console.log('addProduct actions', action);
      // state.products = [...state,...action.payload.temp]
    },
    removeProduct: function (state, action) {
      const index = state.products.findIndex(item => item.id === action.payload.id);

      if (index !== -1) {
        state.products.splice(index,1);
      }
    },
    initProduct: function (state, action) {
      state.products = action.payload;
    },
    initFinalTotal: function (state, action) {
      state.final_total = action.payload;
    },
    initTotal: function (state, action) {
      state.total = action.payload;
    },
  }
});

export const { changeShow,changeQty, addProduct, removeProduct, initProduct, initFinalTotal, initTotal } = cartStore.actions;

export default cartStore.reducer;