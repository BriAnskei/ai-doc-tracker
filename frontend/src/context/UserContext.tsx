import React, { createContext, useContext, useState } from "react";

export type Roles = 1 | 2 | 3; // super admin, admin, receiver

type UserContextType = {
  role: Roles | undefined;
  setCurrUser: (role: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Roles | undefined>(undefined);

  const setCurrUser = (role: string) => {
    const roles: Record<string, Roles> = {
      super_admin: 1,
      admin: 2,
      receiver: 3,
    };

    setRole(roles[role]);
    console.log("current user: ", roles[role]);
  };

  return (
    <UserContext.Provider
      value={{
        role,
        setCurrUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const userUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("userUser must be used within a UserProvider");
  }
  return context;
};
