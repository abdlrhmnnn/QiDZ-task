import React from "react";
import { authStore } from "./AuthStore";
import { movieStore } from "./MovieStore";

export const stores = {
  authStore,
  movieStore,
};

export type StoresContext = typeof stores;

export const StoresContext = React.createContext<StoresContext>(stores);

export const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
  );
};

// Custom hook to use stores in components
export const useStores = () => React.useContext(StoresContext);
