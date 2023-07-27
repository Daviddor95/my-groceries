import React, { createContext, useState, useContext } from 'react';
const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [productAdded, setProductAdded] = useState(false);
    return (
    <ProductContext.Provider value={{ productAdded, setProductAdded }}>
        {children}
        </ProductContext.Provider>
        );
    }
export function useProductContext() {
    return useContext(ProductContext);
}
