import React, { createContext, useReducer } from 'react'

const cartStateContext = createContext()
const cartDispatchContext = createContext()

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return [...state, { id: action.id, name: action.name, price: action.price, quantity: action.quantity, size: action.size, img: action.img }]
        case "REMOVE":
            // Remove item by index
            return state.filter((_, idx) => idx !== action.index);
        case "UPDATE":
            // Update quantity and/or size for a cart item by index
            return state.map((item, idx) =>
                idx === action.index
                    ? { ...item, quantity: action.quantity ?? item.quantity, size: action.size ?? item.size }
                    : item
            );
        case "CLEAR":
            return [];
        default:
            console.log("Error in reducer function");
            return state;
    }
}

export const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer (reducer, [])
    return (
        <cartDispatchContext.Provider value={dispatch}>
            <cartStateContext.Provider value={state}>
                {children}
            </cartStateContext.Provider>
        </cartDispatchContext.Provider>
    )
}

export const useCart = () => React.useContext(cartStateContext)
export const useDispatchCart = () => React.useContext(cartDispatchContext)