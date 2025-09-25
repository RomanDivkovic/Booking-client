import React, { createContext, useContext, useState, ReactNode } from "react";

// Definiera typen för en grupp
interface Group {
  id: string;
  name: string;
  // Lägg till andra relevanta gruppfält här
}

// Definiera typen för context-värdet
interface GroupContextType {
  activeGroup: Group | null;
  setActiveGroup: (group: Group | null) => void;
}

// Skapa context med ett default-värde
const GroupContext = createContext<GroupContextType | undefined>(undefined);

// Skapa en Provider-komponent
export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  return (
    <GroupContext.Provider value={{ activeGroup, setActiveGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

// Skapa en custom hook för att enkelt använda contexten
export const useGroup = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
};
