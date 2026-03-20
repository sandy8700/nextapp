import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  ids: number[];
}

const initialState: WishlistState = {
  ids: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.ids = action.payload;
    },

    toggleWishlist: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((i) => i !== id);
      } else {
        state.ids.push(id);
      }
    },
     removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const { setWishlist, toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;