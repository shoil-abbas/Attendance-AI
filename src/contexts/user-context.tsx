'use client';
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { Student } from '@/lib/mock-data';

export type Role = 'teacher' | 'student' | 'admin';

interface UserContextType {
  role: Role;
  setRole: (role: Role) => void;
  name: string;
  user: Omit<Student, 'avatar'>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const savedRole = Cookies.get('userRole');
    return (savedRole as Role) || 'teacher';
  });

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    Cookies.set('userRole', newRole, { expires: 7 }); // Cookie expires in 7 days
  };

  useEffect(() => {
    const savedRole = Cookies.get('userRole');
    if (savedRole && savedRole !== role) {
      setRoleState(savedRole as Role);
    }
  }, []);

  const user = useMemo(() => {
    switch (role) {
      case 'student':
        return { id: 's1', name: 'Alice Johnson' };
      case 'admin':
        return { id: 'admin1', name: 'Admin User' };
      case 'teacher':
      default:
        return { id: 't1', name: 'Mr. Abhay Choudhary' };
    }
  }, [role]);

  const value = {
    role,
    setRole,
    name: user.name,
    user: user as Omit<Student, 'avatar'>, // Cast is safe for student role, others will have to be handled where used
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
