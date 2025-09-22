// src/context/NavigationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Route = string;

interface NavigationContextType {
  stack: Route[];
  current: Route;
  push: (route: Route) => void;
  pop: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<Route[]>(["/"]);

  const push = (route: Route) => {
    setStack((prev) => [...prev, route]);
  };

  const pop = () => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const value: NavigationContextType = {
    stack,
    current: stack[stack.length - 1],
    push,
    pop,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used inside NavigationProvider");
  }
  return context;
};
