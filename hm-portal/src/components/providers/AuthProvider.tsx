"use client";

import React, { createContext, useContext, ReactNode } from "react";

type UserRole = "ADMIN" | "MANAGER" | "INSPECTOR" | "CLIENT";

interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  companyId?: string | null;
  assignedCompanyIds?: string[];
  hasGlobalAccess?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isManager: boolean;
  isInspector: boolean;
  isClient: boolean;
  canEdit: boolean; // General flag for actions that change data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  user 
}: { 
  children: ReactNode;
  user: AuthUser | null;
}) {
  const role = user?.role;
  
  const value = {
    user,
    isAdmin: role === "ADMIN",
    isManager: role === "MANAGER",
    isInspector: role === "INSPECTOR",
    isClient: role === "CLIENT",
    // By default, ADMIN and MANAGER can edit everything. 
    // We can fine-tune permissions per component for INSPECTOR.
    canEdit: role === "ADMIN" || role === "MANAGER",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
