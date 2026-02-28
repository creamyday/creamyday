interface CartProps {
  isShow: boolean;
  isAdd: boolean;
  products: Record<string, any>[];
  final_total:number;
  total:number;
  coupon:number;
}

import { createSlice } from '@reduxjs/toolkit';

const initialState: CartProps = {
  isShow: false,
  isAdd: false,
  products: [],
  final_total:0,
  total:0,
  coupon:0,
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
      const index = state.products.findIndex(item => item.product_id === action.payload.product_id);
      if(index === -1){
        state.products.push(action.payload);
      }else{
        state.products[index] = {id:state.products[index].id,...action.payload};
      }
      state.isAdd = true;
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
    initCoupon: function (state, action) {
      state.coupon = action.payload;
    },
  }
});

export const { changeShow, changeQty, addProduct, removeProduct, initProduct, initFinalTotal, initTotal, initCoupon } = cartStore.actions;

export default cartStore.reducer;