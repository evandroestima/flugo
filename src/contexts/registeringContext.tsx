import React, { createContext, useContext, useState, ReactNode } from "react";

interface RegisteringContextType {
  isRegistering: boolean;
  setIsRegistering: (value: boolean) => void;
}

const RegisteringContext = createContext<RegisteringContextType | undefined>(
  undefined
);

export const RegisteringProvider = ({ children }: { children: ReactNode }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <RegisteringContext.Provider value={{ isRegistering, setIsRegistering }}>
      {children}
    </RegisteringContext.Provider>
  );
};

export const useRegistering = () => {
  const context = useContext(RegisteringContext);
  if (!context) {
    throw new Error("useRegistering must be used within a RegisteringProvider");
  }
  return context;
};
