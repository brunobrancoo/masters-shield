import { createContext, useState } from "react";

export interface CombatContextType {
  initiative: number[];
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export function CombatProvider({ children }: { children: React.ReactNode }) {
  const [initiative, setInitiativ] = useState();
  const value: CombatContextType = {
    initiative: [1, 2, 3],
  };

  return (
    <CombatContext.Provider value={value}>{children}</CombatContext.Provider>
  );
}
