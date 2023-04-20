// Define the shape of the cart item
// Import necessary Redux libraries
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CartItem = {
  id: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  url: string;
};

// Define the shape of the cart state
export interface CartState {
  items: CartItem[];
  userId: string;
}

// Define the initial state of the cart
const initialCartState: CartState = {
  items: [],
  userId: '',
};

// // Create Redux actions
// export const addToCart = createAction<CartItem>("cart/addToCart");
// export const removeFromCart = createAction<string>("cart/removeFromCart");

// Create a Redux slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState: initialCartState,
  reducers: {
    initializeCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<string>) => {
      state.items.findIndex((e) => e.id === action.payload) >= 0
        ? (state.items[state.items.findIndex((e) => e.id === action.payload)].quantity += 1)
        : state.items.push({ id: action.payload, quantity: 1 });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items.findIndex((e) => e.id === action.payload) >= 0
        ? (state.items[state.items.findIndex((e) => e.id === action.payload)].quantity -= 1)
        : null;
    },
    removeAll: (state, action: PayloadAction<string>) => {
      state.items.splice(
        state.items.findIndex((e) => e.id === action.payload),
        1
      );
    },
  },
});

// Export the slice's actions
export const { addItem, initializeCart, removeAll, removeItem } = cartSlice.actions;
