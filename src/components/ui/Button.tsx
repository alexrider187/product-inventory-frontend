import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "success" | "warning" | "danger" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled = false,
  ...props
}) => {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-dashboard-primary text-white hover:bg-blue-500",
    success: "bg-dashboard-success text-white hover:bg-green-600",
    warning: "bg-dashboard-warning text-white hover:bg-amber-600",
    danger: "bg-dashboard-danger text-white hover:bg-red-600",
    secondary: "bg-dashboard-card text-dashboard-text hover:bg-dashboard-border",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      disabled={disabled}
      className={`font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
