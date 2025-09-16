'use client';
import React, { createContext, useContext, useState, useMemo } from 'react';

export type Role = 'teacher' | 'student' | 'admin';

interface UserContextType {
  role: Role;
  setRole: (role: Role) => void;
  name: string;
  avatar: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('teacher');

  const user = useMemo(() => {
    switch (role) {
      case 'student':
        return { name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/1/100/100' };
      case 'admin':
        return { name: 'Admin User', avatar: 'https://picsum.photos/seed/99/100/100' };
      case 'teacher':
      default:
        return { name: 'Mr. David Smith', avatar: 'https://picsum.photos/seed/10/100/100' };
    }
  }, [role]);

  const value = {
    role,
    setRole,
    name: user.name,
    avatar: user.avatar,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
