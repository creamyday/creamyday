import { createSlice } from '@reduxjs/toolkit';
import type { CartProps } from '../types/carts';

const initialState: CartProps = {
  isShow: false,
  isAdd: false, 
  products: [],
  keyword:[],
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
        state.products[index] = { id: state.products[index].id, ...action.payload };
      }

      if (!state.keyword.includes(action.payload.product.category)) {
        state.keyword.push(action.payload.product.category)
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
      state.keyword = state.products.reduce<string[]>((a, b) => {
        if (!a.includes(b.product.category)) {
          a.push(b.product.category)
        }
        return a
      }, []);
    },
    initFinalTotal: function (state, action) {
      state.final_total = action.payload;
    },
    initTotal: function (state, action) {
      state.total = action.payload;
    },
    addCoupon: function (state,action) {
      state.coupon = action.payload;
    },
    initCoupon: function (state) {
      state.coupon = 0;
    },
  }
});

export const { changeShow, changeQty, addProduct, removeProduct, initProduct, initFinalTotal, initTotal, addCoupon, initCoupon } = cartStore.actions;

export default cartStore.reducer;