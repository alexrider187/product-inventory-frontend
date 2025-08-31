// src/types/auth.ts

// Define possible roles once
export type Role = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

// For login form
export interface LoginCredentials {
  email: string;
  password: string;
}

// For register form
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
}
