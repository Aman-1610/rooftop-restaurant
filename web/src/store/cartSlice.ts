import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    orderType: 'Delivery' | 'Pickup' | 'Dine-in';
    tableNumber?: string;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
    orderType: 'Delivery',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setOrderType: (state, action: PayloadAction<'Delivery' | 'Pickup' | 'Dine-in'>) => {
            state.orderType = action.payload;
        },
        setTableNumber: (state, action: PayloadAction<string>) => {
            state.tableNumber = action.payload;
            state.orderType = 'Dine-in'; // Auto-set if table is set
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(0, action.payload.quantity);
                if (item.quantity === 0) {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            // Preserve table number if in dine-in mode? Usually yes for re-ordering.
        }
    },
});

export const { toggleCart, addToCart, removeFromCart, updateQuantity, clearCart, setOrderType, setTableNumber } = cartSlice.actions;
export default cartSlice.reducer;
